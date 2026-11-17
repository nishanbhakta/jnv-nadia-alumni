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
        className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
          hasLiked
            ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
            : 'bg-white text-gray-700 border border-gray-300 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50'
        }`}
        title={hasLiked ? 'Unlike this journey' : 'Appreciate this story'}
      >
        <Heart
          className={`h-5 w-5 transition-transform ${
            hasLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-gray-400 group-hover:text-rose-500'
          }`}
        />
        <span>{hasLiked ? 'Appreciated' : 'Appreciate Story'}</span>
        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-gray-100 text-gray-800">
          {likesCount}
        </span>
      </button>
    </div>
  );
}
