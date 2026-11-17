import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Compass, Users, Heart, ArrowRight } from 'lucide-react';
import Seo from '../components/common/Seo';
import Logo from '../components/common/Logo';

export default function AboutPage() {
  const developerSlug = import.meta.env.VITE_DEVELOPER_SLUG || 'nishan-bhakta';

  return (
    <div className="py-14 sm:py-20 bg-[#FBFBF9] min-h-screen">
      <Seo
        title="About JNV Nadia Alumni | Heritage & Culture"
        description="Learn about Jawahar Navodaya Vidyalaya, Nadia, its residential culture, the migration system, and the alumni portal mission."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50/70 border border-maroon-200/80">
            <GraduationCap className="h-3.5 w-3.5 text-maroon-700" />
            Our Roots & Heritage
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight font-display">
            The Navodaya Legacy at Nadia
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            From the banks of the sacred rivers of Nadia district to academic and professional halls worldwide.
          </p>
        </div>

        {/* School Campus Photo Card */}
        <div className="overflow-hidden rounded-3xl border border-stone-200/90 shadow-card bg-white">
          <img
            src="/background.png"
            alt="Jawahar Navodaya Vidyalaya Nadia Campus and Garden"
            className="w-full h-64 sm:h-80 md:h-96 object-cover object-center"
          />
          <div className="p-4 sm:p-5 bg-ivory-surface/70 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-600">
            <span className="font-bold text-charcoal-900 font-sans">
              Jawahar Navodaya Vidyalaya, Nadia Campus
            </span>
            <span className="text-charcoal-500 font-medium font-sans">
              West Bengal, India
            </span>
          </div>
        </div>

        {/* Narrative Card */}
        <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-8 sm:p-12 space-y-8 text-charcoal-700 font-serif leading-relaxed text-base sm:text-lg">
          <div>
            <h2 className="text-2xl font-black font-sans text-charcoal-900 mb-4 tracking-tight">
              A Home Beyond Classrooms
            </h2>
            <p>
              Established under the visionary National Policy on Education, Jawahar Navodaya Vidyalaya, Nadia 
              stands as a beacon of quality residential schooling for talented rural children in West Bengal.
              For seven crucial formative years (Class 6 through 12), our campus becomes more than an institution: 
              it becomes our home, our playground, and our testing ground.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black font-sans text-charcoal-900 mb-4 tracking-tight">
              The Four Houses & Daily Rhythms
            </h2>
            <p>
              Whether competing under the banners of <strong>Aravali</strong>, <strong>Nilgiri</strong>, <strong>Shivalik</strong>, 
              or <strong>Udaygiri</strong>, every student learned that camaraderie surpasses competition. 
              The 5:30 AM physical training whistle, breakfast in the common mess, the silence of evening self-study prep, 
              and the joy of inter-house cultural evenings built bonds that decades and distances cannot erode.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black font-sans text-charcoal-900 mb-4 tracking-tight">
              National Integration & Migration
            </h2>
            <p>
              One of Navodaya’s most transformative experiences is the Class 9 migration scheme. Spending a full academic 
              year in a paired Vidyalaya in a non-Hindi or Hindi speaking state broke down regional barriers, 
              opened our horizons, and taught us to embrace India’s boundless diversity with love and respect.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black font-sans text-charcoal-900 mb-4 tracking-tight">
              Purpose of This Alumni Community Portal
            </h2>
            <p>
              Unlike generic social media platforms filled with algorithmic noise, <strong>JNV Nadia Alumni</strong> is 
              built with an editorial philosophy prioritizing simplicity, authentic long-form storytelling, 
              and a searchable directory of alumni. It ensures that no graduate, whether from the founding batches 
              or the newest graduating class, loses touch with their Navodaya family.
            </p>
          </div>
        </div>

        {/* Founding & Developer Tribute */}
        <div className="bg-gradient-to-r from-maroon-50/70 via-white to-ivory-surface rounded-3xl border border-stone-200/90 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-maroon-800 text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-md border border-maroon-900/30">
            NB
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg font-bold text-charcoal-900 font-sans">
              Built with Heart for JNV Nadia
            </h3>
            <p className="text-sm text-charcoal-600 mt-1 font-sans">
              Initiated, designed, and developed by{' '}
              <Link
                to={`/alumni/${developerSlug}`}
                className="font-bold text-maroon-800 hover:text-maroon-950 underline decoration-gold-400 decoration-2"
              >
                Nishan Bhakta
              </Link>{' '}
              (Batch 2016) to celebrate and preserve our shared school memories.
            </p>
          </div>
          <Link
            to="/register"
            className="px-6 py-3 rounded-full text-xs font-bold text-white bg-maroon-800 hover:bg-maroon-900 shadow-xs hover:shadow transition-all font-sans whitespace-nowrap border border-maroon-900/30"
          >
            Join Our Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
