"use client";

import { getAllUsers } from "@/lib/actions/admin";
import UserList from "./UserList";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="admin-container p-8">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-400">Manage your platform's buyers and agents.</p>
      </div>
      
      <UserList initialUsers={users} />

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
