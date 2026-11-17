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
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50 border border-maroon-200/80 mb-3">
            <Users className="h-3.5 w-3.5 text-maroon-700" />
            Connected Community
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight font-serif">
            Our Alumni
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-600 leading-relaxed">
            A growing registry of Navodayans who walked the corridors of JNV Nadia.
          </p>
        </div>

        {/* Directory Preview Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-ivory-surface rounded-xl p-2.5 sm:p-4 border border-stone-200/80 animate-pulse flex items-center gap-2 sm:gap-3 shadow-soft">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-stone-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-3 sm:h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-2.5 sm:h-3 bg-stone-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {alumni.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-xl border border-stone-200/90 p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3.5 hover:border-gold-400 hover:shadow-soft transition-all duration-200 group shadow-2xs"
              >
                <img
                  src={person.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={person.full_name}
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border border-stone-200 flex-shrink-0 ring-1 ring-gold-400/30"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 truncate group-hover:text-maroon-800 transition-colors font-serif">
                    {person.full_name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-maroon-800 font-bold">
                    Batch {person.passing_year}
                  </p>
                  <p className="text-[10px] sm:text-xs text-charcoal-500 truncate">
                    {person.current_position || 'Navodayan'}
                  </p>
                </div>
                <Link
                  to={`/alumni/${person.slug}`}
                  className="flex-shrink-0 p-1 sm:p-2 text-charcoal-400 hover:text-maroon-800 rounded-lg hover:bg-maroon-50 transition-colors"
                  title={`View ${person.full_name}'s Profile`}
                >
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-600" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Prominent "See All Alumni" CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/alumni"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-maroon-800 hover:bg-maroon-900 border border-maroon-950/30 shadow-sm hover:shadow transition-all group"
          >
            <UserCheck className="h-4 w-4 text-gold-300" />
            <span>See All Alumni Directory</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-gold-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
