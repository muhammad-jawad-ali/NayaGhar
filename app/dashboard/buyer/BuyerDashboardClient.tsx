"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, ArrowRight, ShieldCheck, Zap, MessageSquare, Headphones, FileText, Activity, TrendingUp, BarChart3 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import type { Brief, Bid, Notification } from "@/lib/types";
import BriefCard from "@/components/BriefCard";

export default function BuyerDashboard({ initialBriefs, initialNotifications }: { initialBriefs: Brief[], initialNotifications: Notification[] }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs);
  const [notifications] = useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const handleDeleteBrief = async (id: string) => {
    try {
      const res = await fetch(`/api/briefs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBriefs(prev => prev.filter(b => b._id!.toString() !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete brief");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    }
  };

  const glassCard = "relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_40%,rgba(255,255,255,0.2))] before:opacity-80";

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#111827] pb-20 relative overflow-x-hidden">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full bg-emerald-400/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-blue-400/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm backdrop-blur-xl mb-4">
              <ShieldCheck size={14} className="text-primary" />
              Buyer Dashboard
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
              My Requirements
            </h1>
          </div>
          <Link 
            href="/briefs/new"
            className="flex items-center gap-2 px-6 py-3 bg-gray-950 hover:bg-primary text-white text-sm font-black rounded-xl transition-all shadow-md hover:-translate-y-0.5 group"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Post New Requirement
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Requirements Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-gray-950 pb-4 mb-6">
              <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                <FileText size={24} className="text-gray-400" />
                Active Briefs
              </h2>
              <span className="text-sm font-bold text-gray-500 bg-white/40 px-3 py-1 rounded-lg border border-white/60">
                {briefs.length} Total
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-64 rounded-[2rem] bg-white/40 backdrop-blur-3xl animate-pulse" />)}
              </div>
            ) : briefs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {briefs.map(brief => (
                  <BriefCard key={brief._id?.toString()} brief={brief} onDelete={handleDeleteBrief} />
                ))}
              </div>
            ) : (
              <div className={`${glassCard} flex flex-col items-center justify-center text-center py-16`}>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
                  <FileText size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-950 mb-2">No Requirements Yet</h3>
                <p className="text-gray-500 font-medium mb-6 max-w-sm">
                  Start receiving bids from top agents by posting your first property requirement.
                </p>
                <Link href="/briefs/new" className="text-primary font-black hover:underline flex items-center gap-1">
                  Post Requirement <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Activity Feed */}
            <section>
              <div className="flex items-center justify-between border-b-2 border-gray-950 pb-4 mb-6">
                <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                  <Activity size={24} className="text-gray-400" />
                  Recent Activity
                </h2>
              </div>
              
              <div className={`${glassCard} !p-6`}>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((n) => (
                      <div key={n._id!.toString()} className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                            n.type === 'match' ? 'bg-indigo-50 text-indigo-500 border-indigo-100' : 
                            n.type === 'bid_received' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'
                          }`}>
                            {n.type === 'match' ? <Zap size={18} /> : 
                             n.type === 'bid_received' ? <FileText size={18} /> : <MessageSquare size={18} />}
                          </div>
                          <div>
                            <Link href={n.link} className="text-sm font-black text-gray-950 hover:text-primary transition-colors block">
                              {n.title}
                            </Link>
                            <p className="text-xs font-medium text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">
                              {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 font-medium border border-dashed border-gray-200 rounded-2xl">
                      No recent activity.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Market Momentum Widget */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gray-950 p-8 shadow-2xl text-white group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <BarChart3 size={24} className="text-emerald-400" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/30">
                    <TrendingUp size={12} strokeWidth={3} />
                    High Leverage
                  </span>
                </div>
                
                <h3 className="text-2xl font-black mb-1">Market Momentum</h3>
                <p className="text-gray-400 text-sm mb-6 font-medium">
                  Your requirements are currently receiving 24% more bids than the platform average. Agents are highly active in your targeted areas.
                </p>

                <div className="h-24 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { day: 'Mon', bids: 2 },
                      { day: 'Tue', bids: 3 },
                      { day: 'Wed', bids: 1 },
                      { day: 'Thu', bids: 5 },
                      { day: 'Fri', bids: 8 },
                      { day: 'Sat', bids: 12 },
                      { day: 'Sun', bids: 15 }
                    ]}>
                      <defs>
                        <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#34d399' }}
                        cursor={false}
                      />
                      <Area type="monotone" dataKey="bids" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorBids)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Avg Bid Value</p>
                    <p className="text-lg font-black text-white">~35M PKR</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Response Time</p>
                    <p className="text-lg font-black text-emerald-400">1.2 Hours</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
