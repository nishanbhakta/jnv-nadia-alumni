import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';
import { submitComment } from '../../services/socialService';
import { getVisitorIdentifier } from '../../lib/visitor';

export default function CommentSection({ alumniId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [visitorName, setVisitorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });

  const visitorIdentifier = getVisitorIdentifier();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: null });

    try {
      setSubmitting(true);
      const res = await submitComment({
        alumniId,
        visitorName,
        commentText,
        visitorIdentifier,
        honeypot,
      });

      if (res?.data) {
        setComments(prev => [res.data, ...prev]);
        setCommentText('');
        setStatus({
          type: 'success',
          message: 'Your comment has been posted successfully!',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Unable to post comment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-stone-200/90 p-6 sm:p-10 mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-maroon-800" />
          <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 font-serif">
            Thoughts & Messages ({comments.length})
          </h2>
        </div>
        <span className="text-xs text-charcoal-400">Open to all Navodayans & visitors</span>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleCommentSubmit} className="mb-10 bg-[#FAF9F5] rounded-2xl p-4 sm:p-6 border border-stone-200/80">
        <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 mb-4 font-serif">
          Leave a message or hostel memory
        </h3>

        {status.type === 'success' && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {/* Spam honeypot */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-3.5">
          <div>
            <label htmlFor="visitor-name" className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Your Name / Batch
            </label>
            <input
              id="visitor-name"
              type="text"
              required
              placeholder="e.g. Priyabrata Roy (Batch 2017)"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/30 focus:border-maroon-700 transition-all"
            />
          </div>

          <div>
            <label htmlFor="comment-text" className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Your Message
            </label>
            <textarea
              id="comment-text"
              rows={3}
              required
              minLength={3}
              maxLength={1000}
              placeholder="Write a message, reminiscence of school days, or words of encouragement..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/30 focus:border-maroon-700 transition-all font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-charcoal-400">
              {commentText.length}/1000 characters
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-maroon-800 hover:bg-maroon-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-maroon-700 border border-maroon-950/30 shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5 text-gold-300" />
              <span>{submitting ? 'Posting...' : 'Post Message'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Existing Comments List */}
      <div className="space-y-3.5">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-charcoal-400 text-xs sm:text-sm">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-charcoal-300" />
            <p>No messages yet. Be the first to leave a warm greeting!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2 transition-all hover:border-stone-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-maroon-50 text-maroon-900 border border-maroon-200/70 flex items-center justify-center font-bold text-xs">
                    {comment.visitor_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-charcoal-900">
                    {comment.visitor_name}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-charcoal-400">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(comment.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed pl-9 whitespace-pre-line">
                {comment.comment_text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
