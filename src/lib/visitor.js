// ==============================================================================
// VISITOR IDENTIFIER & SESSION HELPER
// Generates and manages anonymous visitor UUIDs for likes and profile view deduplication
// ==============================================================================

const STORAGE_KEY = 'jnv_alumni_visitor_id';
const SEEN_FEATURED_KEY = 'jnv_seen_featured_alumni';

export function getVisitorIdentifier() {
  if (typeof window === 'undefined') return 'server-rendered-visitor';
  
  let visitorId = localStorage.getItem(STORAGE_KEY);
  if (!visitorId) {
    // Generate UUID v4
    visitorId = 'visitor-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(STORAGE_KEY, visitorId);
  }
  return visitorId;
}

export function getSeenFeaturedSession() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(SEEN_FEATURED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function recordSeenFeaturedSession(slugs) {
  if (typeof window === 'undefined') return;
  try {
    const current = getSeenFeaturedSession();
    const updated = Array.from(new Set([...current, ...slugs]));
    sessionStorage.setItem(SEEN_FEATURED_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store seen featured alumni', e);
  }
}
