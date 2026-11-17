import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, MessageSquare, BookOpen, ExternalLink } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const developerSlug = import.meta.env.VITE_DEVELOPER_SLUG || 'nishan-bhakta';

  return (
    <footer className="bg-[#FAF9F5] border-t border-stone-200 mt-auto">
      {/* Tricolor accent bar */}
      <div className="h-1.5 w-full tricolor-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo showBanner={true} occupyTenPercent={false} />
            <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed max-w-md pt-2">
              JNV Nadia Alumni is a community-driven digital home for former students of 
              Jawahar Navodaya Vidyalaya, Nadia, West Bengal. Dedicated to preserving the memories 
              of dormitory life, morning assemblies, lifelong friendships, and inspiring future generations.
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-500 pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-navodaya-green animate-pulse" />
              <span>Independent Alumni Initiative • Estd. School 1993</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-maroon-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-charcoal-600 hover:text-maroon-800 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="text-charcoal-600 hover:text-maroon-800 transition-colors">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-charcoal-600 hover:text-maroon-800 transition-colors">
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-charcoal-600 hover:text-maroon-800 transition-colors">
                  About Navodaya
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-maroon-900 uppercase tracking-wider">
              Community & Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="#feedback-section"
                  className="text-charcoal-600 hover:text-maroon-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-gold-600" />
                  Leave Website Feedback
                </a>
              </li>
              <li>
                <Link to="/login" className="text-charcoal-600 hover:text-maroon-800 transition-colors">
                  Alumni Portal Sign In
                </Link>
              </li>
              <li>
                <a
                  href="https://navodaya.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal-600 hover:text-maroon-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>NVS Official Website</span>
                  <ExternalLink className="h-3 w-3 text-charcoal-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>© {currentYear} JNV Nadia Alumni Community. All memories and journeys preserved with care.</p>
          
          <div className="flex items-center gap-1.5 font-medium text-charcoal-700">
            <span>Designed and developed by</span>
            <Link
              to={`/alumni/${developerSlug}`}
              className="font-bold text-maroon-900 hover:text-maroon-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:decoration-maroon-700 transition-all inline-flex items-center gap-1"
              title="Visit Nishan Bhakta's Alumni Profile & Story"
            >
              <span>Nishan Bhakta</span>
              <Heart className="h-3 w-3 text-maroon-600 fill-maroon-600" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
