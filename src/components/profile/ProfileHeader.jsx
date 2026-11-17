import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, Award, Share2 } from 'lucide-react';

export default function ProfileHeader({ alumnus, isOwner = false }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${alumnus.full_name} | JNV Nadia Alumni`,
        text: `Read ${alumnus.full_name}'s journey and school memories on the JNV Nadia Alumni Portal.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-gray-200 overflow-hidden mb-10">
      {/* Editorial subtle banner with tricolor tone */}
      <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-saffron-100 via-amber-50 to-green-50 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-sm transition-all"
            title="Share this profile"
          >
            <Share2 className="h-3.5 w-3.5 text-gray-500" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-8 sm:pb-10 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
          {/* Avatar */}
          <div className="relative inline-block">
            <img
              src={alumnus.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={alumnus.full_name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
            />
            <span className="absolute bottom-2 right-2 px-2.5 py-1 text-xs font-extrabold rounded-lg bg-navodaya-navy text-white shadow-sm">
              Batch {alumnus.passing_year}
            </span>
          </div>

          {/* Owner Quick Edit Action */}
          {isOwner && (
            <div className="sm:self-end">
              <a
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-saffron-800 bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 transition-colors shadow-sm"
              >
                Edit Your Profile & Stories
              </a>
            </div>
          )}
        </div>

        {/* Identity & Career */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {alumnus.full_name}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-navodaya-green mt-1 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{alumnus.current_position || 'Navodaya Alumnus'}</span>
              {alumnus.company_or_institution && (
                <span className="text-gray-500 font-normal">at {alumnus.company_or_institution}</span>
              )}
            </p>
          </div>

          {/* Bio statement */}
          {alumnus.bio && (
            <p className="text-sm sm:text-base text-gray-700 max-w-3xl leading-relaxed pt-1">
              {alumnus.bio}
            </p>
          )}

          {/* Contact Details & Metadata */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-600">
            {alumnus.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{alumnus.location}</span>
              </div>
            )}

            {alumnus.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <a
                  href={`mailto:${alumnus.email}`}
                  className="hover:text-saffron-600 transition-colors underline decoration-gray-300"
                >
                  {alumnus.email}
                </a>
              </div>
            )}

            {alumnus.contact_number && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>{alumnus.contact_number}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span>Passing Class XII: {alumnus.passing_year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
