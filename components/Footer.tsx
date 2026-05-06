"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Send, Camera, Briefcase, Mail } from "lucide-react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="group inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                Naya<span className="text-primary group-hover:text-primary-hover transition-all">Ghar</span>
              </span>
            </Link>
            <p className="text-gray-600 max-w-sm leading-relaxed mb-8 font-medium">
              The demand-first real estate marketplace. Revolutionizing how you find your next home by letting verified agents pitch directly to you.
            </p>
            <div className="flex gap-4">
              {[
                { name: "Facebook", icon: Globe },
                { name: "Twitter", icon: Send },
                { name: "Instagram", icon: Camera },
                { name: "LinkedIn", icon: Briefcase }
              ].map((social) => (
                <a 
                  key={social.name}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/marketplace" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">Marketplace</Link></li>
              <li><Link href="/briefs/new" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">Post a Brief</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">How it Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-semibold">
            &copy; {mounted ? new Date().getFullYear() : '2024'} NayaGhar. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

