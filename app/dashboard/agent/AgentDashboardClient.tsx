"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Bid, Brief, Notification } from "@/lib/types";

export default function AgentDashboard({ initialBids, initialBriefs, initialNotifications }: { initialBids: Bid[], initialBriefs: Brief[], initialNotifications: Notification[] }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Agent Dashboard</h1>
          <p className="text-gray-600 text-lg font-medium">Track your bids and discover new buyer requirements.</p>
        </div>
        <Link 
          href="/marketplace"
          className="btn-primary btn-xl shadow-lg shadow-primary/20"
        >
          FIND NEW LEADS
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                My Submitted Bids
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase">
                  {bids.length}
                </span>
              </h2>
            </div>
            
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map(i => <div key={i} className="h-32 rounded-3xl bg-gray-50 animate-pulse" />)}
              </div>
            ) : bids.length > 0 ? (
              <div className="space-y-6">
                {bids.map(bid => (
                  <div key={bid._id?.toString()} className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                          {bid.propertyTitle}
                        </h3>
                        <p className="text-gray-500 font-bold text-sm flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {bid.area}, {bid.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border shadow-sm ${
                          bid.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          bid.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {bid.status}
                        </span>
                        {bid.status === 'pending' && (
                          <button 
                            onClick={() => handleDeleteBid(bid._id!.toString())}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Withdraw Bid"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-100 gap-4 relative z-10">
                      <div>
                        <p className="text-2xl font-black text-primary">PKR {bid.price.toLocaleString()}</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                          Submitted {mounted ? new Date(bid.createdAt).toLocaleDateString() : '...'}
                        </p>
                      </div>
                      <Link 
                        href={`/briefs/${bid.briefId}`} 
                        className="btn-secondary px-6 py-2.5 text-xs font-black uppercase tracking-widest"
                      >
                        Original Brief
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50">
                <p className="text-gray-500 font-bold text-lg">No bids submitted yet.</p>
                <p className="text-gray-400 text-sm mt-1">Head to the marketplace to find matching requirements.</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-10">
          <section className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </span>
              Hot New Leads
            </h2>
            <div className="space-y-5">
              {briefs.slice(0, 3).map(brief => (
                <div key={brief._id?.toString()} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                      {brief.category}
                    </span>
                    <span className="text-primary font-black text-sm">PKR {brief.budgetMax?.toLocaleString()}</span>
                  </div>
                  <h4 className="text-gray-900 font-bold mb-4">{brief.areaSize} {brief.areaUnit} in {brief.area}</h4>
                  <Link 
                    href={`/bids/new?briefId=${brief._id}`}
                    className="btn-primary w-full py-3 text-xs font-bold"
                  >
                    SUBMIT A BID
                  </Link>
                </div>
              ))}
              <Link href="/marketplace" className="flex items-center justify-center gap-2 text-primary font-bold text-sm hover:underline pt-4">
                View All Marketplace Leads
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </section>

          <section className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </span>
              Recent Activity
            </h2>
            <div className="space-y-8">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id!.toString()} className="flex gap-4 group">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 shadow-sm ${
                      n.type === 'match' ? 'bg-primary' : 
                      n.type === 'bid_accepted' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <div className="flex-1">
                      <Link href={n.link} className="text-sm text-gray-900 font-bold hover:text-primary transition-colors block mb-1">
                        {n.title}
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">
                        {mounted ? new Date(n.createdAt).toLocaleDateString() : '...'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400 text-sm font-medium">
                  No recent activity found.
                </div>
              )}
            </div>
          </section>

          <div className="p-8 rounded-[32px] bg-primary shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
            <h3 className="text-xl font-black text-white mb-6 relative z-10">Pro Tips for Agents</h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-black">01</span>
                <span className="text-sm text-white/90 font-bold leading-relaxed">Complete your profile to gain more trust from buyers.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-black">02</span>
                <span className="text-sm text-white/90 font-bold leading-relaxed">Include high-quality images in your bids.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-black">03</span>
                <span className="text-sm text-white/90 font-bold leading-relaxed">Respond quickly to new leads to stay ahead.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
