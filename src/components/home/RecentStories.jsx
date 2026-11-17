import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react';
import { getRecentStories } from '../../services/alumniService';

export default function RecentStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await getRecentStories(6);
        setStories(data);
      } catch (err) {
        console.error('Failed to load recent stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <section id="recent-stories" className="py-14 sm:py-20 bg-[#FAF9F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50 border border-maroon-200/80 mb-3">
              <BookOpen className="h-3.5 w-3.5 text-maroon-700" />
              Living Chronicles
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight font-serif">
              Recent Stories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-charcoal-600 max-w-2xl leading-relaxed">
              Fresh perspectives, nostalgic school recollections, and career reflections shared by fellow Navodayans.
            </p>
          </div>

          <Link
            to="/alumni"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-maroon-800 hover:text-maroon-950 group transition-colors"
          >
            Explore all alumni profiles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-gold-600" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-stone-200/80 animate-pulse space-y-4 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-200 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="h-3 bg-stone-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-5 bg-stone-200 rounded w-4/5" />
                <div className="h-16 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 shadow-soft">
            <BookOpen className="h-10 w-10 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-charcoal-800">No stories published yet</h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-sm mx-auto">
              Be the very first alumnus to share your Navodaya memories and inspiring life journey!
            </p>
            <Link
              to="/register"
              className="mt-4 inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl text-white bg-maroon-800 hover:bg-maroon-900 transition-colors shadow-xs"
            >
              Share Your Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <article
                key={story.id}
                className="flex flex-col bg-white rounded-2xl border border-stone-200/90 p-6 shadow-soft hover:shadow-card hover:border-maroon-300/80 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={story.alumnus?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={story.alumnus?.full_name}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200 flex-shrink-0 ring-1 ring-gold-400/30"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/alumni/${story.alumnus?.slug}`}
                      className="font-bold text-sm sm:text-base text-charcoal-900 group-hover:text-maroon-800 transition-colors truncate block"
                    >
                      {story.alumnus?.full_name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-charcoal-500 mt-0.5">
                      <span className="font-bold text-maroon-800 bg-maroon-50 px-1.5 py-0.5 rounded text-[10px]">
                        Batch of {story.alumnus?.passing_year}
                      </span>
                      <span>•</span>
                      <span className="truncate">{story.alumnus?.current_position || 'Navodayan'}</span>
                    </div>
                  </div>
                </div>

                {/* Story Heading */}
                <h3 className="font-bold text-base sm:text-lg text-charcoal-900 group-hover:text-maroon-800 transition-colors line-clamp-1 mb-2 font-serif">
                  {story.heading}
                </h3>

                {/* Story Content Preview */}
                <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {story.contentPreview}
                </p>

                {/* Card Footer */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500 mt-auto">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-charcoal-400" />
                    {new Date(story.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <Link
                    to={`/alumni/${story.alumnus?.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-xs text-maroon-800 hover:text-maroon-950 transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 text-gold-600" />
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
