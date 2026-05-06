"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/briefs/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBriefs(prev => prev.map(b => b._id!.toString() === id ? { ...b, status: newStatus as "open" | "closed" | "fulfilled" } : b));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update brief status");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Buyer Dashboard</h1>
          <p className="text-gray-600 text-lg font-medium">Manage your requirements and review agent bids.</p>
        </div>
        {briefs.filter(b => b.status === "open").length >= 3 ? (
          <div className="flex flex-col items-end">
            <button 
              disabled
              className="btn-primary btn-xl shadow-lg shadow-primary/20 opacity-50 cursor-not-allowed"
            >
              POST NEW REQUIREMENT
            </button>
            <span className="text-xs text-rose-500 font-bold mt-2">Maximum 3 active requirements allowed.</span>
          </div>
        ) : (
          <Link 
            href="/briefs/new"
            className="btn-primary btn-xl shadow-lg shadow-primary/20"
          >
            POST NEW REQUIREMENT
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              My Requirements
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase">
                {briefs.length}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => <div key={i} className="h-48 rounded-3xl bg-gray-50 animate-pulse" />)}
            </div>
          ) : briefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {briefs.map(brief => (
                <BriefCard key={brief._id?.toString()} brief={brief} onDelete={handleDeleteBrief} onStatusChange={handleStatusChange} />
              ))}
            </div>
          ) : (
            <div className="p-20 text-center rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              </div>
              <p className="text-gray-500 font-bold text-lg mb-2">You haven't posted any requirements yet.</p>
              <p className="text-gray-400 mb-8 font-medium">Post your first brief to start receiving property bids from verified agents.</p>
              <Link href="/briefs/new" className="text-primary font-black hover:underline flex items-center justify-center gap-2">
                Get started now
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-10">
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
                      n.type === 'bid_received' ? 'bg-emerald-500' : 'bg-amber-500'
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
            <h3 className="text-2xl font-black text-white mb-4 relative z-10">Need Help?</h3>
            <p className="text-white/90 text-sm mb-8 font-bold leading-relaxed relative z-10">Our real estate experts are here to help you find the perfect property matching your brief.</p>
            <button className="w-full py-4 bg-white text-primary font-black rounded-xl hover:bg-gray-50 transition-all shadow-xl relative z-10">
              CONTACT SUPPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
