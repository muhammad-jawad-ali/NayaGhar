import { Sparkles, ShieldCheck, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#f7f5ef] pt-32 pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] rounded-full bg-emerald-400/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-[150px] translate-y-1/4" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-xl">
            <Sparkles size={14} strokeWidth={2.5} />
            Our Mission
          </div>
          <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl mb-6">
            Flipping the Real Estate Script
          </h1>
          <p className="text-xl font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
            NayaGhar was built on a simple premise: buyers shouldn't have to hunt for properties. The properties should come to them.
          </p>
        </div>

        <div className="space-y-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 sm:p-12">
            <h2 className="text-3xl font-black text-gray-950 mb-6 flex items-center gap-3">
              <Target className="text-primary" size={28} />
              The Problem
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
              Traditional real estate platforms in Pakistan are cluttered with outdated listings, fake properties, and endless scrolling. Buyers waste weeks contacting agents only to find out the property was sold months ago.
            </p>
            <h2 className="text-3xl font-black text-gray-950 mb-6 mt-12 flex items-center gap-3">
              <ShieldCheck className="text-primary" size={28} />
              Our Solution
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              We engineered a **Demand-First Marketplace**. Instead of agents posting inventory, buyers post their requirements (Briefs). Verified agents review these briefs and pitch *only* available, relevant properties directly to the buyer's dashboard. It's efficient, private, and guarantees that every connection is meaningful.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-950 mb-3">For Buyers</h3>
              <p className="text-gray-600 font-medium">
                Post your exact requirements once. Sit back and let verified agents bring the best options directly to you.
              </p>
            </div>
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/40 shadow-xl shadow-emerald-900/[0.03] backdrop-blur-3xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-3">For Agents</h3>
              <p className="text-emerald-800/80 font-medium">
                Stop spending money on blind ads. Pitch your inventory directly to warm leads who are actively looking to buy or rent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
