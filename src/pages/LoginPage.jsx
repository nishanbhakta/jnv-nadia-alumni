import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, Shield, User } from 'lucide-react';
import Seo from '../components/common/Seo';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/profile/edit';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('DemoPassword123!');
    try {
      setLoading(true);
      await login(demoEmail, 'DemoPassword123!');
      if (demoEmail.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/profile/edit');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-20 bg-[#FBFBF9] min-h-screen flex items-center">
      <Seo
        title="Alumni Portal Sign In | JNV Nadia Alumni"
        description="Sign in to your JNV Nadia Alumni account to manage your profile and update your stories."
      />

      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50/70 border border-maroon-200/80 mb-3">
            <LogIn className="h-3.5 w-3.5 text-maroon-700" />
            Alumni Sign In
          </div>
          <h1 className="text-3xl font-display font-black text-charcoal-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Sign in to manage your JNV Nadia alumni profile and stories.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/settings"
                  className="text-xs text-maroon-800 hover:text-maroon-950 font-bold"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-charcoal-400 hover:text-charcoal-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-maroon-800 hover:bg-maroon-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-700 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 border border-maroon-900/30"
            >
              <LogIn className="h-4 w-4 text-gold-300" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Previews */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider text-center mb-3">
              Quick Preview Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('nishan.bhakta@example.com')}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-ivory-surface hover:bg-stone-100/80 text-charcoal-700 border border-stone-200 text-center truncate transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <User className="h-3.5 w-3.5 text-maroon-700" />
                <span>Alumnus Nishan</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@jnvnadia.org')}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-maroon-50/70 hover:bg-maroon-100/70 text-maroon-900 border border-maroon-200/80 text-center truncate transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Shield className="h-3.5 w-3.5 text-maroon-700" />
                <span>Portal Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-charcoal-500">
            Don't have an alumni profile yet?{' '}
            <Link to="/register" className="font-bold text-maroon-800 hover:text-maroon-950 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
