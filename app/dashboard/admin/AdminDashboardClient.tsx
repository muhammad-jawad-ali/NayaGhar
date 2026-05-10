"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Download, 
  Activity, 
  ShieldCheck, 
  Trash2,
  Building2,
  Mail,
  MapPin,
  RefreshCw,
  Ban,
  Unlock
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

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

  const handleDeleteBid = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this bid? This cannot be undone.")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bids/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchStats(); // Refresh
      } else {
        alert("Failed to delete bid.");
      }
    } catch (err) {
      console.error("Error deleting bid:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateBidStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bids/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchStats(); // Refresh
      } else {
        alert("Failed to update bid status.");
      }
    } catch (err) {
      console.error("Error updating bid:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    const action = isBlocked ? "block" : "unblock";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/block`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked })
      });
      if (res.ok) {
        fetchStats();
      } else {
        const errorData = await res.json();
        alert(errorData.error || `Failed to ${action} user.`);
      }
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-gray-500 font-medium">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  const glassCard = "relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_40%,rgba(255,255,255,0.2))] before:opacity-80";

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#111827] pb-20 relative overflow-x-hidden">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full bg-emerald-400/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-blue-400/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm backdrop-blur-xl mb-4">
              <ShieldCheck size={14} className="text-primary" />
              Admin Privileges Active
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
              Command Center
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm backdrop-blur-xl">
              <Activity size={16} className="text-emerald-500" />
              <span className="text-sm font-bold text-gray-700">All Systems Operational</span>
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-gray-950 hover:bg-primary text-white text-sm font-black rounded-xl transition-all shadow-md hover:-translate-y-0.5"
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`${glassCard} group`}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Total Users</p>
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
            </div>
            <p className="text-6xl font-black text-gray-950">{data?.stats?.users || 0}</p>
          </div>

          <div className={`${glassCard} group`}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Active Requirements</p>
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
            </div>
            <p className="text-6xl font-black text-gray-950">{data?.stats?.briefs || 0}</p>
          </div>

          <div className={`${glassCard} group`}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Total Bids Pitched</p>
              <div className="p-3 rounded-full bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-6xl font-black text-gray-950">{data?.stats?.bids || 0}</p>
          </div>
        </div>

        {/* Admin Insights Charts */}
        <div className="mb-16">
          <div className="flex items-center justify-between border-b-2 border-gray-950 pb-4 mb-8">
            <h2 className="text-2xl font-black text-gray-950">Market Insights</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-white/40 px-3 py-1.5 rounded-lg border border-white/60">
              <MapPin size={16} className="text-primary" />
              Top Demand Regions
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${glassCard} flex flex-col items-center justify-center min-h-[350px]`}>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 w-full text-center">Buyer Demand Share</h3>
              {data?.areaInsights?.length > 0 ? (
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.areaInsights}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {data.areaInsights.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                        itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 font-medium">No area data available yet.</p>
              )}
            </div>

            <div className={`${glassCard} flex flex-col items-center justify-center min-h-[350px]`}>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 w-full text-center">Volume by Area</h3>
              {data?.areaInsights?.length > 0 ? (
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.areaInsights} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 font-medium">No area data available yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Users List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-gray-950 pb-4">
              <h2 className="text-2xl font-black text-gray-950">Recent Registrations</h2>
            </div>
            
            <div className="space-y-4">
              {data?.latestUsers?.map((user: any) => (
                <div key={user._id} className={`group relative overflow-hidden rounded-2xl border ${user.isBlocked ? 'border-rose-200 bg-rose-50/50' : 'border-white/60 bg-white/40'} p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60 hover:shadow-md`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border ${user.isBlocked ? 'bg-rose-100 border-rose-200 text-rose-500' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                        <span className="font-black text-lg">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-lg font-black truncate ${user.isBlocked ? 'text-rose-900 line-through opacity-70' : 'text-gray-950'}`}>
                            {user.name}
                          </p>
                          {user.isBlocked && <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full">Blocked</span>}
                        </div>
                        <p className={`text-sm font-medium flex items-center gap-1.5 mt-0.5 truncate ${user.isBlocked ? 'text-rose-400' : 'text-gray-500'}`}>
                          <Mail size={12} className="shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`hidden sm:inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${
                        user.role === 'admin' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                        user.role === 'agent' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                        'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(user._id, !user.isBlocked)}
                          disabled={updatingId === user._id}
                          className={`p-2 rounded-xl border transition-all ${
                            user.isBlocked 
                              ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' 
                              : 'text-gray-400 bg-white hover:text-rose-500 hover:bg-rose-50 border-gray-200 hover:border-rose-200'
                          }`}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {updatingId === user._id ? (
                            <RefreshCw size={18} className="animate-spin opacity-50" />
                          ) : user.isBlocked ? (
                            <Unlock size={18} />
                          ) : (
                            <Ban size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Bids Management */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-gray-950 pb-4">
              <h2 className="text-2xl font-black text-gray-950">Bid Management</h2>
            </div>
            
            <div className="space-y-4">
              {data?.latestBids?.length > 0 ? data.latestBids.map((bid: any) => (
                <div key={bid._id} className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60 hover:shadow-md">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-400">By {bid.agentName}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-950 truncate" title={bid.propertyTitle}>
                          {bid.propertyTitle}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="font-black text-primary">PKR {bid.price?.toLocaleString()}</span>
                          <span className="text-gray-300">|</span>
                          <span className="font-bold text-gray-500 capitalize flex items-center gap-1">
                            <Building2 size={14} />
                            {bid.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBid(bid._id)}
                        disabled={updatingId === bid._id}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all shrink-0"
                        title="Delete Bid"
                      >
                        {updatingId === bid._id ? (
                          <RefreshCw size={18} className="animate-spin text-gray-400" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    {/* Admin Status Override */}
                    <div className="pt-3 border-t border-gray-200/50 flex items-center justify-between gap-4 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Status Override</span>
                      <select
                        value={bid.status}
                        onChange={(e) => handleUpdateBidStatus(bid._id, e.target.value)}
                        disabled={updatingId === bid._id}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:ring-0 ${
                          bid.status === 'accepted' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                          bid.status === 'rejected' ? 'border-rose-200 bg-rose-50 text-rose-700' :
                          'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500 font-medium bg-white/40 border border-white/60 rounded-2xl">
                  No bids have been submitted yet.
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
