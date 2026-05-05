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
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-gray-100 ${mobile ? "text-lg py-4 border-b border-gray-100" : "text-sm text-gray-600 hover:text-primary"}`}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-gray-100 ${mobile ? "text-lg py-4 border-b border-gray-100" : "text-sm text-gray-600 hover:text-primary"}`}
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-gray-100 ${mobile ? "text-lg py-4 border-b border-gray-100" : "text-sm text-gray-600 hover:text-primary"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={mobile ? 20 : 18} />
                Requirements
              </Link>
              <Link 
                href="/briefs/new" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white ${mobile ? "text-lg py-4" : "text-sm"}`}
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all hover:bg-gray-100 ${mobile ? "text-lg py-4 border-b border-gray-100" : "text-sm text-gray-600 hover:text-primary"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={mobile ? 20 : 18} />
                Dashboard
              </Link>
              <Link 
                href="/marketplace" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white ${mobile ? "text-lg py-4" : "text-sm"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={mobile ? 20 : 18} />
                Browse Leads
              </Link>
            </>
          )}
          <div className={`flex items-center gap-4 ${mobile ? "mt-4 pt-4 border-t border-gray-100" : "ml-4"}`}>
            <NotificationBell userId={user.id} />
            <div className="flex items-center gap-3 bg-gray-50 p-1 pr-3 rounded-full border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {!mobile && (
                <div className="flex flex-col leading-none">
                  <span className="text-gray-900 font-bold text-[11px]">{user?.name}</span>
                  <span className="text-gray-500 font-bold text-[9px] uppercase tracking-wider">{user?.role}</span>
                </div>
              )}
              <button 
                onClick={() => signOut()} 
                className="p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
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
            className="text-sm font-bold text-gray-600 hover:text-primary transition-colors"
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
        ? "h-16 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm" 
        : "h-20 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter text-gray-900">
            Naya<span className="text-primary group-hover:text-primary-hover transition-all">Ghar</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavLinks />
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-xl transition-colors" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-200 z-[999] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="p-6 pt-24">
          <NavLinks mobile />
        </div>
      </div>
    </nav>
  );
}



