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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{type === "login" ? "Welcome Back" : "Join NayaGhar"}</h1>
          <p>
            {type === "login"
              ? "Access your demand-first real estate dashboard"
              : "Start posting briefs or bidding on properties"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          {type === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {type === "signup" && (
            <div className="form-group">
              <label htmlFor="role">I am a...</label>
              <select id="role" name="role" required>
                <option value="buyer">Buyer (I want to buy)</option>
                <option value="agent">Agent/Seller (I have properties)</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Processing..." : type === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          {type === "login" ? (
            <p>
              Don't have an account?{" "}
              <Link href="/auth/signup">Sign up for free</Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href="/auth/login">Sign in here</Link>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .auth-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #94a3b8;
          font-size: 1rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          text-align: center;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #e2e8f0;
          font-size: 0.9rem;
          font-weight: 500;
          margin-left: 0.25rem;
        }

        .form-group input, .form-group select {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .auth-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .auth-footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
