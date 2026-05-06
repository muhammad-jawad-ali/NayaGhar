"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
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
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-10 py-10">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3" />
                      <div className="h-3 bg-gray-50 rounded-full w-1/2" />
                    </td>
                  </tr>
                ))
              ) : users.map(user => (
                <tr key={user._id?.toString()} className="hover:bg-gray-50 transition-all group">
                  <td className="px-10 py-8 font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {user.name}
                  </td>
                  <td className="px-10 py-8 text-gray-500 font-medium">
                    {user.email}
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      user.role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      user.role === 'agent' ? 'bg-primary/5 text-primary border-primary/10' :
                      'bg-white text-gray-500 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-gray-400 text-sm font-medium">
                    {mounted ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '...'}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => handleRoleChange(user._id, user.role)}
                      disabled={updating === user._id}
                      className="btn-secondary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      {updating === user._id ? "Updating..." : "Cycle Role"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

