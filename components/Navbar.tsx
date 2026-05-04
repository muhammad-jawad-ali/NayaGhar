"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user as any;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-content">
        <Link href="/" className="logo">
          Naya<span>Ghar</span>
        </Link>

        <div className="nav-links">
          <Link href="/marketplace">Marketplace</Link>
          
          {status === "authenticated" ? (
            <>
              {user?.role === "admin" && (
                <Link href="/admin">Admin Panel</Link>
              )}
              {user?.role === "buyer" && (
                <>
                  <Link href="/dashboard/buyer">My Briefs</Link>
                  <Link href="/briefs/new" className="highlight">Post Brief</Link>
                </>
              )}
              {user?.role === "agent" && (
                <>
                  <Link href="/dashboard/agent">My Bids</Link>
                  <Link href="/bids/active">Active Leads</Link>
                </>
              )}
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                <button onClick={() => signOut()} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link href="/auth/login" className="login-link">Sign In</Link>
              <Link href="/auth/signup" className="signup-btn">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          padding: 0 5%;
          z-index: 1000;
          transition: all 0.3s ease;
          background: transparent;
        }

        .navbar.scrolled {
          height: 70px;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-content {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          text-decoration: none;
          letter-spacing: -1px;
        }

        .logo span {
          color: #3b82f6;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: white;
        }

        .highlight {
          color: #3b82f6 !ast;
        }

        .auth-btns {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .signup-btn {
          background: #3b82f6;
          color: white !important;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-weight: 600 !important;
          transition: all 0.3s !important;
        }

        .signup-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-left: 1rem;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-name {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </nav>
  );
}
