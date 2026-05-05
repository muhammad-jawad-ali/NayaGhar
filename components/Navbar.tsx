"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Settings,
  User as UserIcon,
  Home
} from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user as any;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex ${mobile ? "flex-col gap-4" : "items-center gap-2"}`}>
      <Link 
        href="/marketplace" 
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-white/5 ${mobile ? "text-lg py-4 border-b border-white/5" : "text-sm text-slate-400 hover:text-white"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Search size={mobile ? 20 : 18} />
        Marketplace
      </Link>
      
      {status === "authenticated" ? (
        <>
          {user?.role === "admin" && (
            <Link 
              href="/dashboard/admin" 
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-white/5 ${mobile ? "text-lg py-4 border-b border-white/5" : "text-sm text-slate-400 hover:text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings size={mobile ? 20 : 18} />
              Admin Panel
            </Link>
          )}
          {user?.role === "buyer" && (
            <>
              <Link 
                href="/dashboard/buyer" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-white/5 ${mobile ? "text-lg py-4 border-b border-white/5" : "text-sm text-slate-400 hover:text-white"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={mobile ? 20 : 18} />
                Requirements
              </Link>
              <Link 
                href="/briefs/new" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white ${mobile ? "text-lg py-4" : "text-sm"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={mobile ? 20 : 18} />
                Post Brief
              </Link>
            </>
          )}
          {user?.role === "agent" && (
            <>
              <Link 
                href="/dashboard/agent" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-white/5 ${mobile ? "text-lg py-4 border-b border-white/5" : "text-sm text-slate-400 hover:text-white"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={mobile ? 20 : 18} />
                Dashboard
              </Link>
              <Link 
                href="/marketplace" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white ${mobile ? "text-lg py-4" : "text-sm"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={mobile ? 20 : 18} />
                Browse Leads
              </Link>
            </>
          )}
          <div className={`flex items-center gap-4 ${mobile ? "mt-4 pt-4 border-t border-white/10" : "ml-4"}`}>
            <NotificationBell userId={user.id} />
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {!mobile && (
                <div className="flex flex-col leading-none">
                  <span className="text-white font-bold text-[11px]">{user.name}</span>
                  <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">{user.role}</span>
                </div>
              )}
              <button 
                onClick={() => signOut()} 
                className="p-1.5 rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className={`flex items-center ${mobile ? "flex-col gap-4 mt-4" : "gap-6 ml-4"}`}>
          <Link 
            href="/auth/login" 
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="btn-primary !px-5 !py-2.5 !text-sm flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Get Started</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
      scrolled 
        ? "h-16 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50" 
        : "h-20 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter text-white">
            Naya<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">Ghar</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavLinks />
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="lg:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-colors" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 w-80 h-full bg-background border-l border-white/5 z-[999] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="p-6 pt-24">
          <NavLinks mobile />
        </div>
      </div>
    </nav>
  );
}



