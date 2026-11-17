import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className = "h-11 w-11", showText = true }) {
  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-saffron-500 rounded-lg p-1 transition-all">
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 0 80 80"
          className={`${className} transition-transform duration-300 group-hover:scale-105 drop-shadow-sm`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle border */}
          <circle cx="40" cy="40" r="37" fill="#FFFFFF" stroke="#0B2545" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="33" fill="#F8F9FA" stroke="#E5E7EB" strokeWidth="1" />
          
          {/* Subtle National Tricolor arcs */}
          <path d="M12 40 A 28 28 0 0 1 68 40" stroke="#FF9933" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M12 40 A 28 28 0 0 0 68 40" stroke="#138808" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Navodaya Torch & Flame */}
          <path d="M40 18 L36 30 L44 30 Z" fill="#FF9933" />
          <circle cx="40" cy="16" r="3.5" fill="#FF9933" />

          {/* Open Book Motif */}
          <path d="M24 47 C29 43 34 43 40 46 C46 43 51 43 56 47 V51 C51 47 46 47 40 50 C34 47 29 47 24 51 Z" fill="#0B2545" />
          <line x1="40" y1="46" x2="40" y2="53" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Insignia Typography */}
          <text x="40" y="37" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="800" fill="#0B2545" letterSpacing="1">JNV</text>
          <text x="40" y="61" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="6.5" fontWeight="700" fill="#138808" letterSpacing="0.5">NADIA</text>
          <text x="40" y="68" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="4.5" fontWeight="600" fill="#6B7280" letterSpacing="0.4">ALUMNI</text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 group-hover:text-navodaya-navy transition-colors">
              JNV Nadia Alumni
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-gray-500 tracking-normal">
            Connected by memories. United by journeys.
          </span>
        </div>
      )}
    </Link>
  );
}
