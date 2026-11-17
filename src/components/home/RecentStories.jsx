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
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              Living Chronicles
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Recent Stories
            </h2>
            <p className="mt-2 text-base text-gray-600 max-w-2xl">
              Fresh perspectives, nostalgic school recollections, and career reflections shared by fellow Navodayans.
            </p>
          </div>

          <Link
            to="/alumni"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-600 hover:text-saffron-700 group transition-colors"
          >
            Explore all alumni profiles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-4/5" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800">No stories published yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Be the very first alumnus to share your Navodaya memories and inspiring life journey!
            </p>
            <Link
              to="/register"
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-navodaya-green hover:bg-navodaya-darkGreen transition-colors"
            >
              Share Your Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <article
                key={story.id}
                className="flex flex-col bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={story.alumnus?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={story.alumnus?.full_name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/alumni/${story.alumnus?.slug}`}
                      className="font-bold text-gray-900 group-hover:text-navodaya-navy transition-colors truncate block"
                    >
                      {story.alumnus?.full_name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold text-saffron-600">Batch of {story.alumnus?.passing_year}</span>
                      <span>•</span>
                      <span className="truncate">{story.alumnus?.current_position || 'Navodayan'}</span>
                    </div>
                  </div>
                </div>

                {/* Story Heading */}
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-saffron-600 transition-colors line-clamp-1 mb-2">
                  {story.heading}
                </h3>

                {/* Story Content Preview */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {story.contentPreview}
                </p>

                {/* Card Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {new Date(story.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <Link
                    to={`/alumni/${story.alumnus?.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-navodaya-green hover:text-navodaya-darkGreen transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
