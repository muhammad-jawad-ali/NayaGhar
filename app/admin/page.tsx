import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
      <div className="flex justify-center gap-4 mt-8">
        <Link href="/admin/users" className="bg-blue-600 p-4 rounded-xl text-white font-bold">Manage Users</Link>
        <Link href="/admin/reports" className="bg-slate-800 p-4 rounded-xl text-white font-bold">Platform Reports</Link>
      </div>
    </div>
  );
}
