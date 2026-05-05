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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Requirement Marketplace
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Browse active property requirements and pitch your portfolio.
          </p>
        </div>
        
        {(session?.user as any)?.role === "buyer" && (
          <Link
            href="/briefs/new"
            className="btn-primary shadow-lg shadow-primary/20"
          >
            Post a Requirement
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12 p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
        <div className="lg:col-span-5 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Search Requirements</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 5 Marla House in DHA..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Location (City)</label>
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">All Cities</option>
            {PAKISTANI_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
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

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Active Briefs</h2>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            {briefs.length} total
          </span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-primary text-sm font-bold">
            <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
            Refreshing...
          </div>
        )}
      </div>

      {/* Results */}
      {loading && briefs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl bg-gray-50 border border-gray-100 h-[400px] animate-pulse" />
          ))}
        </div>
      ) : briefs.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {briefs.map((brief) => (
            <BriefCard key={brief._id?.toString()} brief={brief} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200">
          <div className="text-gray-500 text-xl font-medium mb-4">No matching requirements found.</div>
          <button 
            onClick={() => setFilters({ city: "", category: "" })}
            className="text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.page < pagination.pages && (
        <div className="mt-16 text-center">
          <button
            onClick={() => fetchBriefs(currentPage + 1, true)}
            disabled={loading}
            className="btn-secondary px-12 py-4 text-lg font-bold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Requirements"}
          </button>
        </div>
      )}
    </div>
  );
}
