import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, PlusCircle, Settings, BookOpen, Search } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Alumni', path: '/alumni' },
    { name: 'Stories', path: '/#recent-stories', isHash: true },
    { name: 'Community', path: '/#batch-stories', isHash: true },
    { name: 'Events', path: '/#events', isHash: true },
    { name: 'About', path: '/about' },
  ];

  const handleNavClick = (link, e) => {
    if (link.isHash) {
      if (location.pathname !== '/') {
        navigate(link.path);
      } else {
        const hash = link.path.replace('/#', '');
        const elem = document.getElementById(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-stone-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          {/* Logo on Left: Crest + Banner */}
          <div className="flex-shrink-0">
            <Logo showBanner={true} />
          </div>

          {/* Center Navigation Links - Matching Mockup Pill & Typography */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              if (link.isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link, e);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-sm font-semibold text-charcoal-800 hover:text-maroon-800 hover:bg-stone-50 transition-all cursor-pointer"
                  >
                    {link.name}
                  </a>
                );
              }

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-maroon-800 text-white shadow-2xs hover:bg-maroon-900'
                        : 'text-charcoal-800 hover:text-maroon-800 hover:bg-stone-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Buttons: Search + Sign In / User Profile */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => navigate('/alumni')}
              className="p-2 rounded-full text-charcoal-700 hover:text-maroon-800 hover:bg-stone-100/70 transition-colors focus:outline-none"
              title="Search alumni directory"
              aria-label="Search alumni"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-ivory-surface border border-stone-200 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all shadow-2xs"
                  aria-expanded={userMenuOpen}
                >
                  <img
                    src={profile?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                    alt={profile?.full_name || 'Alumnus avatar'}
                    className="h-8 w-8 rounded-full object-cover border border-stone-200"
                  />
                  <span className="text-xs font-bold text-charcoal-900 pr-1.5 max-w-[120px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Alumnus'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-stone-200/90 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-stone-100 bg-ivory-surface/70">
                      <p className="text-[11px] font-medium text-charcoal-500">Signed in as</p>
                      <p className="font-bold text-charcoal-900 truncate mt-0.5">{profile?.full_name || user.email}</p>
                    </div>

                    {profile?.slug && (
                      <Link
                        to={`/alumni/${profile.slug}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-charcoal-700 hover:bg-maroon-50 hover:text-maroon-900 font-medium transition-colors"
                      >
                        <User className="h-4 w-4 text-charcoal-400" />
                        View Public Profile
                      </Link>
                    )}

                    <Link
                      to="/profile/edit"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-charcoal-700 hover:bg-maroon-50 hover:text-maroon-900 font-medium transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-charcoal-400" />
                      Edit Stories & Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-maroon-950 bg-maroon-50/70 hover:bg-maroon-100/70 font-semibold transition-colors"
                      >
                        <Shield className="h-4 w-4 text-maroon-700" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-charcoal-700 hover:bg-maroon-50 hover:text-maroon-900 font-medium transition-colors"
                    >
                      <Settings className="h-4 w-4 text-charcoal-400" />
                      Account Settings
                    </Link>

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-red-700 hover:bg-red-50 font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-maroon-800 hover:bg-maroon-900 border border-maroon-900/30 shadow-xs hover:shadow transition-all"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => navigate('/alumni')}
              className="p-2 text-charcoal-700 hover:text-maroon-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-700 hover:text-charcoal-900 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-maroon-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-elevated animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              if (link.isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link, e);
                    }}
                    className="block px-4 py-2.5 rounded-xl text-sm font-bold text-charcoal-700 hover:bg-stone-50"
                  >
                    {link.name}
                  </a>
                );
              }

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'text-white bg-maroon-800 shadow-2xs'
                        : 'text-charcoal-700 hover:bg-stone-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-100">
                  <img
                    src={profile?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                    alt="Alumnus"
                    className="h-10 w-10 rounded-full object-cover border border-stone-200"
                  />
                  <div className="truncate">
                    <p className="font-bold text-charcoal-900 text-xs truncate">{profile?.full_name || 'My Profile'}</p>
                    <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                  </div>
                </div>

                {profile?.slug && (
                  <Link
                    to={`/alumni/${profile.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-charcoal-700 hover:bg-stone-50 rounded-lg"
                  >
                    <User className="h-4 w-4 text-charcoal-400" />
                    View Public Profile
                  </Link>
                )}

                <Link
                  to="/profile/edit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-charcoal-700 hover:bg-stone-50 rounded-lg"
                >
                  <BookOpen className="h-4 w-4 text-charcoal-400" />
                  Edit Stories & Profile
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-maroon-900 bg-maroon-50 font-bold rounded-lg"
                  >
                    <Shield className="h-4 w-4 text-maroon-700" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-charcoal-700 hover:bg-stone-50 rounded-lg"
                >
                  <Settings className="h-4 w-4 text-charcoal-400" />
                  Account Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-3 text-xs font-bold text-white bg-maroon-800 hover:bg-maroon-900 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-3 text-xs font-bold text-maroon-900 bg-maroon-50 hover:bg-maroon-100 rounded-xl border border-maroon-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
