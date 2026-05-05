"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user as any;

  const NavLinks = () => (
    <>
      <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
      
      {status === "authenticated" ? (
        <>
          {user?.role === "admin" && (
            <Link href="/dashboard/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
          )}
          {user?.role === "buyer" && (
            <>
              <Link href="/dashboard/buyer" onClick={() => setMobileMenuOpen(false)}>My Briefs</Link>
              <Link href="/briefs/new" className="highlight" onClick={() => setMobileMenuOpen(false)}>Post Brief</Link>
            </>
          )}
          {user?.role === "agent" && (
            <>
              <Link href="/dashboard/agent" onClick={() => setMobileMenuOpen(false)}>My Bids</Link>
              <Link href="/bids/active" onClick={() => setMobileMenuOpen(false)}>Active Leads</Link>
            </>
          )}
          <div className="flex items-center gap-4">
            <NotificationBell userId={user.id} />
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="auth-btns">
          <Link href="/auth/login" className="login-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          <Link href="/auth/signup" className="signup-btn" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
        </div>
      )}
    </>
  );

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}>
      <div className="nav-content">
        <Link href="/" className="logo">
          Naya<span>Ghar</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <NavLinks />
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-links">
          <NavLinks />
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
          z-index: 1001;
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
          color: #3b82f6 !important;
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

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }

        .hamburger {
          width: 30px;
          height: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background: white;
          border-radius: 10px;
          transition: all 0.3s ease-in-out;
        }

        .hamburger.active span:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #020617;
          z-index: 1000;
          padding: 100px 5% 40px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .desktop-only {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .mobile-menu {
            display: block;
          }
          .mobile-links a {
            font-size: 1.5rem;
            color: #94a3b8;
            text-decoration: none;
            font-weight: 700;
          }
          .mobile-links .auth-btns {
            flex-direction: column;
            width: 100%;
            margin-top: 2rem;
          }
          .mobile-links .signup-btn {
            width: 100%;
            text-align: center;
          }
          .mobile-links .user-menu {
            flex-direction: column;
            border: none;
            padding: 0;
            margin-top: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}

