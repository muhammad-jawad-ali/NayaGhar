"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { Bid, Brief } from "@/lib/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImageIcon,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";

type SessionUser = {
  id?: string;
  role?: string;
};

const galleryByCategory = {
  house: [
    "/images/marketplace/house.jpg",
    "/images/marketplace/fallback.jpg",
    "/images/marketplace/flat.jpg",
  ],
  flat: [
    "/images/marketplace/flat.jpg",
    "/images/marketplace/fallback.jpg",
    "/images/marketplace/house.jpg",
  ],
  plot: [
    "/images/marketplace/plot.jpg",
    "/images/marketplace/fallback.jpg",
    "/images/marketplace/house.jpg",
  ],
  commercial: [
    "/images/marketplace/commercial.jpg",
    "/images/marketplace/fallback.jpg",
    "/images/marketplace/flat.jpg",
  ],
  farmhouse: [
    "/images/marketplace/house.jpg",
    "/images/marketplace/plot.jpg",
    "/images/marketplace/fallback.jpg",
  ],
  other: [
    "/images/marketplace/fallback.jpg",
    "/images/marketplace/house.jpg",
    "/images/marketplace/flat.jpg",
  ],
} as const;

export default function BriefDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: session, status: sessionStatus } = useSession();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(false);
  const [hasAlreadyBid, setHasAlreadyBid] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchBrief() {
      try {
        setLoading(true);
        setBrief(null);
        setBids([]);
        setHasAlreadyBid(false);
        setSelectedPhoto(0);
        const res = await fetch(`/api/briefs/${id}`);
        if (!res.ok) throw new Error("Brief not found");
        const data = await res.json();
        if (!cancelled) setBrief(data);
      } catch (error) {
        console.error("Error fetching brief:", error);
        if (!cancelled) setBrief(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchBrief();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !brief || sessionStatus !== "authenticated" || !session?.user) {
      return;
    }

    let cancelled = false;
    const currentUser = session.user as SessionUser;

    async function fetchBids() {
      setLoadingBids(true);
      try {
        const res = await fetch(`/api/bids?briefId=${id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setBids(data.bids || []);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        if (!cancelled) setLoadingBids(false);
      }
    }

    async function checkIfAlreadyBid() {
      try {
        const res = await fetch(`/api/bids?briefId=${id}&agentId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setHasAlreadyBid(Boolean(data.bids?.length));
        }
      } catch (error) {
        console.error("Error checking bid status:", error);
      }
    }

    if (currentUser.id === brief.buyerId || currentUser.role === "admin") {
      void fetchBids();
    }

    if (currentUser.role === "agent") {
      void checkIfAlreadyBid();
    }

    return () => {
      cancelled = true;
    };
  }, [brief, id, session, sessionStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">Loading requirement details...</p>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="bg-gray-50/60 min-h-[70vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-10">
            <p className="text-sm font-black uppercase tracking-wider text-primary mb-3">Brief unavailable</p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">This requirement could not be found.</h1>
            <p className="text-gray-500 mb-8">It may have been removed, closed, or the link may be incorrect.</p>
            <Link href="/marketplace" className="btn-primary px-6 py-3">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sessionUser = session?.user as SessionUser | undefined;
  const isOwner = sessionUser?.id === brief.buyerId;
  const isAdmin = sessionUser?.role === "admin";
  const canSeeBids = isOwner || isAdmin;
  const formatMoney = (value?: number) => value ? `PKR ${value.toLocaleString()}` : "Not specified";
  const formatLabel = (value?: string) => value ? value.replace(/-/g, " ") : "Not specified";
  const categoryLabel = formatLabel(brief.category);
  const briefTitle = `${categoryLabel} Requirement`;
  const budgetLabel = brief.budgetNotSpecified
    ? "Negotiable"
    : `${formatMoney(brief.budgetMin)} - ${brief.budgetMax?.toLocaleString()}`;
  const galleryImages = galleryByCategory[brief.category] || galleryByCategory.other;
  const statusStyles = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-100",
    closed: "bg-gray-100 text-gray-600 border-gray-200",
    fulfilled: "bg-blue-50 text-blue-700 border-blue-100",
  } as const;
  const bidStatusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-rose-50 text-rose-700 border-rose-100",
    withdrawn: "bg-gray-100 text-gray-600 border-gray-200",
  } as const;
  const overviewItems = [
    { label: "Purpose", value: formatLabel(brief.purpose), icon: Sparkles },
    { label: "Area Size", value: `${brief.areaSize} ${formatLabel(brief.areaUnit)}`, icon: Ruler },
    { label: "Bedrooms", value: brief.bedrooms ? String(brief.bedrooms) : "N/A", icon: BedDouble },
    { label: "Bathrooms", value: brief.bathrooms ? String(brief.bathrooms) : "N/A", icon: Bath },
    { label: "Urgency", value: formatLabel(brief.urgency), icon: Zap },
    { label: "Payment", value: formatLabel(brief.paymentPlan), icon: WalletCards },
  ];

  const glassSection = "relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_40%,rgba(255,255,255,0.2))] before:opacity-80 transition-all";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5ef] pb-24">
      {/* Cinematic Ambient Background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 to-transparent" />
        <div className="absolute top-[-20%] left-1/4 w-[800px] h-[800px] rounded-full bg-emerald-400/15 blur-[150px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-12">
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-800 shadow-sm backdrop-blur-3xl transition-all hover:bg-white hover:-translate-x-1"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </Link>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-xl shadow-black/[0.03] backdrop-blur-3xl">
            <div className="relative aspect-[16/10] min-h-[420px] overflow-hidden rounded-[1.5rem] bg-gray-950">
              <Image
                src={galleryImages[selectedPhoto]}
                alt={`${briefTitle} in ${brief.area}`}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
              
              <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-3xl ${statusStyles[brief.status] || statusStyles.open}`}>
                  <ShieldCheck size={14} />
                  {brief.status}
                </span>
                {brief.urgency === "immediate" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/20 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-300 shadow-lg backdrop-blur-3xl">
                    <Zap size={14} />
                    urgent
                  </span>
                )}
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white/70 tracking-widest uppercase">
                  <MapPin size={16} className="text-emerald-400" />
                  {brief.area}, {brief.city}
                </p>
                <h1 className="max-w-3xl text-4xl font-black capitalize leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  {briefTitle}
                </h1>
              </div>
              <div className="absolute bottom-6 right-6 hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-black text-white shadow-lg backdrop-blur-3xl sm:inline-flex">
                <ImageIcon size={15} className="mr-2" />
                {galleryImages.length} photos
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedPhoto(index)}
                  className={`relative aspect-[5/3] overflow-hidden rounded-[1rem] border-2 transition-all ${
                    selectedPhoto === index ? "border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="180px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={`${glassSection} p-8`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Authorized Budget</p>
              <p className="mt-2 text-4xl font-black leading-tight text-gray-950">{budgetLabel}</p>
              
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm text-center">
                  <Ruler className="mx-auto mb-2 text-gray-400" size={18} />
                  <p className="text-sm font-black text-gray-950">{brief.areaSize} {formatLabel(brief.areaUnit)}</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm text-center">
                  <BedDouble className="mx-auto mb-2 text-gray-400" size={18} />
                  <p className="text-sm font-black text-gray-950">{brief.bedrooms || "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm text-center">
                  <Bath className="mx-auto mb-2 text-gray-400" size={18} />
                  <p className="text-sm font-black text-gray-950">{brief.bathrooms || "N/A"}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t border-gray-200/60 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">Posted by</span>
                  <span className="font-black text-gray-950 bg-white/60 px-3 py-1 rounded-full shadow-sm">{brief.buyerName}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">Bids received</span>
                  <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">{brief.bidsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">Date Listed</span>
                  <span className="font-black text-gray-950">
                    {new Date(brief.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {sessionUser?.role === "agent" && (
                hasAlreadyBid ? (
                  <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 font-black text-emerald-700 shadow-sm">
                    <CheckCircle2 size={18} />
                    Pitch Submitted
                  </div>
                ) : (
                  <Link
                    href={`/bids/new?briefId=${brief._id}`}
                    className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-5 font-black text-white shadow-xl shadow-gray-900/15 transition-all hover:bg-emerald-600 hover:-translate-y-1 group text-lg"
                  >
                    Draft a Pitch
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                )
              )}
            </div>
          </aside>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <main className="space-y-8 lg:col-span-2">
            <section className={`${glassSection} p-8 sm:p-10`}>
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Requirement DNA</p>
                  <h2 className="mt-2 text-3xl font-black text-gray-950">Core Specs</h2>
                </div>
                <span className="w-fit rounded-full bg-white/60 border border-white/80 px-5 py-2 text-xs font-black capitalize text-gray-950 shadow-sm">
                  {formatLabel(brief.propertyStatus)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {overviewItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-white/60 bg-white/50 p-5 shadow-sm transition-all hover:bg-white/80">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-md">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
                      <p className="capitalize text-gray-950 font-black text-lg leading-snug">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={`${glassSection} p-8 sm:p-10`}>
              <h2 className="text-3xl font-black text-gray-950 mb-6">The Narrative</h2>
              <p className="whitespace-pre-wrap text-gray-600 leading-relaxed font-medium text-lg">
                {brief.description || "The buyer has not provided additional details yet. Use the requirement facts, location, budget, and amenities to decide whether your property is a strong match."}
              </p>
            </section>

            <section className={`${glassSection} p-8 sm:p-10`}>
              <h2 className="text-3xl font-black text-gray-950 mb-6">Required Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {brief.amenities.length > 0 ? (
                  brief.amenities.map(amenity => (
                    <span key={amenity} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-5 py-3 text-sm font-black text-gray-950 shadow-sm">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic font-medium">No specific amenities requested.</p>
                )}
              </div>
            </section>

            {canSeeBids && (
              <section className={`${glassSection} p-8 sm:p-10`}>
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b-2 border-gray-950 pb-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">The Market Response</p>
                    <h2 className="mt-1 text-3xl font-black text-gray-950">Received Pitches</h2>
                  </div>
                  <span className="w-fit rounded-full bg-gray-950 px-4 py-1.5 text-xs font-black text-white shadow-md">
                    {bids.length} Total
                  </span>
                </div>

                {loadingBids ? (
                  <div className="flex justify-center py-16">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : bids.length > 0 ? (
                  <div className="space-y-6">
                    {bids.map((bid) => (
                      <article key={bid._id?.toString()} className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-black/[0.04] transition-all hover:bg-white/90 hover:shadow-xl hover:-translate-y-1">
                        <div className="p-6 sm:p-8">
                          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="mb-3 flex flex-wrap items-center gap-3">
                                <h3 className="text-2xl font-black text-gray-950">{bid.propertyTitle}</h3>
                                <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${bidStatusStyles[bid.status]}`}>
                                  {bid.status}
                                </span>
                              </div>
                              <p className="flex items-center gap-2 text-gray-500 font-medium">
                                <MapPin size={16} />
                                {bid.propertyAddress}
                              </p>
                              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                                Pitch by <span className="text-gray-950">{bid.agentName}</span>
                              </p>
                            </div>
                            <div className="md:text-right bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Asking Price</p>
                              <p className="text-2xl font-black text-emerald-700">{formatMoney(bid.price)}</p>
                              <p className="text-emerald-700/70 text-xs font-black uppercase tracking-wider mt-1">{formatLabel(bid.paymentPlan)}</p>
                            </div>
                          </div>

                          <div className="mb-6 grid grid-cols-2 gap-3 border-y border-gray-200/60 py-6 sm:grid-cols-4">
                            {[
                              ["Area", `${bid.areaSize} ${formatLabel(bid.areaUnit)}`],
                              ["Status", formatLabel(bid.propertyStatus)],
                              ["Beds", bid.bedrooms || "N/A"],
                              ["Baths", bid.bathrooms || "N/A"],
                            ].map(([label, value]) => (
                              <div key={label} className="bg-white/50 rounded-xl p-3 border border-white/60">
                                <p className="text-[10px] text-gray-400 uppercase font-black mb-1">{label}</p>
                                <p className="text-gray-950 text-sm font-black capitalize">{value}</p>
                              </div>
                            ))}
                          </div>

                          {bid.description && (
                            <div className="bg-white/40 rounded-2xl p-5 border border-white/50">
                              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Agent's Note</p>
                              <p className="text-gray-700 text-sm leading-relaxed font-medium">{bid.description}</p>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border-2 border-dashed border-gray-300 bg-white/30 py-20 text-center backdrop-blur-sm">
                    <p className="text-gray-500 font-bold">No pitches received yet for this requirement.</p>
                  </div>
                )}
              </section>
            )}
          </main>

          <aside className="space-y-6">
            <div className={`${glassSection} p-6 sm:p-8`}>
              <h3 className="text-xl font-black text-gray-950 mb-6">Brief Snapshot</h3>
              <div className="space-y-5">
                {[
                  ["Boundary", formatLabel(brief.boundaryPref)],
                  ["Status", formatLabel(brief.propertyStatus)],
                  ["Purpose", formatLabel(brief.purpose)],
                  ["Payment", formatLabel(brief.paymentPlan)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-gray-200/50 pb-4 last:border-0 last:pb-0">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500">{label}</span>
                    <span className="text-right font-black capitalize text-gray-950 bg-white/60 px-3 py-1 rounded-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gray-950 p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.2),transparent_50%)]" />
              <div className="relative">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" />
                  Trust & Safety
                </h3>
                <ul className="space-y-4 text-sm font-medium leading-relaxed text-gray-300">
                  <li className="flex gap-3"><div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> Always verify physical property documents.</li>
                  <li className="flex gap-3"><div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> Do not wire money based on digital promises.</li>
                  <li className="flex gap-3"><div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> Prefer secure, scheduled visits with known agents.</li>
                </ul>
              </div>
            </div>

            <div className={`${glassSection} p-6 sm:p-8 border-emerald-200 bg-emerald-50/50`}>
              <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                <Clock3 size={15} />
                System Note
              </p>
              <p className="text-sm font-medium leading-relaxed text-gray-700">
                Briefs with clear budgets and explicit amenities typically receive pitches 3x faster than vague requirements.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
