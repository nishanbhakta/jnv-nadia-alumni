import React, { useState } from 'react';
import { Database, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function SupabaseSetupBanner() {
  const [dismissed, setDismissed] = useState(false);
  const isConnected = isSupabaseConfigured();

  if (dismissed || isConnected) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong className="font-semibold">Interactive Preview Mode:</strong> Running with realistic JNV Nadia demo data. Connect your Supabase project anytime by adding <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300">VITE_SUPABASE_URL</code> and <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300">VITE_SUPABASE_ANON_KEY</code> to your environment.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:text-amber-950 p-1 rounded focus:outline-none"
          title="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
