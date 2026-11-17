import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, UserCheck } from 'lucide-react';
import { getAlumniPreview } from '../../services/alumniService';

export default function AlumniPreview() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreview() {
      try {
        const data = await getAlumniPreview(8);
        setAlumni(data);
      } catch (err) {
        console.error('Failed to load alumni preview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-[#F8F9FA] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 mb-3">
            <Users className="h-3.5 w-3.5" />
            Connected Community
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Alumni
          </h2>
          <p className="mt-2 text-base text-gray-600">
            A growing registry of Navodayans who walked the corridors of JNV Nadia.
          </p>
        </div>

        {/* Directory Preview Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {alumni.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3.5 hover:border-navodaya-green hover:shadow-soft transition-all duration-200 group"
              >
                <img
                  src={person.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={person.full_name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-navodaya-navy">
                    {person.full_name}
                  </h4>
                  <p className="text-xs text-saffron-600 font-medium">
                    Batch of {person.passing_year}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {person.current_position || 'Navodayan'}
                  </p>
                </div>
                <Link
                  to={`/alumni/${person.slug}`}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-navodaya-green rounded-lg hover:bg-green-50 transition-colors"
                  title={`View ${person.full_name}'s Profile`}
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Prominent "See All Alumni" CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/alumni"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-navodaya-navy hover:bg-slate-900 shadow-md hover:shadow-lg transition-all group"
          >
            <UserCheck className="h-4 w-4" />
            <span>See All Alumni Directory</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
