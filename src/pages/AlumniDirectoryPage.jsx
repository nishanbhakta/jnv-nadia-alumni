import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, User, ExternalLink, RefreshCw, Briefcase, GraduationCap } from 'lucide-react';
import Seo from '../components/common/Seo';
import { getAlumniDirectory } from '../services/alumniService';

export default function AlumniDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [batch, setBatch] = useState(searchParams.get('batch') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'year_desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [directoryData, setDirectoryData] = useState({
    alumni: [],
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const urlBatch = searchParams.get('batch');
    if (urlBatch && urlBatch !== batch) {
      setBatch(urlBatch);
    }
  }, [searchParams]);

  // Fetch directory
  useEffect(() => {
    let active = true;

    async function fetchDirectory() {
      setLoading(true);
      try {
        const res = await getAlumniDirectory({
          search,
          batch,
          sort,
          page,
          pageSize: 10,
        });

        if (active) {
          setDirectoryData(res);
        }
      } catch (err) {
        console.error('Failed to fetch alumni directory:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchDirectory();
    }, 250); // debounce search keystrokes

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, batch, sort, page]);

  // Handle filter changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) newParams.set('q', e.target.value);
    else newParams.delete('q');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleBatchChange = (e) => {
    const val = e.target.value;
    setBatch(val);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('batch', val);
    else newParams.delete('batch');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', val);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setBatch('');
    setSort('year_desc');
    setPage(1);
    setSearchParams({});
  };

  // Generate batch years list (from 1993 to current year)
  const currentYear = new Date().getFullYear();
  const batchYears = [];
  for (let y = currentYear; y >= 1993; y--) {
    batchYears.push(y);
  }

  return (
    <div className="py-12 sm:py-16 bg-[#F8F9FA] min-h-screen">
      <Seo
        title="Alumni Directory | JNV Nadia Alumni"
        description="Search and connect with former students of Jawahar Navodaya Vidyalaya, Nadia. Filter by batch year, search by name, and explore career journeys."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 mb-2">
            <GraduationCap className="h-3.5 w-3.5" />
            Navodaya Roll of Honor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Alumni Directory
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Searchable registry of registered former students. Currently displaying{' '}
            <span className="font-bold text-gray-900">{directoryData.totalCount}</span> alumni.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <label htmlFor="search-input" className="sr-only">Search by full name</label>
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Search by full name or occupation..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Batch Filter */}
            <div>
              <label htmlFor="batch-select" className="sr-only">Filter by batch</label>
              <div className="relative">
                <Filter className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="batch-select"
                  value={batch}
                  onChange={handleBatchChange}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                >
                  <option value="">All Batches</option>
                  {batchYears.map((y) => (
                    <option key={y} value={y}>
                      Batch of {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="sort-select" className="sr-only">Sort alumni</label>
              <div className="relative">
                <ArrowUpDown className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="sort-select"
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                >
                  <option value="year_desc">Passing Year (Newest first)</option>
                  <option value="year_asc">Passing Year (Oldest first)</option>
                  <option value="name_asc">Name (A to Z)</option>
                  <option value="name_desc">Name (Z to A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filter summary pill */}
          {(search || batch) && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>Active filters:</span>
                {search && (
                  <span className="px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 font-medium">
                    Name: "{search}"
                  </span>
                )}
                {batch && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                    Batch: {batch}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="text-saffron-600 hover:text-saffron-800 font-semibold"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Directory Table / Card Views */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-saffron-500 mb-3" />
              <p className="text-sm font-medium">Loading alumni records...</p>
            </div>
          ) : directoryData.alumni.length === 0 ? (
            <div className="p-16 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No alumni found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                No alumni match your current search or batch criteria. Try adjusting the filter or search term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-saffron-700 bg-saffron-50 border border-saffron-200 hover:bg-saffron-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Searchable Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <th scope="col" className="py-4 px-6">Profile</th>
                      <th scope="col" className="py-4 px-6">Full Name</th>
                      <th scope="col" className="py-4 px-6">Passing Year</th>
                      <th scope="col" className="py-4 px-6">Current Position</th>
                      <th scope="col" className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {directoryData.alumni.map((alumnus) => (
                      <tr key={alumnus.id} className="hover:bg-gray-50/75 transition-colors group">
                        {/* 1. Profile Picture */}
                        <td className="py-4 px-6">
                          <img
                            src={alumnus.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                            alt={alumnus.full_name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                            loading="lazy"
                          />
                        </td>

                        {/* 2. Name & Location */}
                        <td className="py-4 px-6">
                          <Link
                            to={`/alumni/${alumnus.slug}`}
                            className="font-bold text-gray-900 group-hover:text-navodaya-navy transition-colors block text-base"
                          >
                            {alumnus.full_name}
                          </Link>
                          {alumnus.location && (
                            <span className="text-xs text-gray-500 block mt-0.5">
                              {alumnus.location}
                            </span>
                          )}
                        </td>

                        {/* 3. Passing-out Year */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-saffron-50 text-saffron-800 border border-saffron-200">
                            Batch of {alumnus.passing_year}
                          </span>
                        </td>

                        {/* 4. Current Position */}
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-800 block">
                            {alumnus.current_position || 'Navodaya Alumnus'}
                          </span>
                          {alumnus.company_or_institution && (
                            <span className="text-xs text-gray-500 block mt-0.5">
                              {alumnus.company_or_institution}
                            </span>
                          )}
                        </td>

                        {/* 5. View Profile */}
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/alumni/${alumnus.slug}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-navodaya-green bg-green-50 hover:bg-navodaya-green hover:text-white border border-green-200 transition-all shadow-sm"
                          >
                            <span>View Profile</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards Layout */}
              <div className="md:hidden divide-y divide-gray-100">
                {directoryData.alumni.map((alumnus) => (
                  <div key={alumnus.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={alumnus.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={alumnus.full_name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/alumni/${alumnus.slug}`}
                          className="font-bold text-gray-900 text-base block truncate"
                        >
                          {alumnus.full_name}
                        </Link>
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-saffron-50 text-saffron-800 border border-saffron-200 mt-1">
                          Batch of {alumnus.passing_year}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-gray-800">
                        <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate">{alumnus.current_position || 'Navodaya Alumnus'}</span>
                      </div>
                      {alumnus.company_or_institution && (
                        <p className="text-gray-500 pl-5 truncate">{alumnus.company_or_institution}</p>
                      )}
                    </div>

                    <Link
                      to={`/alumni/${alumnus.slug}`}
                      className="block w-full py-2 px-3 text-center text-xs font-bold rounded-lg text-white bg-navodaya-navy hover:bg-slate-900 transition-colors"
                    >
                      View Profile & Story
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {directoryData.totalPages > 1 && (
                <div className="p-4 sm:px-6 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Showing Page <span className="font-bold text-gray-800">{directoryData.page}</span> of{' '}
                    <span className="font-bold text-gray-800">{directoryData.totalPages}</span>
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= directoryData.totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
