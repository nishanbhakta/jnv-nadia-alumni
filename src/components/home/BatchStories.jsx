import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookMarked, ArrowUpRight, GraduationCap } from 'lucide-react';
import { getBatchStories } from '../../services/alumniService';

export default function BatchStories() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBatches() {
      try {
        const data = await getBatchStories();
        setBatches(data);
      } catch (err) {
        console.error('Failed to load batch stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  return (
    <section id="batch-stories" className="py-14 sm:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50 border border-maroon-200/80 mb-3">
            <GraduationCap className="h-3.5 w-3.5 text-maroon-700" />
            Batch Solidarity
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight font-serif">
            Stories From Your Batch
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-600 leading-relaxed">
            Relive memories and celebrate the milestones of the classmates you shared classrooms, sports grounds, and dining halls with.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-ivory-surface rounded-2xl p-6 border border-stone-200/80 animate-pulse space-y-4 shadow-soft">
                <div className="h-6 bg-stone-200 rounded w-1/2" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-20 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-10 bg-ivory-surface rounded-2xl border border-stone-200 p-8 max-w-lg mx-auto shadow-soft">
            <GraduationCap className="h-10 w-10 text-charcoal-400 mx-auto mb-2" />
            <p className="text-charcoal-600 font-medium text-sm">Batch groupings will appear as alumni register.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.passing_year}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 flex flex-col justify-between hover:border-gold-400 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 group shadow-soft"
              >
                <div>
                  {/* Top Badge: Year & Count */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                        Graduating Class
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 group-hover:text-maroon-900 transition-colors font-serif">
                        Batch of {batch.passing_year}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-ivory-surface text-charcoal-700 border border-stone-200">
                      <Users className="h-3 w-3 text-gold-600" />
                      {batch.totalAlumni} {batch.totalAlumni === 1 ? 'alumnus' : 'alumni'}
                    </span>
                  </div>

                  {/* Stories Preview List */}
                  <div className="space-y-2.5 my-4">
                    {batch.stories.length > 0 ? (
                      batch.stories.slice(0, 2).map((story) => (
                        <div key={story.id} className="text-xs bg-[#FAF9F5] p-3 rounded-xl border border-stone-200/70">
                          <Link
                            to={`/alumni/${story.authorSlug}`}
                            className="font-bold text-charcoal-900 hover:text-maroon-800 block line-clamp-1 mb-1 font-serif"
                          >
                            {story.heading}
                          </Link>
                          <p className="text-charcoal-600 line-clamp-2 leading-relaxed text-[11px]">
                            {story.preview}
                          </p>
                          <span className="block mt-1 text-[10px] text-charcoal-400 italic">
                            By {story.authorName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-charcoal-400 italic py-2">
                        No stories posted yet for this batch.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer action to filter directory by batch */}
                <div className="pt-4 border-t border-stone-100 mt-4">
                  <Link
                    to={`/alumni?batch=${batch.passing_year}`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-maroon-800 hover:text-maroon-950 transition-colors"
                  >
                    <span>Browse Batch {batch.passing_year}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-gold-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
