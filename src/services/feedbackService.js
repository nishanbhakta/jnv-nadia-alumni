import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockData';

export async function submitFeedback({ name = '', email = '', category, message, honeypot = '' }) {
  // Honeypot spam trap
  if (honeypot && honeypot.trim().length > 0) {
    throw new Error('Spam detected.');
  }

  const validCategories = [
    'Website suggestion',
    'Technical issue',
    'Content correction',
    'General feedback'
  ];

  if (!category || !validCategories.includes(category)) {
    throw new Error('Please select a valid feedback category.');
  }

  const cleanMessage = (message || '').trim();
  if (cleanMessage.length < 5) {
    throw new Error('Please provide at least 5 characters in your feedback message.');
  }

  if (cleanMessage.length > 3000) {
    throw new Error('Feedback message exceeds 3,000 characters limit.');
  }

  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();

  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Please enter a valid email address, or leave it blank.');
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          name: cleanName || null,
          email: cleanEmail || null,
          category,
          message: cleanMessage,
          status: 'new',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      console.warn('Supabase submitFeedback failed, falling back to mock:', e);
    }
  }

  // Mock implementation
  const feedbackList = mockDb.getFeedback();
  const newFeedback = {
    id: `f-mock-${Date.now()}`,
    name: cleanName || 'Anonymous Alumnus/Visitor',
    email: cleanEmail || null,
    category,
    message: cleanMessage,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  mockDb.setFeedback([newFeedback, ...feedbackList]);
  return { success: true, data: newFeedback };
}
