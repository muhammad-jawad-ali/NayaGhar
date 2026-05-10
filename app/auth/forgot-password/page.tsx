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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] p-6">
      <div className="max-w-md w-full animate-in fade-in duration-700">
        <div className="glass-container p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Forgot Password?</h1>
            <p className="text-slate-400">No worries! Enter your email and we'll send you a secure link to reset your password.</p>
          </div>

          {message ? (
            <div className="success-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-400 font-medium mb-6">{message}</p>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300 block ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending link...
                  </span>
                ) : "Send Reset Link"}
              </button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-slate-500 hover:text-white text-sm transition-colors">
                  Remember your password? <span className="text-blue-500 font-medium">Log in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .glass-container {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .success-card {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </main>
  );
}
