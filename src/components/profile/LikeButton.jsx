import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike, checkHasLiked } from '../../services/socialService';
import { getVisitorIdentifier } from '../../lib/visitor';

export default function LikeButton({ alumniId, initialCount = 0 }) {
  const [likesCount, setLikesCount] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const visitorId = getVisitorIdentifier();

  useEffect(() => {
    async function checkStatus() {
      try {
        const liked = await checkHasLiked(alumniId, visitorId);
        setHasLiked(liked);
      } catch (e) {
        console.warn('Failed to verify like status:', e);
      }
    }
    checkStatus();
  }, [alumniId, visitorId]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    const nextHasLiked = !hasLiked;
    setHasLiked(nextHasLiked);
    setLikesCount(prev => (nextHasLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await toggleLike(alumniId, visitorId);
      setHasLiked(res.liked);
    } catch (e) {
      // Revert if error
      setHasLiked(!nextHasLiked);
      setLikesCount(prev => (nextHasLiked ? Math.max(0, prev - 1) : prev + 1));
      console.error('Toggle like failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-2xs ${
          hasLiked
            ? 'bg-maroon-50 text-maroon-800 border border-maroon-300/80 hover:bg-maroon-100/70'
            : 'bg-white text-charcoal-700 border border-stone-200 hover:border-maroon-300 hover:text-maroon-800 hover:bg-ivory-surface'
        }`}
        title={hasLiked ? 'Unlike this journey' : 'Appreciate this story'}
      >
        <Heart
          className={`h-4 sm:h-5 w-4 sm:w-5 transition-transform ${
            hasLiked ? 'text-maroon-700 fill-maroon-700 scale-110' : 'text-charcoal-400 group-hover:text-maroon-600'
          }`}
        />
        <span>{hasLiked ? 'Appreciated' : 'Appreciate Story'}</span>
        <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF9F5] text-maroon-900 border border-stone-200">
          {likesCount}
        </span>
      </button>
    </div>
  );
}
