import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Eye, AlertCircle, Sparkles } from 'lucide-react';
import Seo from '../components/common/Seo';
import ProfileHeader from '../components/profile/ProfileHeader';
import LikeButton from '../components/profile/LikeButton';
import CommentSection from '../components/profile/CommentSection';
import { getAlumnusBySlug } from '../services/alumniService';
import { recordProfileView } from '../services/socialService';
import { getVisitorIdentifier } from '../lib/visitor';
import { useAuth } from '../contexts/AuthContext';

export default function AlumniProfilePage() {
  const { slug } = useParams();
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, profile } = useAuth();
  const visitorId = getVisitorIdentifier();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAlumnusBySlug(slug);
        if (!data) {
          setError('Alumni profile not found.');
          return;
        }

        if (mounted) {
          setAlumnus(data);
          // Record throttled view
          recordProfileView(data.id, visitorId);
        }
      } catch (err) {
        if (mounted) setError('Failed to load profile details.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [slug, visitorId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-saffron-500 border-r-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading alumnus profile & stories...</p>
      </div>
    );
  }

  if (error || !alumnus) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Alumnus Profile Not Found</h2>
        <p className="text-gray-600 mb-6">
          The requested profile ({slug}) does not exist or may have been unlisted.
        </p>
        <Link
          to="/alumni"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-navodaya-navy hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Alumni Directory</span>
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(
    (user && profile && profile.id === alumnus.id) ||
    (user && alumnus.auth_user_id === user.id)
  );

  return (
    <div className="py-10 sm:py-14 bg-[#F8F9FA] min-h-screen">
      <Seo
        title={`${alumnus.full_name} (Batch ${alumnus.passing_year}) | JNV Nadia Alumni`}
        description={alumnus.bio || `Read ${alumnus.full_name}'s journey and school memories from JNV Nadia.`}
        image={alumnus.profile_image_url || '/logo.svg'}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/alumni"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-saffron-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Alumni</span>
          </Link>
        </div>

        {/* Profile Header */}
        <ProfileHeader alumnus={alumnus} isOwner={isOwner} />

        {/* Story Journey Sections */}
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-saffron-600" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Personal Journey & School Memories
              </h2>
            </div>
            <span className="text-xs text-gray-400">
              {alumnus.story_sections?.length || 0} {(alumnus.story_sections?.length || 0) === 1 ? 'Chapter' : 'Chapters'}
            </span>
          </div>

          {(!alumnus.story_sections || alumnus.story_sections.length === 0) ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200">
              <Sparkles className="h-10 w-10 text-saffron-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">Stories coming soon</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                {alumnus.full_name} has not added their story chapters yet.
              </p>
              {isOwner && (
                <Link
                  to="/profile/edit"
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-navodaya-green hover:bg-navodaya-darkGreen transition-colors"
                >
                  Add Your Story Chapters
                </Link>
              )}
            </div>
          ) : (
            alumnus.story_sections.map((section, index) => (
              <section
                key={section.id || index}
                className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 sm:p-10 transition-all relative overflow-hidden"
              >
                {/* Section Index Marker */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 mb-3">
                  <span className="w-5 h-5 rounded-full bg-saffron-50 text-saffron-700 border border-saffron-200 flex items-center justify-center font-black text-[10px]">
                    {index + 1}
                  </span>
                  <span>Chapter {index + 1}</span>
                </div>

                {/* Section Heading */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">
                  {section.heading}
                </h3>

                {/* Section Content with Editorial Reading Typography */}
                <div className="prose prose-stone max-w-none text-gray-700 font-serif leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Social Interaction Bar: Likes & Views */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
          <LikeButton alumniId={alumnus.id} initialCount={alumnus.likesCount || 0} />

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5" title="Verified Profile Views">
              <Eye className="h-4 w-4 text-gray-400" />
              <span>{alumnus.viewsCount || 0} unique views</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Member since {new Date(alumnus.created_at).getFullYear()}</span>
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection alumniId={alumnus.id} initialComments={alumnus.comments || []} />
      </div>
    </div>
  );
}
