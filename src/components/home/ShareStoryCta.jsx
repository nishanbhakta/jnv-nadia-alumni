import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle, BookOpen, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ShareStoryCta() {
  const { user } = useAuth();

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-b border-gray-100">
      {/* Subtle decorative background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-saffron-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 mb-6 shadow-sm">
          <Sparkles className="h-4 w-4 text-saffron-500" />
          Every Story Counts
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Your Journey Is Part of Our Story
        </h2>

        <p className="mt-5 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          From classroom memories to professional achievements, every journey matters. 
          Share your experiences and reconnect with your JNV family.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? "/profile/edit" : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-navodaya-green hover:bg-navodaya-darkGreen shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            <span>{user ? "Update Your Stories" : "Create Your Alumni Profile"}</span>
          </Link>

          <Link
            to="/alumni"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <BookOpen className="h-5 w-5 text-gray-400" />
            <span>Read Other Journeys</span>
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Takes less than 2 minutes. Free and private to our JNV Nadia community.
        </p>
      </div>
    </section>
  );
}
