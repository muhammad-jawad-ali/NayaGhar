"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Building2,
  Clock3,
  ExternalLink,
  Flame,
  Lightbulb,
  MapPin,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
  Trash2,
  Zap,
} from "lucide-react";
import type { Bid, Brief, Notification } from "@/lib/types";

export default function AgentDashboard({
  initialBids,
  initialBriefs,
  initialNotifications,
}: {
  initialBids: Bid[];
  initialBriefs: Brief[];
  initialNotifications: Notification[];
}) {
  const { data: session } = useSession();
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs);
  const [notifications] = useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const handleDeleteBid = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this bid?")) return;
    try {
      const res = await fetch(`/api/bids/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBids((prev) => prev.filter((b) => b._id!.toString() !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to withdraw bid");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    }
  };

  const formatLabel = (value?: string) =>
    value ? value.replace(/-/g, " ") : "—";

  const imageByCategory: Record<string, string> = {
    house: "/images/marketplace/house.jpg",
    flat: "/images/marketplace/flat.jpg",
    plot: "/images/marketplace/plot.jpg",
    commercial: "/images/marketplace/commercial.jpg",
    farmhouse: "/images/marketplace/house.jpg",
    other: "/images/marketplace/fallback.jpg",
  };

  const getBidImage = (bid: Bid) => {
    if (bid.images && bid.images.length > 0) return bid.images[0];
    return imageByCategory[bid.category] || imageByCategory.other;
  };

  const pendingCount = bids.filter((b) => b.status === "pending").length;
  const acceptedCount = bids.filter((b) => b.status === "accepted").length;

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#111827]">
      {/* ─── Ambient background ─── */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(22,163,74,0.10),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(74,222,128,0.08),transparent_22%),radial-gradient(circle_at_50%_90%,rgba(15,23,42,0.06),transparent_30%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 shadow-sm backdrop-blur-xl mb-4">
              <Sparkles size={14} />
              Agent Command Center
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-gray-950 tracking-tight">
              Your Dashboard
            </h1>
            <p className="mt-2 text-base font-medium text-gray-500 max-w-lg">
              Track submitted bids, discover hot new leads, and close deals
              faster.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-lg shadow-gray-900/15 transition-all hover:bg-primary hover:-translate-y-0.5"
          >
            <Search size={16} />
            Find New Leads
          </Link>
        </div>

        {/* ─── Stats Bar ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            {
              label: "Total Bids",
              value: bids.length,
              icon: TrendingUp,
              accent: "text-primary",
            },
            {
              label: "Pending",
              value: pendingCount,
              icon: Clock3,
              accent: "text-amber-600",
            },
            {
              label: "Accepted",
              value: acceptedCount,
              icon: BadgeCheck,
              accent: "text-emerald-600",
            },
            {
              label: "Hot Leads",
              value: briefs.length,
              icon: Flame,
              accent: "text-rose-500",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/64 p-5 shadow-lg shadow-black/[0.04] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.85),transparent_48%,rgba(255,255,255,0.35))]"
            >
              <div className="relative">
                <stat.icon className={stat.accent} size={20} />
                <p className="mt-3 text-3xl font-black text-gray-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-bold text-gray-500">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* ─── Left Column: Submitted Bids ─── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-black text-gray-950">
                My Submitted Bids
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 backdrop-blur-xl">
                {bids.length} total
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl bg-white/50 animate-pulse border border-white/60"
                  />
                ))}
              </div>
            ) : bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div
                    key={bid._id?.toString()}
                    className="group relative overflow-hidden rounded-[22px] border border-white/80 bg-white/62 shadow-lg shadow-black/[0.04] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.82),transparent_42%,rgba(255,255,255,0.34))] before:opacity-80"
                  >
                    <div className="relative flex flex-col sm:flex-row">
                      {/* Property Image */}
                      <div className="relative w-full sm:w-48 md:w-56 shrink-0 overflow-hidden bg-gray-100">
                        <div className="aspect-[4/3] sm:aspect-auto sm:h-full relative">
                          <Image
                            src={getBidImage(bid)}
                            alt={bid.propertyTitle}
                            fill
                            sizes="(min-width: 640px) 224px, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/20 to-transparent" />
                          {/* Status badge on image */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-xl ${
                                bid.status === "accepted"
                                  ? "border-emerald-200/80 bg-emerald-50/90 text-emerald-700"
                                  : bid.status === "rejected"
                                  ? "border-rose-200/80 bg-rose-50/90 text-rose-700"
                                  : "border-white/60 bg-white/90 text-blue-700"
                              }`}
                            >
                              {bid.status === "accepted" && (
                                <BadgeCheck size={12} />
                              )}
                              {bid.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative flex-1 p-5 sm:p-5 flex flex-col">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-gray-950 group-hover:text-primary transition-colors truncate">
                              {bid.propertyTitle}
                            </h3>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
                              <MapPin size={14} className="shrink-0" />
                              {bid.area}, {bid.city}
                            </p>
                          </div>
                          {bid.status === "pending" && (
                            <button
                              onClick={() =>
                                handleDeleteBid(bid._id!.toString())
                              }
                              className="rounded-full bg-white/80 border border-gray-200 p-2 text-gray-400 shadow-sm backdrop-blur-xl transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500 shrink-0"
                              title="Withdraw Bid"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Price & Details */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-lg font-black text-primary">
                            PKR {bid.price?.toLocaleString()}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm font-bold text-gray-500 capitalize">
                            {formatLabel(bid.category)}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm font-bold text-gray-500">
                            {bid.areaSize} {formatLabel(bid.areaUnit)}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-3 border-t border-gray-100/80 pt-3 mt-auto">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Clock3 size={13} />
                            {new Date(bid.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <Link
                            href={`/briefs/${bid.briefId}`}
                            className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary-hover transition-colors"
                          >
                            View Original Brief
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/58 p-12 text-center shadow-lg shadow-black/[0.04] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(22,163,74,0.08),transparent_40%)]" />
                <div className="relative">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200/60 bg-emerald-50 text-primary">
                    <Building2 size={28} />
                  </div>
                  <p className="text-gray-500 font-medium mb-4">
                    You haven&apos;t submitted any bids yet.
                  </p>
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-black text-white shadow-md shadow-gray-900/10 transition-all hover:bg-primary"
                  >
                    Browse Marketplace
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* ─── Right Column: Sidebar ─── */}
          <div className="space-y-6">
            {/* Hot New Leads */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Flame size={18} className="text-rose-500" />
                <h2 className="text-xl font-black text-gray-950">
                  Hot New Leads
                </h2>
              </div>
              <div className="space-y-3">
                {briefs.map((brief) => (
                  <div
                    key={brief._id?.toString()}
                    className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/68 p-5 shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(15,23,42,0.10)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.88),transparent_45%,rgba(255,255,255,0.30))] before:opacity-80"
                  >
                    <div className="relative">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-2">
                        {brief.category}
                      </p>
                      <h4 className="text-base font-black text-gray-950 mb-1">
                        {brief.areaSize} {formatLabel(brief.areaUnit)} in{" "}
                        {brief.area}
                      </h4>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mb-4">
                        <MapPin size={13} />
                        {brief.city}
                        <span className="text-gray-300 mx-1">·</span>
                        Budget: PKR {brief.budgetMax?.toLocaleString()}
                      </p>
                      <Link
                        href={`/bids/new?briefId=${brief._id}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-950 py-3 text-sm font-black text-white shadow-md shadow-gray-900/10 transition-all hover:bg-primary"
                      >
                        <Zap size={14} />
                        Bid Now
                      </Link>
                    </div>
                  </div>
                ))}
                {briefs.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white/40 p-6 text-center backdrop-blur-xl">
                    <p className="text-sm font-medium text-gray-400">
                      No open leads right now.
                    </p>
                  </div>
                )}
                <Link
                  href="/marketplace"
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/80 bg-white/50 py-3 text-sm font-bold text-gray-600 shadow-sm backdrop-blur-xl transition-all hover:text-primary hover:bg-white/70"
                >
                  View all marketplace leads
                  <ArrowRight size={14} />
                </Link>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <BellRing size={18} className="text-amber-500" />
                <h2 className="text-xl font-black text-gray-950">
                  Recent Activity
                </h2>
              </div>
              <div className="relative overflow-hidden rounded-[22px] border border-white/80 bg-white/58 p-5 shadow-lg shadow-black/[0.04] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.82),transparent_42%,rgba(255,255,255,0.34))] before:opacity-80">
                <div className="relative space-y-5">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n._id!.toString()}
                        className="flex gap-3 group/item"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-4 ${
                            n.type === "match"
                              ? "bg-primary ring-emerald-50"
                              : n.type === "bid_accepted"
                              ? "bg-emerald-500 ring-emerald-50"
                              : "bg-amber-500 ring-amber-50"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={n.link}
                            className="text-sm font-bold text-gray-900 hover:text-primary transition-colors block truncate"
                          >
                            {n.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {n.message}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm font-medium text-gray-400">
                        No recent activity found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Pro Tips */}
            <section className="relative overflow-hidden rounded-[22px] border border-white/25 bg-[#111827] p-6 shadow-xl shadow-black/10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_68%_70%,rgba(74,222,128,0.12),transparent_30%)]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-emerald-400">
                    <Lightbulb size={16} />
                  </div>
                  <h3 className="text-base font-black text-white">
                    Pro Tips for Agents
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      num: "01",
                      text: "Complete your profile to gain more trust from buyers.",
                    },
                    {
                      num: "02",
                      text: "Include high-quality images in your bids.",
                    },
                    {
                      num: "03",
                      text: "Respond quickly to new leads to stay ahead.",
                    },
                  ].map((tip) => (
                    <li key={tip.num} className="flex gap-3">
                      <span className="text-sm font-black text-emerald-400">
                        {tip.num}.
                      </span>
                      <span className="text-sm font-medium text-white/70 leading-relaxed">
                        {tip.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
