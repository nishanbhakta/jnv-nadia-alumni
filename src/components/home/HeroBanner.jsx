import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Users, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function HeroBanner() {
  const { user } = useAuth();

  return (
    <div className="relative bg-white overflow-hidden border-b border-gray-100">
      {/* Subtle backdrop shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60 -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
        <div className="max-w-3xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-saffron-500 animate-ping" />
            <span>Jawahar Navodaya Vidyalaya, Nadia • West Bengal</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.12]">
            Connected by memories. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 via-amber-600 to-navodaya-green">
              United by journeys.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed font-normal">
            Welcome to the dedicated community portal for former students of JNV Nadia. 
            Reconnect with old dorm mates, rediscover shared school days, and trace how our paths 
            have unfolded across India and the globe.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/alumni"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-navodaya-navy hover:bg-slate-900 shadow-md hover:shadow-lg transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Alumni Directory</span>
            </Link>

            <Link
              to={user ? "/profile/edit" : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-saffron-600" />
              <span>{user ? "Manage Your Stories" : "Create Alumni Profile"}</span>
            </Link>
          </div>

          {/* Quick Stats Pill */}
          <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4 max-w-lg">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-navodaya-navy">30+</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">Years of Legacy</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-saffron-600">100%</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">Navodaya Spirit</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-navodaya-green">Free</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">Alumni Community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
