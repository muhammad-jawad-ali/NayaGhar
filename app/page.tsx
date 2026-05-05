"use client";

import Link from "next/link";
import { ChevronRight, CheckCircle, Shield, Zap, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-gradient-to-b from-green-50/50 to-white overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Pakistan's Next-Gen Property CRM
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
              Find Your <span className="text-primary">Perfect Home</span> <br className="hidden md:block" />
              Without the Search Stress
            </h1>
            
            <p className="max-w-2xl mx-auto text-gray-600 text-lg md:text-xl leading-relaxed mb-12 font-medium">
              Stop wasting hours on outdated listings. Post your requirements once 
              and let verified agents pitch available properties directly to you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/signup" 
                className="btn-primary btn-xl w-full sm:w-auto shadow-lg shadow-primary/20"
              >
                Get Started Free
                <ChevronRight size={20} />
              </Link>
              <Link 
                href="/marketplace" 
                className="btn-secondary btn-xl w-full sm:w-auto"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-100">
            {[
              { label: "Verified Agents", value: "100%", icon: Shield },
              { label: "Active Briefs", value: "500+", icon: Zap },
              { label: "Success Rate", value: "95%", icon: TrendingUp },
              { label: "Live Matches", value: "Real-time", icon: CheckCircle },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="flex justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-gray-900 text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How NayaGhar Works</h2>
            <p className="text-gray-600 font-medium">Three simple steps to your new doorstep</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Post a Brief", 
                desc: "Buyers post their exact requirements—budget, location, and amenities—to our verified marketplace." 
              },
              { 
                step: "02", 
                title: "Get Real Pitches", 
                desc: "Verified agents find your brief and pitch properties that are actually available right now." 
              },
              { 
                step: "03", 
                title: "Seal the Deal", 
                desc: "Review matches, chat with agents, and find your dream home without ever browsing a single listing." 
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl font-black text-primary/10 mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="p-12 md:p-16 rounded-3xl bg-primary shadow-2xl shadow-primary/20 relative overflow-hidden text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight relative">
              Ready to find your <br className="hidden md:block" />
              future home today?
            </h2>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary text-lg font-bold rounded-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-xl relative"
            >
              Sign Up For Free
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
