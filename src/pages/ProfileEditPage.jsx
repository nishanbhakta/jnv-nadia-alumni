import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, CheckCircle2, AlertCircle, BookOpen, User, Upload, ArrowLeft } from 'lucide-react';
import Seo from '../components/common/Seo';
import { useAuth } from '../contexts/AuthContext';
import { getStorySections, saveStorySections } from '../services/storyService';
import { uploadProfilePhoto, validateImageFile } from '../services/storageService';

export default function ProfileEditPage() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';

  // Profile fields state
  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    current_position: '',
    company_or_institution: '',
    location: '',
    bio: '',
    contact_number: '',
    profile_image_url: '',
  });

  // Story sections state
  const [sections, setSections] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: { pathname: '/profile/edit' } } });
    }
  }, [user, authLoading, navigate]);

  // Load profile details
  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        full_name: profile.full_name || '',
        current_position: profile.current_position || '',
        company_or_institution: profile.company_or_institution || '',
        location: profile.location || '',
        bio: profile.bio || '',
        contact_number: profile.contact_number || '',
        profile_image_url: profile.profile_image_url || '',
      });

      // Load stories
      async function loadStories() {
        try {
          const list = await getStorySections(profile.id);
          if (list && list.length > 0) {
            setSections(list);
          } else {
            // Default suggested template
            setSections([
              {
                id: 'temp-1',
                heading: 'My School Memories at JNV Nadia',
                content: 'Reflections on dormitory life, assembly morning speeches, sports tournaments, and our beloved teachers...',
              },
              {
                id: 'temp-2',
                heading: 'My Journey After Navodaya',
                content: 'How college life, initial career steps, and lessons from school helped shape my life today...',
              }
            ]);
          }
        } catch (e) {
          console.warn('Failed to load sections:', e);
        } finally {
          setLoadingStories(false);
        }
      }

      loadStories();
    }
  }, [profile]);

  // Add a new section
  const handleAddSection = () => {
    const newSection = {
      id: `new-${Date.now()}`,
      heading: '',
      content: '',
    };
    setSections([...sections, newSection]);
  };

  // Remove a section
  const handleDeleteSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  // Move a section up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...sections];
    const item = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = item;
    setSections(updated);
  };

  // Move a section down
  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const item = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = item;
    setSections(updated);
  };

  // Edit heading
  const handleHeadingChange = (index, value) => {
    const updated = [...sections];
    updated[index].heading = value;
    setSections(updated);
  };

  // Edit content
  const handleContentChange = (index, value) => {
    const updated = [...sections];
    updated[index].content = value;
    setSections(updated);
  };

  // Handle Photo Replacement
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setUploadingPhoto(true);
      const newUrl = await uploadProfilePhoto(file, profile?.id || 'avatar');
      setPersonalInfo(prev => ({ ...prev, profile_image_url: newUrl }));
      await updateProfile({ profile_image_url: newUrl });
      setStatus({ type: 'success', message: 'Profile photo updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to upload photo.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Save all changes
  const handleSaveAll = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: null });

    try {
      setSaving(true);

      // 1. Save personal profile info
      await updateProfile({
        full_name: personalInfo.full_name.trim(),
        current_position: personalInfo.current_position.trim(),
        company_or_institution: personalInfo.company_or_institution.trim(),
        location: personalInfo.location.trim(),
        bio: personalInfo.bio.trim(),
        contact_number: personalInfo.contact_number.trim(),
      });

      // 2. Save story sections
      if (profile?.id) {
        await saveStorySections(profile.id, sections);
      }

      setStatus({
        type: 'success',
        message: 'Your profile and story chapters have been saved successfully!',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to save changes. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (!profile && loadingStories)) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-saffron-500 border-r-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading your profile workspace...</p>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-[#F8F9FA] min-h-screen">
      <Seo
        title="Edit Stories & Profile | JNV Nadia Alumni"
        description="Craft your personal story chapters, memories of school days, and career updates."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome message for new signups */}
        {isWelcome && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-soft">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Welcome to the JNV Nadia Alumni Family!
            </h2>
            <p className="text-sm text-emerald-800">
              Your profile is registered! Take a moment now to add your favorite school memories and life milestones below.
            </p>
          </div>
        )}

        {/* Top Header & Public Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Edit Your Profile & Stories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Craft your story chapters in your own words. Add, edit, or rearrange anytime.
            </p>
          </div>

          {profile?.slug && (
            <Link
              to={`/alumni/${profile.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navodaya-navy bg-white hover:bg-gray-50 border border-gray-300 shadow-sm transition-all self-start sm:self-auto"
            >
              <Eye className="h-4 w-4 text-navodaya-green" />
              <span>View Your Live Page</span>
            </Link>
          )}
        </div>

        {/* Status Alerts */}
        {status.type === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSaveAll} className="space-y-8">
          {/* 1. Personal Details Card */}
          <div className="bg-white rounded-3xl shadow-soft border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
              <User className="h-5 w-5 text-saffron-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Personal & Professional Details
              </h2>
            </div>

            {/* Photo Avatar Row */}
            <div className="flex items-center gap-5 mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <img
                src={personalInfo.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <label
                  htmlFor="change-photo"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 shadow-sm transition-all"
                >
                  <Upload className="h-3.5 w-3.5 text-gray-500" />
                  <span>{uploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
                  <input
                    id="change-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingPhoto}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">
                  Square photograph recommended (JPG, PNG, WebP).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.full_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Current Position / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Software Engineer"
                  value={personalInfo.current_position}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, current_position: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Organization / Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Innovation Labs"
                  value={personalInfo.company_or_institution}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, company_or_institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Current City / Country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={personalInfo.contact_number}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, contact_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Class XII Passing Batch
                </label>
                <input
                  type="text"
                  disabled
                  value={`Batch of ${profile?.passing_year || ''}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Short Bio / Introduction
                </label>
                <textarea
                  rows={2}
                  maxLength={400}
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Flexible Story Chapters Editor */}
          <div className="bg-white rounded-3xl shadow-soft border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 mb-6 gap-2">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-navodaya-green" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Story Sections & Chapters
                  </h2>
                  <p className="text-xs text-gray-500">
                    Add unlimited custom sections. Rearrange with the up/down arrows.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-navodaya-green hover:bg-navodaya-darkGreen transition-colors shadow-sm self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Story Section</span>
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-6">
                <p className="text-sm text-gray-500 mb-3">
                  No story sections added yet. Click below to add your first chapter!
                </p>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-saffron-500 hover:bg-saffron-600 transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add First Section</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((sec, index) => (
                  <div
                    key={sec.id || index}
                    className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-4 hover:border-gray-300 transition-all"
                  >
                    {/* Chapter Header Controls */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-white text-gray-700 border border-gray-200">
                        Chapter {index + 1}
                      </span>

                      <div className="flex items-center space-x-1">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-200 disabled:opacity-30 transition-all"
                          title="Move section up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sections.length - 1}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-200 disabled:opacity-30 transition-all"
                          title="Move section down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>

                        {/* Delete Section */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(index)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all ml-1"
                          title="Delete section"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Heading */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Life in the Dormitory, Inter-House Football, My Civil Service Journey"
                        value={sec.heading}
                        onChange={(e) => handleHeadingChange(index, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                      />
                    </div>

                    {/* Section Content */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Content & Reflections
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Write your story, memories, achievements, or advice for younger students..."
                        value={sec.content}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 bg-white font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-saffron-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Bottom Save Action */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between">
            <Link
              to={profile?.slug ? `/alumni/${profile.slug}` : '/alumni'}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Cancel / Back</span>
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-navodaya-green hover:bg-navodaya-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navodaya-green shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
