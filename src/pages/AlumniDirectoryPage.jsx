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
    <div className="py-10 sm:py-16 bg-[#FBFBF9] min-h-screen">
      <Seo
        title="Alumni Directory | JNV Nadia Alumni"
        description="Search and connect with former students of Jawahar Navodaya Vidyalaya, Nadia. Filter by batch year, search by name, and explore career journeys."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-maroon-900 bg-maroon-50 border border-maroon-200/80 mb-2">
            <GraduationCap className="h-3.5 w-3.5 text-maroon-700" />
            Navodaya Roll of Honor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight font-serif">
            Alumni Directory
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-charcoal-600">
            Searchable registry of registered former students. Currently displaying{' '}
            <span className="font-bold text-maroon-900">{directoryData.totalCount}</span> alumni.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl shadow-soft border border-stone-200/90 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <label htmlFor="search-input" className="sr-only">Search by full name</label>
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-charcoal-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Search by full name or occupation..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-ivory-surface text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-maroon-500/30 focus:border-maroon-700 transition-all"
              />
            </div>

            {/* Batch Filter */}
            <div>
              <label htmlFor="batch-select" className="sr-only">Filter by batch</label>
              <div className="relative">
                <Filter className="absolute left-3.5 top-3 h-4 w-4 text-charcoal-400" />
                <select
                  id="batch-select"
                  value={batch}
                  onChange={handleBatchChange}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-charcoal-900 bg-ivory-surface focus:outline-none focus:ring-2 focus:ring-maroon-500/30 focus:border-maroon-700 transition-all"
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
                <ArrowUpDown className="absolute left-3.5 top-3 h-4 w-4 text-charcoal-400" />
                <select
                  id="sort-select"
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-charcoal-900 bg-ivory-surface focus:outline-none focus:ring-2 focus:ring-maroon-500/30 focus:border-maroon-700 transition-all"
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
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px]">Active filters:</span>
                {search && (
                  <span className="px-2 py-0.5 rounded-full bg-maroon-50 text-maroon-900 border border-maroon-200/80 text-[11px] font-semibold">
                    Name: "{search}"
                  </span>
                )}
                {batch && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-50 text-gold-900 border border-gold-200 text-[11px] font-semibold">
                    Batch: {batch}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="text-maroon-800 hover:text-maroon-950 font-bold text-xs"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Directory Table / Card Views */}
        <div className="bg-white rounded-2xl shadow-soft border border-stone-200/90 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-charcoal-500">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-maroon-700 mb-3" />
              <p className="text-xs sm:text-sm font-medium">Loading alumni records...</p>
            </div>
          ) : directoryData.alumni.length === 0 ? (
            <div className="p-16 text-center">
              <User className="h-12 w-12 text-charcoal-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-charcoal-800 font-serif">No alumni found</h3>
              <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-sm mx-auto">
                No alumni match your current search or batch criteria. Try adjusting the filter or search term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-maroon-900 bg-maroon-50 border border-maroon-200/80 hover:bg-maroon-100 transition-colors"
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
                    <tr className="border-b border-stone-200 bg-[#FAF9F5] text-[11px] font-bold text-charcoal-600 uppercase tracking-wider">
                      <th scope="col" className="py-3.5 px-6">Profile</th>
                      <th scope="col" className="py-3.5 px-6">Full Name</th>
                      <th scope="col" className="py-3.5 px-6">Passing Year</th>
                      <th scope="col" className="py-3.5 px-6">Current Position</th>
                      <th scope="col" className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                    {directoryData.alumni.map((alumnus) => (
                      <tr key={alumnus.id} className="hover:bg-ivory-surface/80 transition-colors group">
                        {/* 1. Profile Picture */}
                        <td className="py-4 px-6">
                          <img
                            src={alumnus.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                            alt={alumnus.full_name}
                            className="w-11 h-11 rounded-full object-cover border border-stone-200 ring-1 ring-gold-400/30 shadow-2xs"
                            loading="lazy"
                          />
                        </td>

                        {/* 2. Name & Location */}
                        <td className="py-4 px-6">
                          <Link
                            to={`/alumni/${alumnus.slug}`}
                            className="font-bold text-charcoal-900 group-hover:text-maroon-800 transition-colors block text-sm font-serif"
                          >
                            {alumnus.full_name}
                          </Link>
                          {alumnus.location && (
                            <span className="text-[11px] text-charcoal-500 block mt-0.5">
                              {alumnus.location}
                            </span>
                          )}
                        </td>

                        {/* 3. Passing-out Year */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-maroon-50 text-maroon-900 border border-maroon-200/70">
                            Batch of {alumnus.passing_year}
                          </span>
                        </td>

                        {/* 4. Current Position */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-charcoal-800 block text-xs">
                            {alumnus.current_position || 'Navodaya Alumnus'}
                          </span>
                          {alumnus.company_or_institution && (
                            <span className="text-[11px] text-charcoal-500 block mt-0.5">
                              {alumnus.company_or_institution}
                            </span>
                          )}
                        </td>

                        {/* 5. View Profile */}
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/alumni/${alumnus.slug}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-maroon-800 bg-maroon-50 hover:bg-maroon-800 hover:text-white border border-maroon-200 transition-all shadow-2xs"
                          >
                            <span>View Profile</span>
                            <ExternalLink className="h-3 w-3 text-gold-600 group-hover:text-white" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive 2-Card Row Grid */}
              <div className="md:hidden grid grid-cols-2 gap-2.5 p-3">
                {directoryData.alumni.map((alumnus) => (
                  <div key={alumnus.id} className="p-2.5 rounded-xl border border-stone-200/90 bg-white flex flex-col items-center text-center shadow-2xs hover:border-maroon-300 transition-colors">
                    <img
                      src={alumnus.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={alumnus.full_name}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200 ring-1 ring-gold-400/30 mb-1.5"
                      loading="lazy"
                    />
                    <Link
                      to={`/alumni/${alumnus.slug}`}
                      className="font-bold text-charcoal-900 text-xs block truncate max-w-full font-serif hover:text-maroon-800 transition-colors"
                    >
                      {alumnus.full_name}
                    </Link>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-maroon-50 text-maroon-900 border border-maroon-200/80 mt-0.5">
                      Batch {alumnus.passing_year}
                    </span>

                    <p className="text-[10px] text-charcoal-500 truncate max-w-full mt-1 flex-1">
                      {alumnus.current_position || 'Navodayan'}
                    </p>

                    <Link
                      to={`/alumni/${alumnus.slug}`}
                      className="block w-full mt-2 py-1.5 px-1.5 text-center text-[10px] font-bold rounded-lg text-white bg-maroon-800 hover:bg-maroon-900 transition-colors shadow-2xs"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {directoryData.totalPages > 1 && (
                <div className="p-4 sm:px-6 border-t border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
                  <p className="text-xs text-charcoal-500">
                    Showing Page <span className="font-bold text-charcoal-800">{directoryData.page}</span> of{' '}
                    <span className="font-bold text-charcoal-800">{directoryData.totalPages}</span>
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-charcoal-700 bg-white hover:bg-ivory-surface disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= directoryData.totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-charcoal-700 bg-white hover:bg-ivory-surface disabled:opacity-40 transition-colors"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
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
