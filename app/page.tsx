"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const cityBriefs = [
  "DHA Lahore",
  "Clifton Karachi",
  "F-11 Islamabad",
  "Bahria Rawalpindi",
];

const liveBriefs = [
  {
    title: "10 marla house",
    meta: "DHA Phase 6, Lahore",
    budget: "PKR 65M - 85M",
    bids: "2 fresh bids",
  },
  {
    title: "3 bed apartment",
    meta: "Clifton Block 8, Karachi",
    budget: "PKR 180K - 260K",
    bids: "1 verified pitch",
  },
  {
    title: "Commercial unit",
    meta: "Bahria Town, Rawalpindi",
    budget: "PKR 25M - 36M",
    bids: "open lead",
  },
];

const proof = [
  { label: "Buyer control", value: "Brief-first", icon: Sparkles },
  { label: "Agent response", value: "Live bids", icon: BellRing },
  { label: "Trust layer", value: "Role gated", icon: ShieldCheck },
  { label: "Decision speed", value: "Shortlists", icon: TrendingUp },
];

const steps = [
  {
    title: "Post the vibe",
    copy: "City, society, budget, area, amenities, timeline. One brief replaces hours of scrolling.",
    icon: MessageSquareText,
  },
  {
    title: "Let agents compete",
    copy: "Agents pitch properties that match your actual requirement, not stale catalogue noise.",
    icon: Building2,
  },
  {
    title: "Compare calmly",
    copy: "Review price, location, specs, and availability in one clean decision space.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  const glassPanel =
    "relative overflow-hidden border border-white/60 bg-white/10 shadow-2xl shadow-black/[0.04] backdrop-blur-[40px] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.6),transparent_40%,rgba(255,255,255,0.1))] before:opacity-80";
  const glassChip =
    "border border-white/40 bg-white/20 text-white shadow-lg shadow-black/[0.03] backdrop-blur-3xl";
  const darkGlassCard =
    "relative overflow-hidden rounded-[2rem] border border-white/20 bg-gray-950/40 p-5 shadow-xl shadow-black/30 backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.1),transparent_36%),linear-gradient(120deg,rgba(255,255,255,0.05),transparent_44%)] before:opacity-90";
  const liquidGlass = "relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_40%,rgba(255,255,255,0.2))] before:opacity-80 transition-all hover:bg-white/50";

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#111827]">
      <section className="relative min-h-[86vh] overflow-hidden bg-gray-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20" />
        <div className="absolute inset-y-0 right-0 w-[48%] bg-gradient-to-l from-gray-950/80 via-gray-950/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-gray-950/80 via-gray-950/40 to-transparent" />
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.15),transparent_24%),radial-gradient(circle_at_78%_28%,rgba(16,185,129,0.2),transparent_22%),radial-gradient(circle_at_58%_80%,rgba(59,130,246,0.1),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7f5ef] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
          <div className="grid min-h-[calc(86vh-9rem)] grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">
            <div className="pb-8 lg:pb-16 text-white">
              <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider ${glassChip}`}>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Demand-first real estate
              </div>

              <h1 className="mt-8 max-w-4xl text-6xl sm:text-7xl lg:text-[6rem] font-black leading-[0.95] tracking-tight">
                NayaGhar
              </h1>
              <p className="mt-6 max-w-2xl text-xl sm:text-2xl leading-relaxed text-white/80 font-medium">
                Post exactly what you want. Let verified agents bring the best homes directly to you.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/briefs/new"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-5 text-sm font-black text-gray-950 transition-all hover:bg-emerald-50 hover:text-emerald-700 hover:-translate-y-1 group shadow-xl shadow-white/10"
                >
                  Draft a Brief
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/marketplace"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-5 text-sm font-black transition-all hover:bg-white/30 hover:-translate-y-1 ${glassChip}`}
                >
                  Browse Market
                  <Search size={18} />
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                {cityBriefs.map((city) => (
                  <span
                    key={city}
                    className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide ${glassChip}`}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div className={`z-10 rounded-[2.5rem] p-6 ${glassPanel}`}>
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
              <div className="absolute -left-10 bottom-20 h-56 w-56 rounded-full bg-emerald-400/20 blur-[80px]" />
              
              <div className="relative rounded-[2rem] border border-white/20 bg-gray-950/60 p-6 text-white shadow-2xl backdrop-blur-3xl">
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Buyer brief</p>
                      <h2 className="mt-1 text-3xl font-black">DHA Lahore</h2>
                    </div>
                    <div className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-1.5 text-xs font-black text-emerald-300 shadow-lg shadow-emerald-900/20">
                      Open
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner backdrop-blur-3xl">
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Budget</p>
                      <p className="mt-1 font-black text-lg">PKR 65M - 85M</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner backdrop-blur-3xl">
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Size</p>
                      <p className="mt-1 font-black text-lg">10 marla</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {liveBriefs.map((brief, index) => (
                  <div
                    key={brief.title}
                    className={index === 2 ? `relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(115deg,rgba(255,255,255,0.9),transparent_42%,rgba(255,255,255,0.4))] before:opacity-80 scale-[1.02] transform -translate-y-1` : darkGlassCard}
                  >
                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <h3 className={index === 2 ? "font-black text-gray-950 text-lg" : "font-black text-white text-lg"}>{brief.title}</h3>
                        <p className={index === 2 ? "mt-1 flex items-center gap-1.5 text-sm font-bold text-gray-500" : "mt-1 flex items-center gap-1.5 text-sm font-bold text-white/60"}>
                          <MapPin size={14} />
                          {brief.meta}
                        </p>
                      </div>
                      <BadgeCheck className={index === 2 ? "text-emerald-500" : "text-emerald-400"} size={22} />
                    </div>
                    <div className="relative mt-5 flex items-center justify-between gap-3">
                      <span className={index === 2 ? "text-sm font-black text-emerald-600" : "text-sm font-black text-emerald-300"}>{brief.budget}</span>
                      <span className={index === 2 ? "rounded-full bg-gray-950 px-4 py-1.5 text-xs font-black text-white" : "rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-black text-white/80"}>
                        {brief.bids}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {proof.map((item) => (
              <div key={item.label} className={liquidGlass}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg shadow-gray-900/10 mb-4">
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <p className="text-3xl font-black text-gray-950 tracking-tight">{item.value}</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32 relative">
        <div className="absolute right-0 top-1/2 w-[800px] h-[800px] rounded-full bg-emerald-400/5 blur-[150px] -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">The NayaGhar Advantage</p>
              <h2 className="text-5xl sm:text-6xl font-black leading-[1.05] text-gray-950 tracking-tight">
                A cleaner road from brief to shortlist.
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-gray-600 font-medium">
                We turn property hunting into a guided, demand-first path: post once, receive relevant pitches, compare calmly, and move forward with absolute confidence.
              </p>
              <Link
                href="/marketplace"
                className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-8 py-5 text-sm font-black text-white transition-all hover:bg-emerald-600 hover:-translate-y-1 shadow-xl shadow-gray-900/15 group"
              >
                See Active Briefs
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className={`${liquidGlass} !p-8 sm:!p-10 !rounded-[3rem]`}>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-gray-950/5 pb-6">
                <div className="w-fit rounded-full bg-emerald-100/50 border border-emerald-200 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-800 shadow-sm">
                  Your home-finding route
                </div>
                <div className="w-fit rounded-full bg-gray-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  Shortlist Ready
                </div>
              </div>

              <div className="relative space-y-6">
                <div className="absolute bottom-8 left-8 top-8 hidden w-0.5 rounded-full bg-emerald-500/20 sm:block" />
                {steps.map((step, index) => (
                  <div key={step.title} className="relative sm:pl-20 group">
                    <div className="absolute left-4 top-8 z-20 hidden h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-lg shadow-emerald-500/30 sm:flex transition-transform group-hover:scale-110">
                      {index + 1}
                    </div>
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-md backdrop-blur-2xl transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-md">
                          <step.icon size={24} strokeWidth={2} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                              Phase 0{index + 1}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-950 tracking-tight">{step.title}</h3>
                          <p className="mt-2 text-base leading-relaxed font-medium text-gray-500">{step.copy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto">
        <div className="relative overflow-hidden rounded-[3rem] bg-gray-950 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.15),transparent_40%),radial-gradient(circle_at_75%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative p-10 sm:p-16 lg:p-20 flex flex-col justify-center">
              <div className={`w-fit inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider ${glassChip}`}>
                <Clock3 size={16} />
                Built for faster decisions
              </div>
              <h2 className="mt-8 text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight">
                The deal room starts before the call.
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-white/70 font-medium max-w-lg">
                Buyers see comparable bids in context. Agents know exactly what to pitch. No mystery listings, no dead links, no cold starts.
              </p>
              <div className="mt-10">
                <Link
                  href="/briefs/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-5 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-1 group"
                >
                  Start with a Brief
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[400px] lg:min-h-full bg-cover bg-center" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85')",
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 to-gray-950/20" />
              <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-white/20 bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Next best move</p>
                <p className="mt-2 text-3xl font-black tracking-tight">Review 3 matching pitches</p>
                <p className="mt-2 text-base font-medium text-white/70">Shortlisted by budget, location, and availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
