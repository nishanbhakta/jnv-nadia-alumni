import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockData';

/**
 * Check if the current authenticated user is an administrator
 */
export async function verifyAdminStatus(user) {
  if (!user) return false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('administrators')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Error checking administrator status:', error);
        return false;
      }

      return Boolean(data);
    } catch (e) {
      console.warn('Admin check exception:', e);
      return false;
    }
  }

  // In local preview/demo mode, allow access if email starts with admin or mock admin session is set
  const isDemoAdmin = localStorage.getItem('jnv_demo_admin_active') === 'true' || 
    (user.email && user.email.toLowerCase().includes('admin'));
  return isDemoAdmin;
}

/**
 * Get dashboard overview metrics
 */
export async function getAdminStats() {
  if (isSupabaseConfigured()) {
    try {
      const [alumniRes, storiesRes, commentsRes, viewsRes, feedbackRes] = await Promise.all([
        supabase.from('alumni').select('id, created_at, full_name, email, passing_year', { count: 'exact' }),
        supabase.from('story_sections').select('id', { count: 'exact' }),
        supabase.from('comments').select('id', { count: 'exact' }),
        supabase.from('profile_views').select('id', { count: 'exact' }),
        supabase.from('feedback').select('id, name, email, category, message, status, created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
      ]);

      const recentAlumni = (alumniRes.data || [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      return {
        totalAlumni: alumniRes.count || 0,
        totalStories: storiesRes.count || 0,
        totalComments: commentsRes.count || 0,
        totalViews: viewsRes.count || 0,
        recentRegistrations: recentAlumni,
        recentFeedback: feedbackRes.data || [],
      };
    } catch (e) {
      console.warn('Supabase getAdminStats failed, fallback to mock:', e);
    }
  }

  const alumni = mockDb.getAlumni();
  const stories = mockDb.getStories();
  const comments = mockDb.getComments();
  const views = mockDb.getViews();
  const feedback = mockDb.getFeedback();

  const sortedAlumni = [...alumni].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const sortedFeedback = [...feedback].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    totalAlumni: alumni.length,
    totalStories: stories.length,
    totalComments: comments.length,
    totalViews: views.length,
    recentRegistrations: sortedAlumni.slice(0, 5),
    recentFeedback: sortedFeedback.slice(0, 5),
  };
}

/**
 * Get all alumni for admin management (including inactive/hidden)
 */
export async function getAllAlumniAdmin() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getAllAlumniAdmin failed:', e);
    }
  }
  return mockDb.getAlumni();
}

/**
 * Toggle active status of an alumni profile
 */
export async function toggleAlumniStatus(alumniId, isActive) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('alumni')
        .update({ is_active: isActive })
        .eq('id', alumniId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase toggleAlumniStatus failed:', e);
    }
  }

  const alumni = mockDb.getAlumni();
  const target = alumni.find(a => a.id === alumniId);
  if (target) {
    target.is_active = isActive;
    mockDb.setAlumni(alumni);
  }
  return true;
}

/**
 * Toggle featured status of an alumni profile
 */
export async function toggleAlumniFeatured(alumniId, isFeatured) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('alumni')
        .update({ is_featured: isFeatured })
        .eq('id', alumniId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase toggleAlumniFeatured failed:', e);
    }
  }

  const alumni = mockDb.getAlumni();
  const target = alumni.find(a => a.id === alumniId);
  if (target) {
    target.is_featured = isFeatured;
    mockDb.setAlumni(alumni);
  }
  return true;
}

/**
 * Delete an alumni profile
 */
export async function deleteAlumni(alumniId) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('alumni').delete().eq('id', alumniId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteAlumni failed:', e);
    }
  }

  const alumni = mockDb.getAlumni().filter(a => a.id !== alumniId);
  mockDb.setAlumni(alumni);
  return true;
}

/**
 * Get all comments for moderation
 */
export async function getAllCommentsAdmin() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          visitor_name,
          comment_text,
          is_visible,
          moderation_status,
          created_at,
          alumni:alumni_id (
            id,
            full_name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getAllCommentsAdmin failed:', e);
    }
  }

  const comments = mockDb.getComments();
  const alumni = mockDb.getAlumni();
  const map = new Map(alumni.map(a => [a.id, a]));

  return comments.map(c => ({
    ...c,
    alumni: map.get(c.alumni_id) ? {
      id: c.alumni_id,
      full_name: map.get(c.alumni_id).full_name,
      slug: map.get(c.alumni_id).slug,
    } : null
  }));
}

/**
 * Update comment moderation status
 */
export async function updateCommentStatus(commentId, isVisible, moderationStatus = 'approved') {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          is_visible: isVisible,
          moderation_status: moderationStatus,
        })
        .eq('id', commentId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updateCommentStatus failed:', e);
    }
  }

  const comments = mockDb.getComments();
  const c = comments.find(item => item.id === commentId);
  if (c) {
    c.is_visible = isVisible;
    c.moderation_status = moderationStatus;
    mockDb.setComments(comments);
  }
  return true;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteComment failed:', e);
    }
  }

  const comments = mockDb.getComments().filter(c => c.id !== commentId);
  mockDb.setComments(comments);
  return true;
}

/**
 * Get all feedback for admin
 */
export async function getAllFeedbackAdmin() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getAllFeedbackAdmin failed:', e);
    }
  }

  return mockDb.getFeedback();
}

/**
 * Update feedback status
 */
export async function updateFeedbackStatus(feedbackId, status) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', feedbackId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updateFeedbackStatus failed:', e);
    }
  }

  const list = mockDb.getFeedback();
  const item = list.find(f => f.id === feedbackId);
  if (item) {
    item.status = status;
    mockDb.setFeedback(list);
  }
  return true;
}

/**
 * Delete feedback
 */
export async function deleteFeedback(feedbackId) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('feedback').delete().eq('id', feedbackId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteFeedback failed:', e);
    }
  }

  const list = mockDb.getFeedback().filter(f => f.id !== feedbackId);
  mockDb.setFeedback(list);
  return true;
}
