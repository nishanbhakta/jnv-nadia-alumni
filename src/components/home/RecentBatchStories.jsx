import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Calendar, BookOpen, PenSquare } from 'lucide-react';
import { getRecentBatchStories } from '../../services/alumniService';

export default function RecentBatchStories() {
  const [data, setData] = useState({ passingYear: null, stories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentBatch() {
      try {
        const result = await getRecentBatchStories();
        setData(result);
      } catch (err) {
        console.error('Failed to load stories from the recent batch:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecentBatch();
  }, []);

  const { passingYear, stories } = data;

  return (
    <section id="batch-stories" className="py-10 sm:py-14 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50 border border-maroon-200/80 mb-2">
              <GraduationCap className="h-3.5 w-3.5 text-maroon-700" />
              <span>Newest Alumni Cohort</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight font-serif">
              Stories From the Recent Batch
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-charcoal-600 max-w-xl leading-relaxed">
              {passingYear
                ? `Exclusive reflections, campus memories, and milestones from our newest graduating alumni — Batch of ${passingYear}.`
                : 'Exclusive reflections and milestones shared by our most recent graduating alumni.'}
            </p>
          </div>

          {passingYear && (
            <div className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-maroon-900 bg-maroon-50 border border-maroon-200/80">
              <span className="w-2 h-2 rounded-full bg-maroon-700" />
              <span>Batch of {passingYear}</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-ivory-surface rounded-2xl p-4 sm:p-5 border border-stone-200/80 animate-pulse space-y-3 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-stone-200 rounded w-1/2" />
                    <div className="h-2.5 bg-stone-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-4 bg-stone-200 rounded w-4/5" />
                <div className="h-10 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          /* Clean Empty State - strictly does NOT mix older batches */
          <div className="text-center py-12 px-6 bg-ivory-surface rounded-2xl border border-dashed border-stone-300 max-w-2xl mx-auto shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-maroon-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <BookOpen className="h-6 w-6 text-maroon-700" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 font-serif">
              No stories published yet from the Batch of {passingYear || 'Recent Alumni'}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Are you an alumnus from our most recent graduating class? Be the first to share your Navodaya memories and inspire the school community!
            </p>
            <div className="mt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-maroon-800 hover:bg-maroon-900 transition-colors shadow-2xs"
              >
                <PenSquare className="h-3.5 w-3.5 text-gold-300" />
                <span>Share Your Story</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Stories from the most recent batch */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {stories.map((story) => (
              <article
                key={story.id}
                className="flex flex-col bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-soft hover:shadow-card hover:border-maroon-300/80 hover:-translate-y-1 transition-all duration-200 group"
              >
                {/* Author Info with Profile Photo */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={story.authorImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={story.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 flex-shrink-0 ring-1 ring-gold-400/30"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/alumni/${story.authorSlug}`}
                      className="font-bold text-sm text-charcoal-900 group-hover:text-maroon-800 transition-colors truncate block"
                    >
                      {story.authorName}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[11px] text-charcoal-500 mt-0.5">
                      <span className="font-bold text-maroon-800 bg-maroon-50 px-1.5 py-0.2 rounded text-[10px]">
                        Batch of {story.passingYear}
                      </span>
                      <span>•</span>
                      <span className="truncate">{story.authorPosition || 'Recent Graduate'}</span>
                    </div>
                  </div>
                </div>

                {/* Story Heading */}
                <h3 className="font-bold text-base text-charcoal-900 group-hover:text-maroon-800 transition-colors line-clamp-1 mb-1.5 font-serif">
                  {story.heading}
                </h3>

                {/* Story Preview */}
                <p className="text-charcoal-600 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
                  {story.contentPreview}
                </p>

                {/* Card Footer */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500 mt-auto">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="h-3 w-3 text-charcoal-400" />
                    {new Date(story.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <Link
                    to={`/alumni/${story.authorSlug}`}
                    className="inline-flex items-center gap-1 font-bold text-xs text-maroon-800 hover:text-maroon-950 transition-colors"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 text-gold-600" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
