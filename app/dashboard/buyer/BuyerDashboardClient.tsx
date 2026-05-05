"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Brief, Bid, Notification } from "@/lib/types";
import BriefCard from "@/components/BriefCard";

export default function BuyerDashboard({ initialBriefs, initialNotifications }: { initialBriefs: Brief[], initialNotifications: Notification[] }) {
  const { data: session } = useSession();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Buyer Dashboard</h1>
          <p className="text-slate-400">Manage your requirements and review agent bids.</p>
        </div>
        <Link 
          href="/briefs/new"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          POST NEW REQUIREMENT
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">My Requirements</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-40 rounded-2xl bg-white/[0.03] animate-pulse" />)}
            </div>
          ) : briefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {briefs.map(brief => (
                <BriefCard key={brief._id} brief={brief} onDelete={handleDeleteBrief} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <p className="text-slate-500 mb-6">You haven't posted any requirements yet.</p>
              <Link href="/briefs/new" className="text-indigo-400 font-bold hover:underline">Get started now →</Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <div className="space-y-6">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id!.toString()} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      n.type === 'match' ? 'bg-indigo-500' : 
                      n.type === 'bid_received' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <Link href={n.link} className="text-sm text-white font-medium hover:text-indigo-400 transition-colors block">
                        {n.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                      <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">
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

          <div className="p-8 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-indigo-100 text-sm mb-6 opacity-80">Our real estate experts are here to help you find the perfect property matching your brief.</p>
            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              CONTACT SUPPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
