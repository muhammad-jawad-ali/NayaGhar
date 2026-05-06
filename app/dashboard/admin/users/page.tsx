"use client";

import { useEffect, useState } from "react";

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

  const fetchUsers = async () => {
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">User Management</h1>
          <p className="text-slate-400">View and manage all registered platform users.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] border-b border-white/5">
            <tr>
              <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
              <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-10">
                    <div className="h-4 bg-white/5 rounded-full w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded-full w-1/2 opacity-50" />
                  </td>
                </tr>
              ))
            ) : users.map(user => (
              <tr key={user._id?.toString()} className="hover:bg-white/[0.01] transition-all group">
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
                  {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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
          <div className="p-20 text-center text-slate-500">
            No users found in the system.
          </div>
        )}
      </div>
    </div>
  );
}

