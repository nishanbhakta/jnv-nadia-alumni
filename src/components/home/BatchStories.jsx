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
    <section className="py-16 sm:py-20 bg-[#F8F9FA] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-navodaya-green bg-green-50 border border-green-200 mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            Batch Solidarity
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Stories From Your Batch
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Relive memories and celebrate the milestones of the classmates you shared classrooms, sports grounds, and dining halls with.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 p-8 max-w-lg mx-auto">
            <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Batch groupings will appear as alumni register.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.passing_year}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:border-saffron-300 hover:shadow-card transition-all duration-300 group"
              >
                <div>
                  {/* Top Badge: Year & Count */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                        Graduating Class
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-navodaya-navy transition-colors">
                        Batch of {batch.passing_year}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      <Users className="h-3 w-3 text-gray-500" />
                      {batch.totalAlumni} {batch.totalAlumni === 1 ? 'alumnus' : 'alumni'}
                    </span>
                  </div>

                  {/* Stories Preview List */}
                  <div className="space-y-3 my-4">
                    {batch.stories.length > 0 ? (
                      batch.stories.slice(0, 2).map((story) => (
                        <div key={story.id} className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <Link
                            to={`/alumni/${story.authorSlug}`}
                            className="font-bold text-gray-800 hover:text-saffron-600 block line-clamp-1 mb-1"
                          >
                            {story.heading}
                          </Link>
                          <p className="text-gray-500 line-clamp-2 leading-relaxed">
                            {story.preview}
                          </p>
                          <span className="block mt-1 text-[11px] text-gray-400 italic">
                            By {story.authorName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic py-2">
                        No stories posted yet for this batch.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer action to filter directory by batch */}
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <Link
                    to={`/alumni?batch=${batch.passing_year}`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-gray-700 hover:text-navodaya-green transition-colors"
                  >
                    <span>Browse Batch {batch.passing_year}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-gray-400 group-hover:text-navodaya-green" />
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
