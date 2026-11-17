import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  className = "h-12 sm:h-14 md:h-16 w-auto object-contain", 
  showBanner = true,
  showText = false,
}) {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2.5 sm:gap-4 group focus:outline-none focus:ring-2 focus:ring-maroon-700/30 rounded-xl py-1 transition-all"
    >
      {/* Official Navodaya Vidyalaya Samiti Crest - Prominent & Visually Balanced */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <img
          src="/nvs-logo.png"
          alt="Navodaya Vidyalaya Samiti Official Emblem"
          className="h-11 sm:h-14 md:h-16 w-auto object-contain drop-shadow-2xs transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* JNV Nadia Alumni Banner Logo - Perfectly scaled without stretching or cropping */}
      {showBanner ? (
        <div className="flex items-center">
          <img
            src="/jnv-nadia-banner.jpg"
            alt="JNV Nadia Alumni"
            className="h-9 sm:h-12 md:h-14 w-auto max-w-[180px] xs:max-w-[210px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] object-contain object-left transition-opacity duration-200 group-hover:opacity-95"
          />
        </div>
      ) : showText ? (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-gray-950 group-hover:text-maroon-800 transition-colors">
            JNV Nadia <span className="text-maroon-800">Alumni</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium text-gray-500 tracking-normal">
            Connected by memories. United by journeys.
          </span>
        </div>
      ) : null}
    </Link>
  );
}
