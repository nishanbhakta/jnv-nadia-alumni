import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  className = "w-14 sm:w-16 md:w-20 h-auto object-contain", 
  showBanner = true,
  showText = false,
  occupyTenPercent = true,
}) {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-3 sm:gap-5 group focus:outline-none focus:ring-2 focus:ring-saffron-500 rounded-xl p-1 transition-all"
    >
      {/* Official Navodaya Vidyalaya Samiti Emblem occupying ~10% of the left side */}
      <div className={`flex-shrink-0 flex items-center justify-center ${occupyTenPercent ? 'w-[10vw] min-w-[55px] max-w-[85px]' : 'w-14 sm:w-16'}`}>
        <img
          src="/nvs-logo.png"
          alt="Navodaya Vidyalaya Samiti Official Emblem"
          className="w-full h-auto max-h-16 sm:max-h-20 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Banner placed at the right of the logo */}
      {showBanner ? (
        <div className="flex-1 max-w-[320px] sm:max-w-[420px] md:max-w-[480px]">
          <img
            src="/jnv-nadia-banner.jpg"
            alt="JNV Nadia Alumni Banner"
            className="w-full h-auto max-h-12 sm:max-h-16 md:max-h-20 object-contain object-left transition-opacity duration-200 group-hover:opacity-95"
          />
        </div>
      ) : showText ? (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-gray-900 group-hover:text-navodaya-navy transition-colors">
            JNV Nadia Alumni
          </span>
          <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-gray-500 tracking-normal">
            Connected by memories. United by journeys.
          </span>
        </div>
      ) : null}
    </Link>
  );
}
