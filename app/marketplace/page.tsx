"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BriefCard from "@/components/BriefCard";
import type { Brief } from "@/lib/types";
import { PAKISTANI_CITIES } from "@/lib/types";
import { useSession } from "next-auth/react";

export default function MarketplacePage() {
  const { data: session } = useSession();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    city: "",
    category: "",
  });

  const fetchBriefs = async (pageNumber = 1, append = false) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ 
        ...filters, 
        page: pageNumber.toString(),
        limit: "9" 
      });
      const res = await fetch(`/api/briefs?${query.toString()}`);
      const data = await res.json();
      
      if (data.briefs && Array.isArray(data.briefs)) {
        if (append) {
          setBriefs(prev => [...prev, ...data.briefs]);
        } else {
          setBriefs(data.briefs);
        }
        setPagination(data.pagination);
        setCurrentPage(data.pagination.page);
      }
    } catch (error) {
      console.error("Failed to fetch briefs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs(1, false);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Requirement Marketplace
          </h1>
          <p className="text-slate-400 text-lg">
            Directly fulfill buyer requirements with your property portfolio.
          </p>
        </div>
        
        {session?.user?.role === "buyer" && (
          <Link
            href="/briefs/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-200"
          >
            Post a Requirement
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 mb-10 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-xl">
        <div className="lg:col-span-5 space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Search Requirements</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 5 Marla House in DHA..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-3.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location (City)</label>
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-3.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">All Cities</option>
            {PAKISTANI_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3 space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-3.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="house">House</option>
            <option value="flat">Flat</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
            <option value="farmhouse">Farmhouse</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Available Briefs</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
            {briefs.length} Total
          </span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
            REFRESHING...
          </div>
        )}
      </div>

      {/* Results */}
      {loading && briefs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group relative rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden h-[400px]">
              <div className="h-48 bg-white/[0.03] animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-4 w-1/3 bg-white/[0.03] rounded-full animate-pulse" />
                <div className="h-6 w-3/4 bg-white/[0.03] rounded-full animate-pulse" />
                <div className="h-4 w-full bg-white/[0.03] rounded-full animate-pulse" />
                <div className="flex gap-2 pt-4">
                  <div className="h-10 w-full bg-white/[0.03] rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : briefs.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {briefs.map((brief) => (
            <BriefCard key={brief._id} brief={brief} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-white/[0.01] border border-dashed border-white/10">
          <div className="text-slate-500 text-lg">No active requirements found.</div>
          <button 
            onClick={() => setFilters({ city: "", category: "" })}
            className="mt-4 text-indigo-400 font-semibold hover:text-indigo-300 underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination / Load More */}
      {pagination.page < pagination.pages && (
        <div className="mt-12 text-center">
          <button
            onClick={() => fetchBriefs(currentPage + 1, true)}
            disabled={loading}
            className="px-10 py-4 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white font-bold rounded-2xl transition-all disabled:opacity-50"
          >
            {loading ? "LOADING..." : "LOAD MORE REQUIREMENTS"}
          </button>
        </div>
      )}
    </div>
  );
}
