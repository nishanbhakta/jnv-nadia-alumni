import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, Award, Share2, Lock } from 'lucide-react';

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
    <div className="bg-white rounded-3xl shadow-soft border border-stone-200/90 overflow-hidden mb-8 sm:mb-10">
      {/* Editorial subtle banner with academic tone */}
      <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-maroon-900/15 via-gold-100/40 to-stone-100 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm text-charcoal-700 hover:text-maroon-800 hover:bg-white shadow-2xs border border-stone-200 transition-all"
            title="Share this profile"
          >
            <Share2 className="h-3.5 w-3.5 text-gold-600" />
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
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-md bg-white ring-2 ring-gold-400/40"
            />
            <span className="absolute bottom-2 right-2 px-2.5 py-1 text-xs font-extrabold rounded-lg bg-maroon-800 text-white shadow-xs border border-white">
              Batch {alumnus.passing_year}
            </span>
          </div>

          {/* Owner Quick Edit Action */}
          {isOwner && (
            <div className="sm:self-end">
              <a
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-maroon-900 bg-maroon-50 hover:bg-maroon-100 border border-maroon-200/80 transition-colors shadow-2xs"
              >
                Edit Your Profile & Stories
              </a>
            </div>
          )}
        </div>

        {/* Identity & Career */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight font-serif">
              {alumnus.full_name}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-gold-700 mt-1 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-maroon-700" />
              <span>{alumnus.current_position || 'Navodaya Alumnus'}</span>
              {alumnus.company_or_institution && (
                <span className="text-charcoal-500 font-normal">at {alumnus.company_or_institution}</span>
              )}
            </p>
          </div>

          {/* Bio statement */}
          {alumnus.bio && (
            <p className="text-xs sm:text-sm text-charcoal-700 max-w-3xl leading-relaxed pt-1">
              {alumnus.bio}
            </p>
          )}

          {/* Contact Details & Metadata */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-charcoal-600">
            {alumnus.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold-600" />
                <span>{alumnus.location}</span>
              </div>
            )}

            {/* Email / Gmail with Private / Public Control */}
            {alumnus.email && (alumnus.is_email_public !== false || isOwner) ? (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-maroon-700" />
                <a
                  href={`mailto:${alumnus.email}`}
                  className="hover:text-maroon-800 transition-colors underline decoration-stone-300"
                >
                  {alumnus.email}
                </a>
                {alumnus.is_email_public === false && isOwner && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Lock className="h-2.5 w-2.5 text-amber-700" />
                    Private to you
                  </span>
                )}
              </div>
            ) : alumnus.email && alumnus.is_email_public === false ? (
              <div className="flex items-center gap-1.5 text-stone-400" title="Email address is kept private by this alumnus">
                <Lock className="h-3 w-3 text-stone-400" />
                <span className="italic">Email Private</span>
              </div>
            ) : null}

            {/* Contact Number with Private / Public Control */}
            {alumnus.contact_number && (alumnus.is_phone_public === true || isOwner) ? (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gold-600" />
                <a
                  href={`tel:${alumnus.contact_number}`}
                  className="hover:text-maroon-800 transition-colors"
                >
                  {alumnus.contact_number}
                </a>
                {alumnus.is_phone_public !== true && isOwner && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Lock className="h-2.5 w-2.5 text-amber-700" />
                    Private to you
                  </span>
                )}
              </div>
            ) : null}

            <div className="flex items-center gap-1.5 text-charcoal-500">
              <Calendar className="h-3.5 w-3.5 text-charcoal-400" />
              <span>Passing Class XII: {alumnus.passing_year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
