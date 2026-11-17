import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Eye, BookOpen, MapPin, Briefcase, RefreshCw } from 'lucide-react';
import { getFeaturedAlumni } from '../../services/alumniService';

export default function FeaturedAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFeatured() {
    setLoading(true);
    try {
      const data = await getFeaturedAlumni(4);
      setAlumni(data);
    } catch (err) {
      console.error('Failed to load featured alumni:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Shuffle Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
              Dynamic Discovery
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Discover Our Alumni
            </h2>
            <p className="mt-2 text-base text-gray-600 max-w-2xl">
              Diverse profiles across years, industries, and life paths. Our weighted discovery gives fair exposure to every journey.
            </p>
          </div>

          <button
            type="button"
            onClick={loadFeatured}
            disabled={loading}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm disabled:opacity-50"
            title="Discover more alumni profiles"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            Shuffle Spotlight
          </button>
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 animate-pulse space-y-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumni.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Subtle Tricolor Accent Indicator */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-400 via-white to-navodaya-green opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Profile Photo */}
                <div className="relative mb-4 mt-2">
                  <img
                    src={person.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={person.full_name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 right-0 px-2 py-0.5 text-[10px] font-bold rounded-full bg-saffron-500 text-white shadow-sm">
                    {person.passing_year}
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-navodaya-navy transition-colors truncate max-w-full">
                  {person.full_name}
                </h3>
                
                <p className="text-xs font-semibold text-navodaya-green flex items-center gap-1 mt-1 truncate max-w-full">
                  <Briefcase className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{person.current_position || 'Navodaya Alumnus'}</span>
                </p>

                {person.location && (
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{person.location}</span>
                  </p>
                )}

                {/* Short Bio */}
                <p className="text-xs text-gray-600 line-clamp-3 mt-3 leading-relaxed flex-1">
                  {person.bio || 'Alumnus of JNV Nadia reconnecting with friends and sharing school memories.'}
                </p>

                {/* Community Metrics: Likes, Views, Stories */}
                <div className="flex items-center justify-center gap-4 py-3 my-2 border-y border-gray-100 w-full text-[11px] text-gray-500">
                  <span className="flex items-center gap-1" title={`${person.likesCount || 0} Likes`}>
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-50" />
                    {person.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1" title={`${person.viewsCount || 0} Profile views`}>
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    {person.viewsCount || 0}
                  </span>
                  <span className="flex items-center gap-1" title={`${person.storyCount || 0} Stories published`}>
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                    {person.storyCount || 0}
                  </span>
                </div>

                {/* View Profile Action */}
                <Link
                  to={`/alumni/${person.slug}`}
                  className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold text-center text-gray-700 bg-gray-50 group-hover:bg-saffron-500 group-hover:text-white transition-all shadow-sm"
                >
                  View Profile & Journey
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
