"use client";

import React, { useState } from "react";
import { signUp } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (type === "signup") {
      const res = await signUp(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Automatically login after signup
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setError("Signup successful, but failed to login automatically.");
          setLoading(false);
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } else {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4 sm:p-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 w-full max-w-[480px] shadow-2xl shadow-gray-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {type === "login" ? "Welcome Back" : "Join NayaGhar"}
          </h1>
          <p className="text-gray-600 font-medium">
            {type === "login"
              ? "Access your demand-first real estate dashboard"
              : "Start posting briefs or bidding on properties"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          {type === "signup" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              required
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {type === "signup" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-bold text-gray-700 ml-1">I am a...</label>
              <select 
                id="role" 
                name="role" 
                required
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="buyer">Buyer (I want to buy)</option>
                <option value="agent">Agent/Seller (I have properties)</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : type === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-10 text-center text-gray-600 font-medium">
          {type === "login" ? (
            <p>
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-bold">Sign up for free</Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-bold">Sign in here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
