"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/actions/password";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("token", token || "");

    const res = await resetPassword(formData);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
        <div className="auth-card text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
          <p className="text-slate-400 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">Request a new link</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
      <div className="auth-card max-w-md w-full">
        <div className="auth-header text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">New Password</h1>
          <p className="text-slate-400">Please enter your new password below.</p>
        </div>

        {success ? (
          <div className="success-message p-6 bg-green-900/20 border border-green-500/20 rounded-2xl text-green-400 text-center">
            Password reset successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">{error}</div>}
            
            <div className="form-group flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .auth-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
        }
      `}</style>
    </main>
  );
}
