import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockData';

/**
 * Fetch all story sections for a given alumni ID ordered by display_order
 */
export async function getStorySections(alumniId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('story_sections')
        .select('*')
        .eq('alumni_id', alumniId)
        .order('display_order', { ascending: true });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Failed to fetch story sections from Supabase:', e);
    }
  }

  const stories = mockDb.getStories()
    .filter(s => s.alumni_id === alumniId)
    .sort((a, b) => a.display_order - b.display_order);
  return stories;
}

/**
 * Save / Replace entire story sections list for an alumnus
 * Handles adding, deleting, updating text/heading, and reordering display_order.
 */
export async function saveStorySections(alumniId, sections) {
  const sanitizedSections = sections.map((s, idx) => ({
    alumni_id: alumniId,
    heading: (s.heading || '').trim(),
    content: (s.content || '').trim(),
    display_order: idx + 1,
  })).filter(s => s.heading.length > 0 && s.content.length > 0);

  if (isSupabaseConfigured()) {
    try {
      // 1. Delete current sections
      const { error: deleteError } = await supabase
        .from('story_sections')
        .delete()
        .eq('alumni_id', alumniId);

      if (deleteError) throw deleteError;

      // 2. Insert sanitized sections if any exist
      if (sanitizedSections.length > 0) {
        const { data, error: insertError } = await supabase
          .from('story_sections')
          .insert(sanitizedSections)
          .select();

        if (insertError) throw insertError;
        return { success: true, data };
      }

      return { success: true, data: [] };
    } catch (e) {
      console.error('Failed to save story sections to Supabase:', e);
      throw e;
    }
  }

  // Mock implementation
  const allStories = mockDb.getStories().filter(s => s.alumni_id !== alumniId);
  const newCreated = sanitizedSections.map((s, idx) => ({
    id: `s-mock-${Date.now()}-${idx}`,
    ...s,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  mockDb.setStories([...allStories, ...newCreated]);
  return { success: true, data: newCreated };
}
