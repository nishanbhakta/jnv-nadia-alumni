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
    <div className="py-12 sm:py-16 bg-[#F8F9FA] min-h-screen">
      <Seo
        title="Account Settings | JNV Nadia Alumni"
        description="Manage your account security, credentials and settings."
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile Editor</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-soft border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <KeyRound className="h-6 w-6 text-saffron-600" />
            <div>
              <h1 className="text-xl font-black text-gray-900">
                Account Security & Password
              </h1>
              <p className="text-xs text-gray-500">
                Manage your credentials for {user?.email || 'your account'}
              </p>
            </div>
          </div>

          {status.type === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
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
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>
                Passwords are never stored in plain text and are authenticated using cryptographic bcrypt / argon2 hashes.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-navodaya-navy hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navodaya-navy shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
