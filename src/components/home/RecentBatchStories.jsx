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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2.5 sm:gap-x-6 gap-y-10 sm:gap-y-16 pt-8 sm:pt-14">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl sm:rounded-[24px] p-2.5 sm:px-6 sm:pb-6 pt-0 border border-stone-200/80 animate-pulse space-y-2 sm:space-y-4 shadow-soft">
                <div className="w-14 h-14 sm:w-28 sm:h-28 bg-stone-200 rounded-full mx-auto -mt-7 sm:-mt-14 border-2 sm:border-4 border-stone-300" />
                <div className="h-3.5 sm:h-5 bg-stone-200 rounded w-2/3 mx-auto" />
                <div className="h-2.5 sm:h-3.5 bg-stone-200 rounded w-1/2 mx-auto" />
                <div className="h-px bg-stone-200 w-full my-2 sm:my-4" />
                <div className="h-3.5 sm:h-5 bg-stone-200 rounded w-4/5" />
                <div className="h-8 sm:h-12 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          /* Clean Empty State - strictly does NOT mix older batches */
          <div className="text-center py-10 px-4 sm:px-6 bg-ivory-surface rounded-2xl border border-dashed border-stone-300 max-w-2xl mx-auto shadow-2xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-stone-200 text-maroon-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-maroon-700" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-charcoal-900 font-serif">
              No stories published yet from the Batch of {passingYear || 'Recent Alumni'}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Are you an alumnus from our most recent graduating class? Be the first to share your Navodaya memories and inspire the school community!
            </p>
            <div className="mt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-maroon-800 hover:bg-maroon-900 transition-colors shadow-2xs"
              >
                <PenSquare className="h-3.5 w-3.5 text-gold-300" />
                <span>Share Your Story</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Head-Pop Story Cards 2-3 Cards Row Responsive Grid */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2.5 sm:gap-x-6 gap-y-10 sm:gap-y-16 pt-8 sm:pt-14">
            {stories.map((story) => (
              <article
                key={story.id}
                className="relative flex flex-col bg-white rounded-2xl sm:rounded-[24px] border border-stone-200/90 p-2.5 sm:px-6 sm:pb-6 pt-0 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_45px_rgba(118,10,33,0.12)] hover:border-maroon-300/80 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* 1. Large Overlapping Circular Profile Image (Top-Center Head-Pop) */}
                <div className="-mt-7 sm:-mt-14 mb-2 sm:mb-4 flex justify-center">
                  <Link to={`/alumni/${story.authorSlug}`} className="block group/avatar focus:outline-none">
                    <img
                      src={story.authorImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={story.authorName}
                      className="w-14 h-14 sm:w-28 sm:h-28 rounded-full object-cover object-center border-[3px] sm:border-[5px] border-[#760A21] shadow-[0_8px_20px_rgba(118,10,33,0.22)] ring-2 sm:ring-4 ring-white group-hover/avatar:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* 2. Alumni Name in large, bold, elegant typography */}
                <Link
                  to={`/alumni/${story.authorSlug}`}
                  className="text-center font-serif text-xs sm:text-xl font-black text-charcoal-900 group-hover:text-[#760A21] transition-colors block truncate tracking-tight"
                >
                  {story.authorName}
                </Link>

                {/* 3. Batch year and profession on the next line, using subtle maroon accent */}
                <p className="text-center text-[9px] sm:text-sm text-charcoal-600 mt-0.5 sm:mt-1 flex items-center justify-center gap-1 flex-wrap line-clamp-1">
                  <span className="font-bold text-[#760A21]">Batch of {story.passingYear}</span>
                  <span className="text-stone-300">•</span>
                  <span className="font-medium text-charcoal-700 truncate">{story.authorPosition || 'Recent Graduate'}</span>
                </p>

                {/* 4. A thin divider */}
                <div className="w-full h-px bg-stone-200/90 my-2 sm:my-4" />

                {/* 5. Story title in bold, prominent typography, left-aligned */}
                <h3 className="text-left font-serif text-[11px] sm:text-base font-bold text-charcoal-900 group-hover:text-[#760A21] transition-colors mb-1 sm:mb-2 line-clamp-2 leading-snug">
                  {story.heading}
                </h3>

                {/* 6. Story description in smaller, muted text, left-aligned, limited to 2-3 lines */}
                <p className="text-left text-[9px] sm:text-xs text-charcoal-600 leading-relaxed mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-1">
                  {story.contentPreview}
                </p>

                {/* 7. Bottom section: publication date on left, maroon 'Read →' link on right */}
                <div className="pt-2 sm:pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500 mt-auto w-full">
                  <span className="flex items-center gap-1 text-[8px] sm:text-xs text-charcoal-400">
                    <Calendar className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-stone-400" />
                    {new Date(story.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <Link
                    to={`/alumni/${story.authorSlug}`}
                    className="inline-flex items-center gap-1 font-bold text-[9px] sm:text-sm text-[#760A21] hover:text-[#520516] transition-colors group/read"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover/read:translate-x-1" />
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
