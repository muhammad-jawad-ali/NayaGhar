"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Bid, Brief, Notification } from "@/lib/types";

export default function AgentDashboard({ initialBids, initialBriefs, initialNotifications }: { initialBids: Bid[], initialBriefs: Brief[], initialNotifications: Notification[] }) {
  const { data: session } = useSession();
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs);
  const [notifications] = useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const handleDeleteBid = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this bid?")) return;
    try {
      const res = await fetch(`/api/bids/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBids(prev => prev.filter(b => b._id!.toString() !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to withdraw bid");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Agent Dashboard</h1>
          <p className="text-slate-400">Track your bids and discover new buyer requirements.</p>
        </div>
        <Link 
          href="/marketplace"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          FIND NEW LEADS
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              My Submitted Bids
              <span className="text-xs font-normal bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {bids.length} Total
              </span>
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 rounded-2xl bg-white/[0.03] animate-pulse" />)}
              </div>
            ) : bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map(bid => (
                  <div key={bid._id?.toString()} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {bid.propertyTitle}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                        bid.status === 'accepted' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                        bid.status === 'rejected' ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' :
                        'border-blue-500/30 text-blue-400 bg-blue-500/5'
                      }`}>
                        {bid.status}
                      </span>
                      {bid.status === 'pending' && (
                        <button 
                          onClick={() => handleDeleteBid(bid._id!.toString())}
                          className="ml-2 p-1 text-rose-500 hover:text-rose-400 transition-colors"
                          title="Withdraw Bid"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mb-4">{bid.area}, {bid.city} • PKR {bid.price.toLocaleString()}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Submitted on {new Date(bid.createdAt).toLocaleDateString()}</span>
                      <Link href={`/briefs/${bid.briefId}`} className="text-indigo-400 hover:text-indigo-300 font-bold">VIEW ORIGINAL BRIEF →</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                <p className="text-slate-500">You haven't submitted any bids yet.</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Hot New Leads</h2>
            <div className="space-y-4">
              {briefs.map(brief => (
                <div key={brief._id?.toString()} className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-1">{brief.category}</p>
                  <h4 className="text-white font-bold mb-1">{brief.areaSize} {brief.areaUnit} in {brief.area}</h4>
                  <p className="text-slate-500 text-xs mb-4">Budget: PKR {brief.budgetMax?.toLocaleString()}</p>
                  <Link 
                    href={`/bids/new?briefId=${brief._id}`}
                    className="block text-center py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    BID NOW
                  </Link>
                </div>
              ))}
              <Link href="/marketplace" className="block text-center text-slate-500 hover:text-white text-sm font-medium transition-colors pt-2">
                View all marketplace leads →
              </Link>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="space-y-6">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n._id!.toString()} className="flex gap-4">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        n.type === 'match' ? 'bg-indigo-500' : 
                        n.type === 'bid_accepted' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <Link href={n.link} className="text-sm text-white font-medium hover:text-indigo-400 transition-colors block">
                          {n.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                        <p className="text-[10px] text-slate-600 mt-1 font-bold uppercase tracking-tighter">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-600 text-xs font-medium">
                    No recent activity found.
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <h3 className="text-white font-bold mb-4">Pro Tips for Agents</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">01.</span>
                <span>Complete your profile to gain more trust from buyers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">02.</span>
                <span>Include high-quality images in your bids.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-bold">03.</span>
                <span>Respond quickly to new leads to stay ahead.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
