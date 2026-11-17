import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, PlusCircle, Settings, BookOpen } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Alumni', path: '/alumni' },
    { name: 'Share Your Story', path: user ? '/profile/edit' : '/register' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      {/* Subtle national flag accent hairline */}
      <div className="h-1.5 w-full tricolor-bar" />

      {/* TOP ROW: Logo (occupying 10% on left) + Banner to its right + User Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-3">
          {/* Logo & Banner on Left */}
          <div className="flex-1 min-w-0">
            <Logo showBanner={true} occupyTenPercent={true} />
          </div>

          {/* User Controls & Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 transition-all"
                  aria-expanded={userMenuOpen}
                >
                  <img
                    src={profile?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                    alt={profile?.full_name || 'Alumnus avatar'}
                    className="h-9 w-9 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-sm font-semibold text-gray-800 pr-1 max-w-[130px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Alumnus'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-semibold text-gray-900 truncate">{profile?.full_name || user.email}</p>
                    </div>

                    {profile?.slug && (
                      <Link
                        to={`/alumni/${profile.slug}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-saffron-50/70 hover:text-saffron-700 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        View Public Profile
                      </Link>
                    )}

                    <Link
                      to="/profile/edit"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-saffron-50/70 hover:text-saffron-700 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      Edit Stories & Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-amber-800 bg-amber-50/50 hover:bg-amber-100/70 font-medium transition-colors"
                      >
                        <Shield className="h-4 w-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-saffron-50/70 hover:text-saffron-700 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      Account Settings
                    </Link>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-saffron-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-navodaya-green hover:bg-navodaya-darkGreen shadow-sm hover:shadow transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  Join Portal
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron-500 border border-gray-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: ALL PAGE LINKS BELOW THAT BANNER */}
      <div className="border-t border-gray-100 bg-[#FBFBFC]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Navigation Links below the banner */}
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-saffron-700 bg-saffron-50 border border-saffron-200/90 shadow-2xs font-bold'
                        : 'text-gray-700 hover:text-saffron-600 hover:bg-gray-100/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Tagline indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="w-2 h-2 rounded-full bg-navodaya-green animate-pulse" />
              <span>Connected by memories. United by journeys.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-1">
              Navigation
            </p>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-saffron-700 bg-saffron-50 font-bold border border-saffron-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-50 rounded-xl">
                  <img
                    src={profile?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                    alt="Alumnus"
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-gray-900 text-sm truncate">{profile?.full_name || 'My Profile'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {profile?.slug && (
                  <Link
                    to={`/alumni/${profile.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    View Public Profile
                  </Link>
                )}

                <Link
                  to="/profile/edit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  Edit Stories & Profile
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-amber-800 bg-amber-50 font-bold rounded-lg"
                  >
                    <Shield className="h-4 w-4 text-amber-600" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Account Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-3 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-3 text-xs font-bold text-white bg-navodaya-green hover:bg-navodaya-darkGreen rounded-xl shadow-sm transition-colors"
                >
                  Join Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
