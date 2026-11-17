import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockData';
import { getSeenFeaturedSession, recordSeenFeaturedSession } from '../lib/visitor';

// Generate URL slug from full name
export function slugify(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Fetch recent stories for Section 2 of Homepage
 */
export async function getRecentStories(limit = 6) {
  if (isSupabaseConfigured()) {
    try {
      // Query stories with their alumni parent
      const { data, error } = await supabase
        .from('story_sections')
        .select(`
          id,
          heading,
          content,
          created_at,
          alumni:alumni_id (
            id,
            full_name,
            slug,
            passing_year,
            current_position,
            profile_image_url,
            is_active
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit * 2);

      if (error) throw error;

      // Group by alumni so we don't display 5 sections from the same single alumnus
      const seenAlumni = new Set();
      const uniqueStories = [];
      for (const item of (data || [])) {
        if (item.alumni && item.alumni.is_active && !seenAlumni.has(item.alumni.id)) {
          seenAlumni.add(item.alumni.id);
          uniqueStories.push({
            id: item.id,
            heading: item.heading,
            contentPreview: item.content.length > 180 ? item.content.substring(0, 180) + '...' : item.content,
            created_at: item.created_at,
            alumnus: item.alumni,
          });
        }
        if (uniqueStories.length >= limit) break;
      }
      return uniqueStories;
    } catch (err) {
      console.warn('Supabase query failed, falling back to mock layer:', err);
    }
  }

  // Mock implementation
  const stories = mockDb.getStories();
  const alumni = mockDb.getAlumni().filter(a => a.is_active);
  const alumniMap = new Map(alumni.map(a => [a.id, a]));

  const sorted = [...stories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const seenAlumni = new Set();
  const recentStories = [];

  for (const s of sorted) {
    const alumnus = alumniMap.get(s.alumni_id);
    if (alumnus && !seenAlumni.has(alumnus.id)) {
      seenAlumni.add(alumnus.id);
      recentStories.push({
        id: s.id,
        heading: s.heading,
        contentPreview: s.content.length > 180 ? s.content.substring(0, 180) + '...' : s.content,
        created_at: s.created_at,
        alumnus: {
          id: alumnus.id,
          full_name: alumnus.full_name,
          slug: alumnus.slug,
          passing_year: alumnus.passing_year,
          current_position: alumnus.current_position,
          profile_image_url: alumnus.profile_image_url,
        }
      });
    }
    if (recentStories.length >= limit) break;
  }

  return recentStories;
}

/**
 * Fetch stories grouped by batch (passing_year) for Section 3
 */
export async function getBatchStories() {
  if (isSupabaseConfigured()) {
    try {
      const { data: alumniList, error } = await supabase
        .from('alumni')
        .select(`
          id,
          passing_year,
          full_name,
          slug,
          current_position,
          profile_image_url,
          story_sections (
            id,
            heading,
            content,
            created_at
          )
        `)
        .eq('is_active', true)
        .order('passing_year', { ascending: false });

      if (error) throw error;
      return processBatchGroups(alumniList || []);
    } catch (err) {
      console.warn('Batch stories query failed, falling back to mock:', err);
    }
  }

  // Mock implementation
  const alumni = mockDb.getAlumni().filter(a => a.is_active);
  const stories = mockDb.getStories();
  const storiesByAlumni = {};
  for (const s of stories) {
    if (!storiesByAlumni[s.alumni_id]) storiesByAlumni[s.alumni_id] = [];
    storiesByAlumni[s.alumni_id].push(s);
  }

  const enriched = alumni.map(a => ({
    ...a,
    story_sections: storiesByAlumni[a.id] || []
  }));

  return processBatchGroups(enriched);
}

function processBatchGroups(alumniList) {
  const batchMap = new Map();

  for (const alumnus of alumniList) {
    const year = alumnus.passing_year;
    if (!batchMap.has(year)) {
      batchMap.set(year, {
        passing_year: year,
        totalAlumni: 0,
        stories: [],
        alumniPreviews: [],
      });
    }
    const batch = batchMap.get(year);
    batch.totalAlumni += 1;
    if (batch.alumniPreviews.length < 3) {
      batch.alumniPreviews.push({
        id: alumnus.id,
        name: alumnus.full_name,
        slug: alumnus.slug,
        image: alumnus.profile_image_url,
        position: alumnus.current_position,
      });
    }
    if (alumnus.story_sections && alumnus.story_sections.length > 0) {
      for (const story of alumnus.story_sections) {
        if (batch.stories.length < 3) {
          batch.stories.push({
            id: story.id,
            heading: story.heading,
            authorName: alumnus.full_name,
            authorSlug: alumnus.slug,
            preview: story.content.substring(0, 100) + '...',
          });
        }
      }
    }
  }

  return Array.from(batchMap.values()).sort((a, b) => b.passing_year - a.passing_year);
}

/**
 * Weighted Random Selection for Section 4 (Featured Alumni)
 * Combines completeness, views, likes, story availability, recency, and randomness.
 * Avoids showing duplicate profiles seen in current browser session.
 */
export async function getFeaturedAlumni(limit = 4) {
  let alumniList = [];
  let likes = [];
  let views = [];
  let stories = [];

  if (isSupabaseConfigured()) {
    try {
      const { data: aData } = await supabase
        .from('alumni')
        .select('*, story_sections(*)')
        .eq('is_active', true);

      const { data: lData } = await supabase.from('likes').select('alumni_id');
      const { data: vData } = await supabase.from('profile_views').select('alumni_id');

      if (aData) {
        alumniList = aData;
        likes = lData || [];
        views = vData || [];
        stories = aData.flatMap(a => a.story_sections || []);
      }
    } catch (e) {
      console.warn('Supabase featured alumni failed, fallback to mock:', e);
    }
  }

  if (alumniList.length === 0) {
    alumniList = mockDb.getAlumni().filter(a => a.is_active);
    likes = mockDb.getLikes();
    views = mockDb.getViews();
    stories = mockDb.getStories();
  }

  const seenSessionSlugs = getSeenFeaturedSession();

  // Pre-calculate metrics for each alumnus
  const likesCountMap = {};
  for (const l of likes) {
    likesCountMap[l.alumni_id] = (likesCountMap[l.alumni_id] || 0) + 1;
  }

  const viewsCountMap = {};
  for (const v of views) {
    viewsCountMap[v.alumni_id] = (viewsCountMap[v.alumni_id] || 0) + 1;
  }

  const storiesCountMap = {};
  for (const s of stories) {
    storiesCountMap[s.alumni_id] = (storiesCountMap[s.alumni_id] || 0) + 1;
  }

  // Score each alumnus with weighted attributes
  const scoredAlumni = alumniList.map(a => {
    // 1. Profile completeness score (0 to 30)
    let completeness = 0;
    if (a.profile_image_url) completeness += 10;
    if (a.bio && a.bio.length > 20) completeness += 10;
    if (a.current_position) completeness += 5;
    if (a.location) completeness += 5;

    // 2. Story availability (0 to 25)
    const storyCount = storiesCountMap[a.id] || 0;
    const storyScore = Math.min(storyCount * 10, 25);

    // 3. Likes & Views balance (0 to 25)
    const likesCount = likesCountMap[a.id] || 0;
    const viewsCount = viewsCountMap[a.id] || 0;
    const socialScore = Math.min((likesCount * 3) + (viewsCount * 0.5), 25);

    // 4. Manual feature boost (15)
    const featuredBoost = a.is_featured ? 15 : 0;

    // 5. Randomness jitter (1 to 20) to ensure varied exposure
    const randomJitter = Math.random() * 20;

    // 6. Session seen penalty (-50) to give non-seen profiles a fair turn
    const sessionPenalty = seenSessionSlugs.includes(a.slug) ? -50 : 0;

    const totalWeight = Math.max(1, completeness + storyScore + socialScore + featuredBoost + randomJitter + sessionPenalty);

    return {
      ...a,
      weight: totalWeight,
      likesCount,
      viewsCount,
      storyCount,
    };
  });

  // Sort by weighted score
  scoredAlumni.sort((a, b) => b.weight - a.weight);

  const selected = scoredAlumni.slice(0, limit);

  // Record these selected slugs into session
  recordSeenFeaturedSession(selected.map(s => s.slug));

  return selected;
}

/**
 * Fetch Alumni Preview for Section 5 of Homepage
 */
export async function getAlumniPreview(limit = 8) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('public_alumni')
        .select('id, full_name, slug, passing_year, current_position, profile_image_url')
        .order('passing_year', { ascending: false })
        .limit(limit);

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase alumni preview failed:', e);
    }
  }

  const alumni = mockDb.getAlumni().filter(a => a.is_active);
  return alumni.slice(0, limit).map(a => ({
    id: a.id,
    full_name: a.full_name,
    slug: a.slug,
    passing_year: a.passing_year,
    current_position: a.current_position,
    profile_image_url: a.profile_image_url,
  }));
}

/**
 * Fetch alumni directory with search, filter, sort and pagination
 */
export async function getAlumniDirectory({
  search = '',
  batch = '',
  sort = 'year_desc',
  page = 1,
  pageSize = 12,
}) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('public_alumni')
        .select('id, full_name, slug, passing_year, current_position, company_or_institution, location, bio, profile_image_url', { count: 'exact' });

      if (search.trim()) {
        query = query.ilike('full_name', `%${search.trim()}%`);
      }

      if (batch) {
        query = query.eq('passing_year', parseInt(batch, 10));
      }

      switch (sort) {
        case 'name_asc':
          query = query.order('full_name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('full_name', { ascending: false });
          break;
        case 'year_asc':
          query = query.order('passing_year', { ascending: true });
          break;
        case 'year_desc':
        default:
          query = query.order('passing_year', { ascending: false });
          break;
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await query.range(from, to);

      if (!error) {
        return {
          alumni: data || [],
          totalCount: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize),
        };
      }
    } catch (e) {
      console.warn('Supabase directory query failed, fallback to mock:', e);
    }
  }

  // Mock implementation
  let list = mockDb.getAlumni().filter(a => a.is_active);

  if (search.trim()) {
    const s = search.toLowerCase().trim();
    list = list.filter(a => 
      a.full_name.toLowerCase().includes(s) || 
      (a.current_position && a.current_position.toLowerCase().includes(s))
    );
  }

  if (batch) {
    const y = parseInt(batch, 10);
    list = list.filter(a => a.passing_year === y);
  }

  switch (sort) {
    case 'name_asc':
      list.sort((a, b) => a.full_name.localeCompare(b.full_name));
      break;
    case 'name_desc':
      list.sort((a, b) => b.full_name.localeCompare(a.full_name));
      break;
    case 'year_asc':
      list.sort((a, b) => a.passing_year - b.passing_year);
      break;
    case 'year_desc':
    default:
      list.sort((a, b) => b.passing_year - a.passing_year);
      break;
  }

  const totalCount = list.length;
  const from = (page - 1) * pageSize;
  const paginated = list.slice(from, from + pageSize);

  return {
    alumni: paginated,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/**
 * Fetch a single alumnus by slug with stories, likes, and comments
 */
export async function getAlumnusBySlug(slug) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select(`
          id,
          full_name,
          slug,
          passing_year,
          current_position,
          company_or_institution,
          location,
          bio,
          email,
          contact_number,
          profile_image_url,
          is_active,
          created_at,
          story_sections (
            id,
            heading,
            content,
            display_order,
            created_at
          ),
          comments (
            id,
            visitor_name,
            comment_text,
            created_at,
            is_visible,
            moderation_status
          ),
          likes (
            id,
            visitor_identifier
          ),
          profile_views (
            id
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        // Sort story sections by display_order
        const sections = (data.story_sections || []).sort((a, b) => a.display_order - b.display_order);
        const visibleComments = (data.comments || [])
          .filter(c => c.is_visible && c.moderation_status === 'approved')
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return {
          ...data,
          story_sections: sections,
          comments: visibleComments,
          likesCount: (data.likes || []).length,
          viewsCount: (data.profile_views || []).length,
          rawLikes: data.likes || [],
        };
      }
    } catch (e) {
      console.warn('Supabase fetch by slug failed, fallback to mock:', e);
    }
  }

  // Mock implementation
  const alumni = mockDb.getAlumni().filter(a => a.is_active);
  const alumnus = alumni.find(a => a.slug === slug);
  if (!alumnus) return null;

  const stories = mockDb.getStories()
    .filter(s => s.alumni_id === alumnus.id)
    .sort((a, b) => a.display_order - b.display_order);

  const comments = mockDb.getComments()
    .filter(c => c.alumni_id === alumnus.id && c.is_visible && c.moderation_status === 'approved')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const likes = mockDb.getLikes().filter(l => l.alumni_id === alumnus.id);
  const views = mockDb.getViews().filter(v => v.alumni_id === alumnus.id);

  return {
    ...alumnus,
    story_sections: stories,
    comments,
    likesCount: likes.length,
    viewsCount: views.length,
    rawLikes: likes,
  };
}

/**
 * Check if a slug is available or generate unique one
 */
export async function getUniqueSlug(baseName, currentAlumniId = null) {
  let baseSlug = slugify(baseName);
  if (!baseSlug) baseSlug = 'alumnus';

  const allAlumni = isSupabaseConfigured()
    ? (await supabase.from('alumni').select('id, slug')).data || []
    : mockDb.getAlumni();

  const existingSlugs = new Set(
    allAlumni.filter(a => a.id !== currentAlumniId).map(a => a.slug)
  );

  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}
