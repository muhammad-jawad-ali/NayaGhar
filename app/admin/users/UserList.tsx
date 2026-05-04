"use client";

import { useState } from "react";
import { deleteUser, updateUserRole } from "@/lib/actions/admin";

export default function UserList({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    await updateUserRole(id, newRole);
    setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
  }

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select 
                  value={user.role} 
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="role-select"
                >
                  <option value="buyer">Buyer</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => handleDelete(user._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .users-table-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          color: white;
        }

        .users-table th {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.25rem 1.5rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .users-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.95rem;
        }

        .role-select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .delete-btn {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: opacity 0.2s;
        }

        .delete-btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
