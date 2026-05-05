"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="group inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter text-white">
                Naya<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">Ghar</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
              The demand-first real estate marketplace. Revolutionizing how you find your next home by letting verified agents pitch directly to you.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/marketplace" className="text-slate-400 hover:text-white transition-colors text-sm">Marketplace</Link></li>
              <li><Link href="/briefs/new" className="text-slate-400 hover:text-white transition-colors text-sm">Post a Brief</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">How it Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} NayaGhar. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

