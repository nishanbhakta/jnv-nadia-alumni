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
      <div className="relative min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Right Photographic Campus Backdrop with Smooth Fade and Maroon Wave */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden flex justify-end">
          <img
            src="/jnv-nadia-hero-campus.png"
            alt="Jawahar Navodaya Vidyalaya Nadia Campus"
            className="h-full w-auto max-w-none object-cover object-left opacity-90 lg:opacity-100 drop-shadow-sm select-none"
          />
          {/* Subtle multi-stop gradient overlay for seamless blending on smaller screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 lg:via-white/20 to-transparent" />
        </div>

        {/* Ambient decorative lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-maroon-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10 w-full">
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
            <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-lg mb-8 font-normal">
              A community of Navaodiyans — staying connected, sharing stories, and supporting each other, always.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
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

            {/* Stats Metrics Row */}
            <div className="flex items-center gap-6 sm:gap-8 pt-2">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-[#760A21] flex-shrink-0" />
                <div>
                  <p className="text-xl sm:text-2xl font-black text-gray-950 leading-tight">1,200+</p>
                  <p className="text-xs text-charcoal-500 font-medium">Alumni</p>
                </div>
              </div>

              <div className="h-8 w-px bg-stone-200" />

              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-[#760A21] flex-shrink-0" />
                <div>
                  <p className="text-xl sm:text-2xl font-black text-gray-950 leading-tight">200+</p>
                  <p className="text-xs text-charcoal-500 font-medium">Stories</p>
                </div>
              </div>

              <div className="h-8 w-px bg-stone-200" />

              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-[#760A21] flex-shrink-0" />
                <div>
                  <p className="text-xl sm:text-2xl font-black text-gray-950 leading-tight">20+</p>
                  <p className="text-xs text-charcoal-500 font-medium">Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Floating Quick-Access Cards Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickFeatures.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#F7EFF3] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="h-6 w-6 text-[#760A21]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-950 group-hover:text-[#760A21] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5 leading-normal">
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
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-stone-100 hover:shadow-[0_8px_30px_rgba(118,10,33,0.08)] hover:-translate-y-1 transition-all flex items-start gap-4 group cursor-pointer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.title}
                to={item.link}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-stone-100 hover:shadow-[0_8px_30px_rgba(118,10,33,0.08)] hover:-translate-y-1 transition-all flex items-start gap-4 group"
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
