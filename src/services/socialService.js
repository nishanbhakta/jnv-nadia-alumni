import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockData';

/**
 * Toggle like for a profile by visitorIdentifier
 */
export async function toggleLike(alumniId, visitorIdentifier) {
  if (isSupabaseConfigured()) {
    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('alumni_id', alumniId)
        .eq('visitor_identifier', visitorIdentifier)
        .maybeSingle();

      if (existing) {
        // Unlike
        await supabase.from('likes').delete().eq('id', existing.id);
        return { liked: false };
      } else {
        // Like
        await supabase.from('likes').insert({
          alumni_id: alumniId,
          visitor_identifier: visitorIdentifier,
        });
        return { liked: true };
      }
    } catch (e) {
      console.warn('Supabase toggleLike failed, falling back to mock:', e);
    }
  }

  // Mock implementation
  const likes = mockDb.getLikes();
  const existingIndex = likes.findIndex(
    l => l.alumni_id === alumniId && l.visitor_identifier === visitorIdentifier
  );

  if (existingIndex >= 0) {
    likes.splice(existingIndex, 1);
    mockDb.setLikes(likes);
    return { liked: false };
  } else {
    likes.push({
      id: `l-mock-${Date.now()}`,
      alumni_id: alumniId,
      visitor_identifier: visitorIdentifier,
      created_at: new Date().toISOString(),
    });
    mockDb.setLikes(likes);
    return { liked: true };
  }
}

/**
 * Check if the visitor has already liked this profile
 */
export async function checkHasLiked(alumniId, visitorIdentifier) {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('alumni_id', alumniId)
        .eq('visitor_identifier', visitorIdentifier)
        .maybeSingle();
      return Boolean(data);
    } catch (e) {
      console.warn('Supabase checkHasLiked failed:', e);
    }
  }

  const likes = mockDb.getLikes();
  return likes.some(l => l.alumni_id === alumniId && l.visitor_identifier === visitorIdentifier);
}

/**
 * Submit a comment on an alumni profile
 * Includes spam filtering, text validation, and rate limiting
 */
export async function submitComment({ alumniId, visitorName, commentText, visitorIdentifier, honeypot = '' }) {
  // 1. Honeypot check (hidden field bots fill)
  if (honeypot && honeypot.trim().length > 0) {
    throw new Error('Spam detected.');
  }

  // 2. Length validation
  const name = (visitorName || '').trim();
  const text = (commentText || '').trim();

  if (name.length < 2) {
    throw new Error('Please enter your name (at least 2 characters).');
  }
  if (text.length < 3) {
    throw new Error('Comment must be at least 3 characters.');
  }
  if (text.length > 1000) {
    throw new Error('Comment exceeds 1,000 characters limit.');
  }

  // 3. Basic spam keyword / link flooding check
  const urlCount = (text.match(/https?:\/\//gi) || []).length;
  if (urlCount > 2) {
    throw new Error('Comments containing multiple external links are flagged for spam prevention.');
  }

  // Rate limiting via localStorage timestamp
  const lastCommentTimeKey = `jnv_last_comment_${visitorIdentifier}`;
  const lastComment = localStorage.getItem(lastCommentTimeKey);
  const now = Date.now();
  if (lastComment && now - parseInt(lastComment, 10) < 15000) {
    throw new Error('Please wait a few seconds before posting another comment.');
  }
  localStorage.setItem(lastCommentTimeKey, now.toString());

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          alumni_id: alumniId,
          visitor_name: name,
          comment_text: text,
          visitor_identifier: visitorIdentifier,
          is_visible: true,
          moderation_status: 'approved',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      console.warn('Supabase submitComment failed, fallback to mock:', e);
    }
  }

  // Mock implementation
  const comments = mockDb.getComments();
  const newComment = {
    id: `c-mock-${Date.now()}`,
    alumni_id: alumniId,
    visitor_name: name,
    comment_text: text,
    visitor_identifier: visitorIdentifier,
    is_visible: true,
    moderation_status: 'approved',
    created_at: new Date().toISOString(),
  };

  mockDb.setComments([newComment, ...comments]);
  return { success: true, data: newComment };
}

/**
 * Record a profile view with a 1-hour session/visitor cooldown
 * Prevents automated or accidental refresh inflation
 */
export async function recordProfileView(alumniId, visitorIdentifier) {
  if (!alumniId || !visitorIdentifier) return;

  const viewCooldownKey = `jnv_view_${alumniId}_${visitorIdentifier}`;
  const lastViewTime = localStorage.getItem(viewCooldownKey);
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  if (lastViewTime && now - parseInt(lastViewTime, 10) < ONE_HOUR) {
    return; // Cooldown active, skip duplicate count
  }

  localStorage.setItem(viewCooldownKey, now.toString());

  if (isSupabaseConfigured()) {
    try {
      // Call Supabase database function
      await supabase.rpc('record_profile_view', {
        p_alumni_id: alumniId,
        p_visitor_identifier: visitorIdentifier,
      });
      return;
    } catch (e) {
      console.warn('Supabase record_profile_view failed:', e);
    }
  }

  // Mock implementation
  const views = mockDb.getViews();
  views.push({
    id: `v-mock-${Date.now()}`,
    alumni_id: alumniId,
    visitor_identifier: visitorIdentifier,
    viewed_at: new Date().toISOString(),
  });
  mockDb.setViews(views);
}
