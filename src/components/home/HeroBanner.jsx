import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, BookOpen, Users, Calendar, 
  PenSquare, HeartHandshake, Search 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function HeroBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickFeatures = [
    {
      title: 'Find Alumni',
      description: 'Reconnect with your batchmates and seniors.',
      icon: Users,
      link: '/alumni',
      external: false,
    },
    {
      title: 'Share Your Story',
      description: 'Post memories, experiences, and life updates.',
      icon: PenSquare,
      link: user ? '/profile/edit' : '/register',
      external: false,
    },
    {
      title: 'Events & Reunions',
      description: 'Stay updated on alumni meets and school events.',
      icon: Calendar,
      link: '/#batch-stories',
      isAnchor: true,
    },
    {
      title: 'Give Back',
      description: 'Mentor, guide or support current students.',
      icon: HeartHandshake,
      link: '/#feedback',
      isAnchor: true,
    },
  ];

  const handleCardClick = (item, e) => {
    if (item.isAnchor) {
      const elem = document.getElementById(item.link.replace('/#', ''));
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Top Hero Container */}
      <div className="relative min-h-[440px] lg:min-h-[480px] flex items-center">
        {/* Right Photographic Campus Backdrop with Smooth Fade and Maroon Wave Ribbon */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[56%] xl:w-[58%] pointer-events-none overflow-hidden select-none">
          <img
            src="/background.jpg"
            alt="Jawahar Navodaya Vidyalaya Nadia Campus"
            className="w-full h-full object-cover object-[center_35%] opacity-25 sm:opacity-35 lg:opacity-100 transition-opacity drop-shadow-xs select-none"
          />
          {/* Left subtle feathered gradient into clean white background */}
          <div className="absolute inset-y-0 left-0 w-1/3 sm:w-1/2 lg:w-2/5 bg-gradient-to-r from-white via-white/80 via-30% to-transparent" />
          
          {/* Mobile contrast wash to ensure headline and button legibility */}
          <div className="absolute inset-0 bg-white/70 sm:bg-white/55 lg:hidden" />
          
          {/* Bottom subtle edge blend */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/40 to-transparent" />

          {/* Layered Maroon Wave Ribbon (accentuating the campus photo base) */}
          <div className="absolute -bottom-1 right-0 w-full sm:w-[90%] lg:w-[80%] xl:w-[70%] h-18 sm:h-22 lg:h-26 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0,85 C260,25 440,110 690,55 C840,20 930,65 1000,50 L1000,120 L0,120 Z"
                fill="#E2B4C2"
                fillOpacity="0.4"
              />
              <path
                d="M120,95 C330,40 510,115 750,70 C870,40 940,80 1000,65 L1000,120 L120,120 Z"
                fill="#9C1735"
                fillOpacity="0.5"
              />
              <path
                d="M240,105 C430,60 590,120 810,85 C900,70 950,95 1000,85 L1000,120 L240,120 Z"
                fill="#760A21"
                fillOpacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Ambient decorative lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-maroon-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative z-10 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow Label */}
            <p className="text-xs sm:text-sm font-bold tracking-[0.22em] text-stone-500 uppercase mb-3">
              JAWAHAR NAVODAYA VIDYALAYA, NADIA
            </p>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.08] mb-4">
              JNV Nadia <span className="text-[#760A21]">Alumni</span>
            </h1>

            {/* Subheading / Description */}
            <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-lg mb-7 font-normal">
              A community of Navaodiyans — staying connected, sharing stories, and supporting each other, always.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={user ? "/profile/edit" : "/register"}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-[#760A21] hover:bg-[#60081A] shadow-xs hover:shadow-md transition-all group"
              >
                <span>{user ? "Go to Story Studio" : "Join the Community"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#recent-stories"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('recent-stories')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#760A21] bg-white border border-[#760A21] hover:bg-maroon-50/60 transition-all shadow-2xs"
              >
                <BookOpen className="h-4 w-4" />
                <span>Read Alumni Stories</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Floating Quick-Access Cards Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-14 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {quickFeatures.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F7EFF3] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-[#760A21]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-bold text-gray-950 group-hover:text-[#760A21] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-500 mt-0.5 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </>
            );

            if (item.isAnchor) {
              return (
                <a
                  key={item.title}
                  href={item.link}
                  onClick={(e) => handleCardClick(item, e)}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-stone-100 hover:shadow-[0_8px_30px_rgba(118,10,33,0.08)] hover:-translate-y-1 transition-all flex items-start gap-2.5 sm:gap-4 group cursor-pointer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.title}
                to={item.link}
                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-stone-100 hover:shadow-[0_8px_30px_rgba(118,10,33,0.08)] hover:-translate-y-1 transition-all flex items-start gap-2.5 sm:gap-4 group"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Subtle sweeping bottom accent hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
    </div>
  );
}
