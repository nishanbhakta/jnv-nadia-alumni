import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import Seo from '../components/common/Seo';

export default function NotFoundPage() {
  return (
    <div className="py-24 bg-[#F8F9FA] min-h-[70vh] flex items-center justify-center px-4">
      <Seo title="Page Not Found | JNV Nadia Alumni" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-soft border border-gray-200 p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-saffron-50 text-saffron-600 flex items-center justify-center mx-auto">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-black text-gray-900">404</h1>
        <h2 className="text-lg font-bold text-gray-800">Page Not Found</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          The page or alumni chapter you are looking for doesn't exist or has moved.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-navodaya-navy hover:bg-slate-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/alumni"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span>Browse Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
