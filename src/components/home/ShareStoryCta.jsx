import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ShareStoryCta() {
  const { user } = useAuth();

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5] relative overflow-hidden border-b border-stone-200/80">
      {/* Subtle decorative background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-maroon-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gold-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-white border border-gold-300/70 mb-6 shadow-2xs">
          <Sparkles className="h-4 w-4 text-gold-600" />
          Every Story Counts
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight leading-tight font-serif">
          Your Journey Is Part of Our Story
        </h2>

        <p className="mt-4 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed font-normal">
          From classroom memories to professional achievements, every journey matters. 
          Share your experiences and reconnect with your JNV family.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to={user ? "/profile/edit" : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-maroon-800 hover:bg-maroon-900 border border-maroon-950/30 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
          >
            <PlusCircle className="h-4 w-4 text-gold-300" />
            <span>{user ? "Update Your Stories" : "Create Your Alumni Profile"}</span>
          </Link>

          <Link
            to="/alumni"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-charcoal-700 bg-white hover:bg-ivory-surface border border-stone-200/90 shadow-2xs transition-colors"
          >
            <BookOpen className="h-4 w-4 text-charcoal-400" />
            <span>Read Other Journeys</span>
          </Link>
        </div>

        <p className="mt-4 text-xs text-charcoal-500">
          Takes less than 2 minutes. Free and private to our JNV Nadia community.
        </p>
      </div>
    </section>
  );
}
