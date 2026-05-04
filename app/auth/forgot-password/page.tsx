"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/actions/password";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);
    setMessage(res.message);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
      <div className="auth-card max-w-md w-full">
        <div className="auth-header text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email and we'll send you a link to get back into your account.</p>
        </div>

        {message ? (
          <div className="success-message p-6 bg-blue-900/20 border border-blue-500/20 rounded-2xl text-blue-400 text-center">
            {message}
            <div className="mt-4">
              <Link href="/auth/login" className="text-blue-500 hover:underline">Back to Login</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-direction-column gap-6">
            <div className="form-group flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="name@example.com"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <Link href="/auth/login" className="text-slate-400 hover:text-white text-sm">Back to Login</Link>
            </div>
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
