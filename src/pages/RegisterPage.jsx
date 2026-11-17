import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Upload, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, Globe, Lock } from 'lucide-react';
import Seo from '../components/common/Seo';
import { useAuth } from '../contexts/AuthContext';
import { uploadProfilePhoto, validateImageFile } from '../services/storageService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    isEmailPublic: true,
    isPhonePublic: false,
    dateOfBirth: '',
    passingYear: '2016',
    currentPosition: '',
    companyOrInstitution: '',
    location: '',
    bio: '',
    jnvStory: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Generate batch years
  const currentYear = new Date().getFullYear();
  const batchYears = [];
  for (let y = currentYear; y >= 1993; y--) {
    batchYears.push(y);
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateImageFile(file);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!formData.dateOfBirth) {
      setError('Please provide your date of birth for records verification.');
      return;
    }

    try {
      setSubmitting(true);

      // Upload profile image if selected
      let profileImageUrl = null;
      if (photoFile) {
        profileImageUrl = await uploadProfilePhoto(photoFile, formData.email.replace(/[^a-zA-Z0-9]/g, '_'));
      }

      await register({
        ...formData,
        profileImageUrl,
      });

      // Redirect directly to Story Editor so they can immediately craft their journey
      navigate('/profile/edit?welcome=true');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FBFBF9] min-h-screen">
      <Seo
        title="Join JNV Nadia Alumni | Create Your Profile"
        description="Register as a former student of Jawahar Navodaya Vidyalaya, Nadia. Preserve memories, share your career journey, and reconnect with batchmates."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50/70 border border-maroon-200/80 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            Alumni Registration
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-charcoal-900 tracking-tight">
            Create Your Alumni Profile
          </h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Join the official alumni community of Jawahar Navodaya Vidyalaya, Nadia.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Profile Photo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-ivory-surface border border-stone-200/80">
              <div className="relative">
                <img
                  src={photoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-soft bg-white ring-1 ring-gold-400/40"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Profile Photograph
                </label>
                <p className="text-xs text-charcoal-500 mb-2">
                  JPG, PNG or WebP (max 5MB). Will be optimized automatically.
                </p>
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-charcoal-700 bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all"
                >
                  <Upload className="h-3.5 w-3.5 text-charcoal-500" />
                  <span>Choose Photo</span>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="reg-name" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-maroon-700">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Nishan Bhakta"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
              </div>

              {/* Email Address with Privacy Option */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="reg-email" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                    Gmail / Email <span className="text-maroon-700">*</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    formData.isEmailPublic 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {formData.isEmailPublic ? <Globe className="h-2.5 w-2.5 text-emerald-700" /> : <Lock className="h-2.5 w-2.5 text-stone-600" />}
                    {formData.isEmailPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isEmailPublic: true })}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      formData.isEmailPublic
                        ? 'bg-[#760A21] text-white border-[#760A21] shadow-2xs'
                        : 'bg-white text-charcoal-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Globe className="h-3 w-3" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isEmailPublic: false })}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      !formData.isEmailPublic
                        ? 'bg-charcoal-800 text-white border-charcoal-800 shadow-2xs'
                        : 'bg-white text-charcoal-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Lock className="h-3 w-3" />
                    <span>Private</span>
                  </button>
                </div>
              </div>

              {/* Contact Number with Privacy Option */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="reg-phone" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    formData.isPhonePublic 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {formData.isPhonePublic ? <Globe className="h-2.5 w-2.5 text-emerald-700" /> : <Lock className="h-2.5 w-2.5 text-stone-600" />}
                    {formData.isPhonePublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPhonePublic: true })}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      formData.isPhonePublic
                        ? 'bg-[#760A21] text-white border-[#760A21] shadow-2xs'
                        : 'bg-white text-charcoal-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Globe className="h-3 w-3" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPhonePublic: false })}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      !formData.isPhonePublic
                        ? 'bg-charcoal-800 text-white border-charcoal-800 shadow-2xs'
                        : 'bg-white text-charcoal-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Lock className="h-3 w-3" />
                    <span>Private</span>
                  </button>
                </div>
              </div>

              {/* Date of Birth (Private) */}
              <div>
                <label htmlFor="reg-dob" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Date of Birth <span className="text-maroon-700">*</span></span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    Always Private
                  </span>
                </label>
                <input
                  id="reg-dob"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
                <p className="text-[11px] text-charcoal-400 mt-1">
                  Used for verification only. NEVER shown on your public profile.
                </p>
              </div>

              {/* Passing-out Year */}
              <div>
                <label htmlFor="reg-year" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Class XII Passing Year <span className="text-maroon-700">*</span>
                </label>
                <select
                  id="reg-year"
                  required
                  value={formData.passingYear}
                  onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all font-medium"
                >
                  {batchYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Batch of {yr}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Enter the year you completed Class 12th, even if you completed it at another JNV (for example, 2026).
                </p>
              </div>

              {/* Company / Institution */}
              <div>
                <label htmlFor="reg-company" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Organization / Institution
                </label>
                <input
                  id="reg-company"
                  type="text"
                  placeholder="e.g. Tech Labs, AIIMS, Govt of India"
                  value={formData.companyOrInstitution}
                  onChange={(e) => setFormData({ ...formData, companyOrInstitution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
              </div>

              {/* Current Location */}
              <div>
                <label htmlFor="reg-location" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Current City / Country
                </label>
                <input
                  id="reg-location"
                  type="text"
                  placeholder="e.g. Bengaluru, India or London, UK"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-2">
                <label htmlFor="reg-password" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Account Password <span className="text-maroon-700">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              {/* Short Bio */}
              <div className="sm:col-span-2">
                <label htmlFor="reg-bio" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Short Bio / Introduction
                </label>
                <textarea
                  id="reg-bio"
                  rows={2}
                  maxLength={400}
                  placeholder="Brief note about yourself and your Navodaya days..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
              </div>

              {/* Current Work */}
              <div className="sm:col-span-2">
                <label htmlFor="reg-current-position" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  What are you doing now? <span className="text-charcoal-400 font-normal normal-case">(Optional)</span>
                </label>
                <input
                  id="reg-current-position"
                  type="text"
                  placeholder="e.g. Software Engineer, Doctor, Student, Entrepreneur"
                  value={formData.currentPosition}
                  onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
              </div>

              {/* JNV Life Story */}
              <div className="sm:col-span-2">
                <label htmlFor="reg-jnv-story" className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  A Story From Your JNV Life <span className="text-charcoal-400 font-normal normal-case">(Optional)</span>
                </label>
                <textarea
                  id="reg-jnv-story"
                  rows={4}
                  maxLength={2000}
                  placeholder="Share a memorable moment, friendship, teacher, hostel memory, or lesson from JNV Nadia..."
                  value={formData.jnvStory}
                  onChange={(e) => setFormData({ ...formData, jnvStory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 focus:border-maroon-800 transition-all bg-white"
                />
              </div>
            </div>

            {/* Privacy & Security Note */}
            <div className="p-4 rounded-xl bg-ivory-surface border border-stone-200 text-xs text-charcoal-600 flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-maroon-800 flex-shrink-0 mt-0.5" />
              <span>
                Your data is stored securely in encrypted PostgreSQL. Passwords are never stored in raw text, 
                and Date of Birth is never exposed in public queries.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-maroon-800 hover:bg-maroon-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-maroon-900/40"
            >
              <UserPlus className="h-4 w-4 text-gold-300" />
              <span>{submitting ? 'Creating Profile...' : 'Complete Registration & Publish Profile'}</span>
            </button>

            <div className="text-center text-xs text-charcoal-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-maroon-800 hover:text-maroon-900 hover:underline">
                Sign In here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
