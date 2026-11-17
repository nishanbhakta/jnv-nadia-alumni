import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Seo from '../components/common/Seo';
import { useAuth } from '../contexts/AuthContext';

export default function AccountSettingsPage() {
  const { user, profile, updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: null });

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      setSubmitting(true);
      await updatePassword(newPassword);
      setStatus({
        type: 'success',
        message: 'Your account password has been updated successfully!',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to update password. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FBFBF9] min-h-screen">
      <Seo
        title="Account Settings | JNV Nadia Alumni"
        description="Manage your account security, credentials and settings."
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-500 hover:text-charcoal-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile Editor</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <KeyRound className="h-6 w-6 text-maroon-800" />
            <div>
              <h1 className="text-xl font-black text-charcoal-900 font-display">
                Account Security & Password
              </h1>
              <p className="text-xs text-charcoal-500">
                Manage your credentials for {user?.email || 'your account'}
              </p>
            </div>
          </div>

          {status.type === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 shadow-2xs">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-ivory-surface border border-stone-200 text-xs text-charcoal-600 flex items-start gap-2">
              <Shield className="h-4 w-4 text-maroon-800 flex-shrink-0 mt-0.5" />
              <span>
                Passwords are never stored in plain text and are authenticated using cryptographic bcrypt / argon2 hashes.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-maroon-800 hover:bg-maroon-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-700 shadow-md transition-all disabled:opacity-50 border border-maroon-900/30"
            >
              {submitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
