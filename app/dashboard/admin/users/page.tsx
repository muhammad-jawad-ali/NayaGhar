"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchUsers = async () => {
    setMounted(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "buyer" ? "agent" : currentRole === "agent" ? "admin" : "buyer";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        alert("Failed to update user role");
      }
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Error updating role");
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} this account?`)) return;

    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isActive: !currentStatus }),
      });

      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      } else {
        const data = await res.json();
        alert(data.error || `Failed to ${action} user`);
      }
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      alert(`Error ${action}ing user`);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY DELETE this account? This action cannot be undone.")) return;

    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting user");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <Link 
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-8 group transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Console
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">User Management</h1>
            <p className="text-gray-600 text-lg font-medium">View and manage all registered platform users.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3" />
                      <div className="h-3 bg-gray-50 rounded-full w-1/2" />
                    </td>
                  </tr>
                ))
              ) : users.map(user => (
                <tr key={user._id?.toString()} className="hover:bg-gray-50 transition-all group">
                  <td className="px-8 py-8 font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {user.name}
                  </td>
                  <td className="px-8 py-8 text-gray-500 font-medium">
                    {user.email}
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      user.role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      user.role === 'agent' ? 'bg-primary/5 text-primary border-primary/10' :
                      'bg-white text-gray-500 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      user.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {user.isActive !== false ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-gray-400 text-sm font-medium">
                    {mounted ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '...'}
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleRoleChange(user._id, user.role)}
                        disabled={updating === user._id}
                        className="btn-secondary px-4 py-2 text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                        title="Cycle Role"
                      >
                        Role
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(user._id, user.isActive !== false)}
                        disabled={updating === user._id}
                        className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all disabled:opacity-50 ${
                          user.isActive !== false 
                            ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                        }`}
                      >
                        {user.isActive !== false ? "Deactivate" : "Activate"}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={updating === user._id}
                        className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : users.map(user => (
              <tr key={user._id} className="hover:bg-white/[0.01] transition-all group">
                <td className="px-8 py-6 font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {user.name}
                </td>
                <td className="px-8 py-6 text-slate-400 text-sm">
                  {user.email}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    user.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    user.role === 'agent' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-500 text-xs font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleRoleChange(user._id, user.role)}
                    disabled={updating === user._id}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[10px] text-white font-black uppercase tracking-widest rounded-lg border border-white/5 transition-all disabled:opacity-50"
                  >
                    {updating === user._id ? "Updating..." : "Cycle Role"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <p className="text-gray-500 font-bold text-xl">No users found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
