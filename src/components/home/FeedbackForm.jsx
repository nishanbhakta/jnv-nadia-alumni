import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../../services/feedbackService';

const CATEGORIES = [
  'Website suggestion',
  'Technical issue',
  'Content correction',
  'General feedback'
];

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Website suggestion',
    message: '',
    honeypot: '', // anti-bot spam trap
  });

  const [status, setStatus] = useState({ type: null, message: null });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: null });

    try {
      setSubmitting(true);
      await submitFeedback(formData);
      setStatus({
        type: 'success',
        message: 'Thank you for your valuable feedback! The alumni team will review it shortly.',
      });
      setFormData({
        name: '',
        email: '',
        category: 'Website suggestion',
        message: '',
        honeypot: '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to submit feedback. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback-section" className="py-16 sm:py-20 bg-[#F8F9FA] border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 mb-3">
            <MessageSquare className="h-3.5 w-3.5" />
            Continuous Improvement
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Help Us Improve
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Have an idea for our alumni website, noticed an error in a batch list, or ran into a technical bug? Tell us!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6 sm:p-8">
          {status.type === 'success' && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{status.message}</div>
            </div>
          )}

          {status.type === 'error' && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{status.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot hidden input for spam bots */}
            <input
              type="text"
              name="hp_website"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Optional Name */}
              <div>
                <label htmlFor="fb-name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Name <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="fb-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Optional Email */}
              <div>
                <label htmlFor="fb-email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-gray-400 font-normal lowercase">(optional, for replies)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="fb-category" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Feedback Category <span className="text-red-500">*</span>
              </label>
              <select
                id="fb-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="fb-message" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Feedback Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="fb-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                minLength={5}
                maxLength={3000}
                placeholder="Share your thoughts, suggestions, or report an issue..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-right text-[11px] text-gray-400">
                {formData.message.length} / 3000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-saffron-500 hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
