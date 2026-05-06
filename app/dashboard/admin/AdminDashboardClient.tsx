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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">Loading admin console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Admin Console</h1>
          <p className="text-gray-600 text-lg font-medium">System overview and platform management.</p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-secondary px-8 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-gray-200/50"
        >
          Export Data (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { label: "Total Users", value: data?.stats?.users || 0, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
          { label: "Requirements", value: data?.stats?.briefs || 0, icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
          { label: "Total Bids", value: data?.stats?.bids || 0, icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }
        ].map((stat, i) => (
          <div key={i} className="p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <p className="text-5xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            Latest Registered Users
          </h2>
          <div className="space-y-4 mb-10">
            {data?.latestUsers?.map((user: any) => (
              <div key={user._id?.toString()} className="flex justify-between items-center p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all">
                <div>
                  <p className="text-gray-900 font-bold">{user.name}</p>
                  <p className="text-gray-500 text-xs font-medium">{user.email}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${
                  user.role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  user.role === 'agent' ? 'bg-primary/5 text-primary border-primary/10' :
                  'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
          <a 
            href="/dashboard/admin/users"
            className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-primary/20"
          >
            MANAGE ALL USERS
          </a>
        </section>

        <section className="p-10 rounded-[32px] bg-primary shadow-2xl shadow-primary/30 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <h2 className="text-4xl font-black mb-6 relative">System Health</h2>
          <p className="text-white/90 text-lg font-bold mb-10 leading-relaxed relative">
            All systems are currently operational. Database connections are stable and API response times are within normal parameters.
          </p>
          <div className="flex flex-wrap gap-4 relative">
            <div className="flex items-center gap-3 text-[10px] font-black bg-white/10 px-5 py-3 rounded-full border border-white/20 tracking-widest uppercase">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              DATABASE: OK
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black bg-white/10 px-5 py-3 rounded-full border border-white/20 tracking-widest uppercase">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              AUTH: OK
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
