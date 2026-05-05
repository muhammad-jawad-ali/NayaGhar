"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nayaghar_leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export leads.");
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading admin console...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Admin Console</h1>
          <p className="text-slate-400">System overview and platform management.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
        >
          Export Data (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Users</p>
          <p className="text-5xl font-black text-white">{data?.stats?.users || 0}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Requirements</p>
          <p className="text-5xl font-black text-white">{data?.stats?.briefs || 0}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Bids</p>
          <p className="text-5xl font-black text-white">{data?.stats?.bids || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Latest Registered Users</h2>
          <div className="space-y-4 mb-8">
            {data?.latestUsers?.map((user: any) => (
              <div key={user._id} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                  user.role === 'admin' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                  user.role === 'agent' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                  'border-slate-500/30 text-slate-400 bg-slate-500/5'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
          <a 
            href="/dashboard/admin/users"
            className="inline-block w-full text-center py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-sm uppercase tracking-widest"
          >
            Manage All Users
          </a>
        </section>

        <section className="p-8 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-4">System Health</h2>
          <p className="text-indigo-100 mb-8 opacity-80">All systems are currently operational. Database connections are stable and API response times are within normal parameters.</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DATABASE: OK
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTH: OK
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
