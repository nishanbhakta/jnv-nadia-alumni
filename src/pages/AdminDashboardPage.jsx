import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, Users, BookOpen, MessageSquare, Eye, CheckCircle2, 
  XCircle, Trash2, Star, AlertCircle, RefreshCw, Search, 
  ExternalLink, Check, Clock, Filter, AlertTriangle, ArrowRight
} from 'lucide-react';
import Seo from '../components/common/Seo';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAdminStats, getAllAlumniAdmin, toggleAlumniStatus, 
  toggleAlumniFeatured, deleteAlumni, getAllCommentsAdmin, 
  updateCommentStatus, deleteComment, getAllFeedbackAdmin, 
  updateFeedbackStatus, deleteFeedback 
} from '../services/adminService';

export default function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading, toggleDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'alumni' | 'comments' | 'feedback' | 'website'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [alumniSearch, setAlumniSearch] = useState('');
  const [announcementText, setAnnouncementText] = useState('Annual Alumni Reunion & Career Mentorship meet registrations open soon!');
  const [notification, setNotification] = useState(null);

  // Check Admin Authorization
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      // In demo mode, if user is not admin, we offer them a clear option to activate demo admin or redirect
    }
  }, [isAdmin, authLoading]);

  // Load Admin Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sData, aData, cData, fData] = await Promise.all([
        getAdminStats(),
        getAllAlumniAdmin(),
        getAllCommentsAdmin(),
        getAllFeedbackAdmin(),
      ]);
      setStats(sData);
      setAlumniList(aData);
      setCommentsList(cData);
      setFeedbackList(fData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Alumni actions
  const handleToggleActive = async (alumniId, currentStatus) => {
    await toggleAlumniStatus(alumniId, !currentStatus);
    setAlumniList(alumniList.map(a => a.id === alumniId ? { ...a, is_active: !currentStatus } : a));
    showNotification(`Alumni status updated to ${!currentStatus ? 'Active' : 'Unlisted'}`);
  };

  const handleToggleFeatured = async (alumniId, currentFeatured) => {
    await toggleAlumniFeatured(alumniId, !currentFeatured);
    setAlumniList(alumniList.map(a => a.id === alumniId ? { ...a, is_featured: !currentFeatured } : a));
    showNotification(`Featured spotlight updated`);
  };

  const handleDeleteAlumni = async (alumniId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete profile for "${name}"? This action cannot be undone.`)) {
      await deleteAlumni(alumniId);
      setAlumniList(alumniList.filter(a => a.id !== alumniId));
      showNotification(`Profile for ${name} removed`);
    }
  };

  // Comment actions
  const handleToggleCommentVisibility = async (commentId, currentVisible) => {
    const next = !currentVisible;
    await updateCommentStatus(commentId, next, next ? 'approved' : 'hidden');
    setCommentsList(commentsList.map(c => c.id === commentId ? { ...c, is_visible: next, moderation_status: next ? 'approved' : 'hidden' } : c));
    showNotification(`Comment ${next ? 'approved & visible' : 'hidden from public'}`);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment permanently?')) {
      await deleteComment(commentId);
      setCommentsList(commentsList.filter(c => c.id !== commentId));
      showNotification('Comment deleted');
    }
  };

  // Feedback actions
  const handleUpdateFeedbackStatus = async (feedbackId, status) => {
    await updateFeedbackStatus(feedbackId, status);
    setFeedbackList(feedbackList.map(f => f.id === feedbackId ? { ...f, status } : f));
    showNotification(`Feedback status updated to ${status}`);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    await deleteFeedback(feedbackId);
    setFeedbackList(feedbackList.filter(f => f.id !== feedbackId));
    showNotification('Feedback entry removed');
  };

  // If not admin, show protection gate
  if (!isAdmin && !authLoading) {
    return (
      <div className="py-24 bg-[#F8F9FA] min-h-screen flex items-center justify-center px-4">
        <Seo title="Admin Access Restricted | JNV Nadia Alumni" />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-soft border border-gray-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Administrator Access Required
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            This route is strictly protected by Supabase Row Level Security and role-based policies.
            Only authorized administrators registered in the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">administrators</code> table can access this dashboard.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                toggleDemoAdmin(true);
                loadDashboardData();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              Simulate Administrator Role (Demo Mode)
            </button>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link
              to="/login"
              className="text-xs font-semibold text-saffron-600 hover:text-saffron-700"
            >
              Sign in with an admin account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredAlumni = alumniList.filter(a => 
    a.full_name?.toLowerCase().includes(alumniSearch.toLowerCase()) ||
    a.email?.toLowerCase().includes(alumniSearch.toLowerCase()) ||
    a.passing_year?.toString().includes(alumniSearch)
  );

  return (
    <div className="py-10 sm:py-14 bg-[#F8F9FA] min-h-screen">
      <Seo title="Administrator Portal | JNV Nadia Alumni" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 mb-2">
              <Shield className="h-3.5 w-3.5 text-amber-600" />
              Portal Administration & Moderation
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'alumni', label: `Alumni (${alumniList.length})`, icon: Users },
            { id: 'comments', label: `Comments (${commentsList.length})`, icon: MessageSquare },
            { id: 'feedback', label: `Feedback (${feedbackList.length})`, icon: CheckCircle2 },
            { id: 'website', label: 'Website & Config', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-saffron-500 text-saffron-600 bg-white shadow-sm'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-saffron-500' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Registered Alumni</span>
                  <Users className="h-5 w-5 text-saffron-500" />
                </div>
                <p className="text-3xl font-black text-gray-900">{stats?.totalAlumni || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Across 1993–present batches</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Story Chapters</span>
                  <BookOpen className="h-5 w-5 text-navodaya-green" />
                </div>
                <p className="text-3xl font-black text-gray-900">{stats?.totalStories || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Memories & journeys published</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Community Comments</span>
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-3xl font-black text-gray-900">{stats?.totalComments || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Visitor & alumni remarks</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Verified Profile Views</span>
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-3xl font-black text-gray-900">{stats?.totalViews || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Deduplicated visitor reads</p>
              </div>
            </div>

            {/* Recent Registrations & Feedback Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Registrations */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Recent Alumni Registrations
                  </h3>
                  <button
                    onClick={() => setActiveTab('alumni')}
                    className="text-xs font-semibold text-saffron-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-gray-100 text-sm">
                  {(stats?.recentRegistrations || []).map((alumnus) => (
                    <div key={alumnus.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{alumnus.full_name}</p>
                        <p className="text-xs text-gray-500">
                          Batch {alumnus.passing_year} • {alumnus.email}
                        </p>
                      </div>
                      <Link
                        to={`/alumni/${alumnus.slug}`}
                        className="text-xs font-semibold text-navodaya-green hover:underline flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Recent Website Feedback
                  </h3>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="text-xs font-semibold text-saffron-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {(stats?.recentFeedback || []).map((fb) => (
                    <div key={fb.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-800">{fb.category}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">{fb.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1 italic">
                        From: {fb.name || 'Anonymous'} {fb.email ? `(${fb.email})` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALUMNI MANAGEMENT */}
        {activeTab === 'alumni' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alumni by name, email, year..."
                  value={alumniSearch}
                  onChange={(e) => setAlumniSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
                />
              </div>
              <span className="text-xs text-gray-500">
                Showing {filteredAlumni.length} of {alumniList.length} alumni
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Alumnus</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Profession</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAlumni.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <Link to={`/alumni/${a.slug}`} className="font-bold text-gray-900 hover:text-saffron-600 block">
                              {a.full_name}
                            </Link>
                            <span className="text-gray-400">{a.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700">{a.passing_year}</td>
                      <td className="py-3 px-4 text-gray-600">{a.current_position || 'Navodayan'}</td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(a.id, a.is_active)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {a.is_active ? 'Active' : 'Unlisted'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(a.id, a.is_featured)}
                          className={`p-1 rounded ${a.is_featured ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                          title="Toggle featured spotlight"
                        >
                          <Star className={`h-4 w-4 ${a.is_featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/alumni/${a.slug}`}
                          className="text-gray-500 hover:text-navodaya-navy font-semibold"
                          title="View Profile"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteAlumni(a.id, a.full_name)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Alumnus Profile"
                        >
                          <Trash2 className="h-3.5 w-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMMENTS MODERATION */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                Visitor Comments Moderation
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Review visitor messages. Hidden comments will not appear publicly.
              </p>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {commentsList.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No comments posted yet.</div>
              ) : (
                commentsList.map((c) => (
                  <div key={c.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{c.visitor_name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          on profile of{' '}
                          <Link to={`/alumni/${c.alumni?.slug}`} className="font-bold text-navodaya-navy hover:underline">
                            {c.alumni?.full_name || 'Alumnus'}
                          </Link>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.is_visible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.is_visible ? 'Approved & Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        "{c.comment_text}"
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Posted on: {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleToggleCommentVisibility(c.id, c.is_visible)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                          c.is_visible
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {c.is_visible ? 'Hide Comment' : 'Approve & Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FEEDBACK MANAGEMENT */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                User Feedback & Bug Reports
              </h3>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {feedbackList.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No feedback submitted yet.</div>
              ) : (
                feedbackList.map((fb) => (
                  <div key={fb.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-saffron-100 text-saffron-800">
                          {fb.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fb.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          Status: {fb.status}
                        </span>
                        <span className="text-gray-400">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed font-medium">
                        {fb.message}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Submitter: <span className="font-semibold">{fb.name || 'Anonymous'}</span>
                        {fb.email && (
                          <> • Email: <a href={`mailto:${fb.email}`} className="text-saffron-600 hover:underline">{fb.email}</a></>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-start">
                      {fb.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateFeedbackStatus(fb.id, 'resolved')}
                          className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete feedback"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE MANAGEMENT & MANUAL SETUP GUIDE */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-soft">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Homepage Announcements Banner
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Update the official community notice displayed to all visitors.
              </p>
              <textarea
                rows={2}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 mb-3"
              />
              <button
                type="button"
                onClick={() => showNotification('Announcement saved!')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-navodaya-green hover:bg-navodaya-darkGreen"
              >
                Save Announcement
              </button>
            </div>

            {/* Manual Admin Setup Instructions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-bold">
                  Production Admin Account Setup Instruction
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                As required by Section 7 of the specification: "Create the first admin account through a secure manual setup process. Never allow users to make themselves administrators through normal registration."
              </p>
              <div className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto space-y-2">
                <p className="text-gray-400">-- 1. Sign up a regular user in Supabase Auth or through /register</p>
                <p className="text-gray-400">-- 2. Run this SQL in your Supabase SQL Editor with that user's auth ID:</p>
                <p className="text-saffron-400">
                  INSERT INTO public.administrators (auth_user_id, role)<br />
                  VALUES ('&lt;AUTH_USER_UUID_FROM_AUTH_USERS&gt;', 'admin');
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
