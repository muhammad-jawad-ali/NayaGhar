"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import BriefCard from "@/components/BriefCard";
import type { Brief } from "@/lib/types";
import { PAKISTANI_CITIES } from "@/lib/types";
import { useSession } from "next-auth/react";

const categoryChips = [
  { label: "All", value: "", icon: Sparkles },
  { label: "Houses", value: "house", icon: Home },
  { label: "Flats", value: "flat", icon: Building2 },
  { label: "Plots", value: "plot", icon: MapPin },
  { label: "Commercial", value: "commercial", icon: Store },
];

export default function MarketplacePage() {
  const { data: session } = useSession();
  const sessionUser = session?.user as { role?: string } | undefined;
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    q: "",
    city: "",
    category: "",
  });
  const hasActiveFilters = Boolean(filters.q || filters.city || filters.category);

  const fetchBriefs = useCallback(async (pageNumber = 1, append = false) => {
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
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchBriefs(1, false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchBriefs]);

  const glassSection = "relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_40%,rgba(255,255,255,0.2))] before:opacity-80 transition-all";
  const inputStyle = "h-14 w-full bg-white/60 border border-gray-200/60 rounded-2xl pl-12 pr-4 text-gray-950 font-medium placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-sm";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5ef] pb-24">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] rounded-full bg-emerald-400/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-[150px] translate-y-1/4" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-xl">
              <Sparkles size={14} strokeWidth={2.5} />
              Live Marketplace
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-gray-950 sm:text-6xl lg:text-7xl leading-[1.05]">
              Find demand before it hits the market.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-500">
              Browse active buyer requirements, filter by intent, and pitch only where your property actually matches.
            </p>
          </div>

          <div className={`${glassSection} p-6`}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live inventory</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <p className="text-4xl font-black text-gray-950">{pagination.total}</p>
                </div>
              </div>
              {sessionUser?.role === "buyer" ? (
                <Link
                  href="/briefs/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-gray-900/15 transition-all hover:bg-emerald-600 hover:-translate-y-1 group"
                >
                  Post brief
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-gray-900/15 transition-all hover:bg-emerald-600 hover:-translate-y-1 group"
                >
                  Join to pitch
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/40 bg-white/60 p-3 shadow-sm">
                <p className="text-xl font-black text-emerald-600">{briefs.filter((brief) => brief.bidsCount > 0).length}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">with bids</p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/60 p-3 shadow-sm">
                <p className="text-xl font-black text-amber-500">{briefs.filter((brief) => brief.urgency === "immediate").length}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">urgent</p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/60 p-3 shadow-sm">
                <p className="text-xl font-black text-indigo-600">{new Set(briefs.map((brief) => brief.city)).size}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">cities</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`sticky top-24 z-20 mb-12 p-6 sm:p-8 ${glassSection}`}>
          <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
            <SlidersHorizontal size={15} strokeWidth={2.5} />
            Refine & Filter
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <label className="relative lg:col-span-5">
              <span className="sr-only">Search requirements</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} strokeWidth={2.5} />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder="Search DHA, Solar, commercial..."
                className={inputStyle}
              />
            </label>

            <label className="relative lg:col-span-4">
              <span className="sr-only">Location city</span>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} strokeWidth={2.5} />
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className={`${inputStyle} cursor-pointer appearance-none`}
              >
                <option value="">All Cities</option>
                {PAKISTANI_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </label>

            <label className="relative lg:col-span-3">
              <span className="sr-only">Category</span>
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} strokeWidth={2.5} />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={`${inputStyle} cursor-pointer appearance-none`}
              >
                <option value="">All Categories</option>
                <option value="house">House</option>
                <option value="flat">Flat</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
                <option value="farmhouse">Farmhouse</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {categoryChips.map((chip) => {
              const Icon = chip.icon;
              const active = filters.category === chip.value;
              return (
                <button
                  key={chip.value || "all"}
                  type="button"
                  onClick={() => setFilters({ ...filters, category: chip.value })}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-black transition-all duration-300 ${
                    active
                      ? "border-gray-950 bg-gray-950 text-white shadow-lg"
                      : "border-white/60 bg-white/60 text-gray-500 hover:border-emerald-500 hover:text-emerald-700"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} className={active ? "text-emerald-400" : ""} />
                  {chip.label}
                </button>
              );
            })}
            {hasActiveFilters && (
               <button
                type="button"
                onClick={() => setFilters({ q: "", city: "", category: "" })}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black text-rose-500 transition-all hover:bg-rose-50"
              >
                <X size={14} strokeWidth={2.5} />
                Clear Filters
              </button>
            )}
          </div>
        </section>

        <section className="mb-8 flex flex-col gap-3 border-b-2 border-gray-950 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-950 flex items-center gap-3">
              {pagination.total} matching requirement{pagination.total === 1 ? "" : "s"}
            </h2>
          </div>
          {loading && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Refreshing market...
            </div>
          )}
        </section>

        {loading && briefs.length === 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${glassSection} h-[450px] animate-pulse`} />
            ))}
          </div>
        ) : briefs.length > 0 ? (
          <div className={`grid grid-cols-1 gap-8 transition-opacity duration-500 md:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}>
            {briefs.map((brief) => (
              <BriefCard key={brief._id?.toString()} brief={brief} />
            ))}
          </div>
        ) : (
          <div className={`${glassSection} py-24 text-center flex flex-col items-center justify-center`}>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-300 shadow-sm">
              <Search size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black text-gray-950 mb-3">No matching briefs found</h3>
            <p className="max-w-md text-base font-medium leading-relaxed text-gray-500">
              Try a broader city, clear the category, or search for a nearby society to find active demand.
            </p>
            <button 
              onClick={() => setFilters({ q: "", city: "", category: "" })}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-gray-900/15 transition-all hover:bg-emerald-600 hover:-translate-y-1 group"
            >
              Reset All Filters
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {pagination.page < pagination.pages && (
          <div className="mt-16 text-center">
            <button
              onClick={() => fetchBriefs(currentPage + 1, true)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/40 px-10 py-4 text-sm font-black text-gray-950 shadow-sm backdrop-blur-3xl transition-all hover:bg-white/80 hover:text-emerald-700 disabled:opacity-50 group"
            >
              {loading ? "Loading..." : "Load More Requirements"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
