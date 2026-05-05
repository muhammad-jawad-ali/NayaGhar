"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-indigo-400 text-sm font-bold mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            REINVENTING REAL ESTATE
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">UPWORK</span> FOR <br />
            REAL ESTATE
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12">
            Stop scrolling through thousands of stale digital classifieds. 
            Post your brief and let verified agents pitch properties available right now.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/auth/signup" 
              className="btn-primary btn-xl w-full sm:w-auto"
            >
              GET STARTED
            </Link>
            <Link 
              href="/marketplace" 
              className="btn-secondary btn-xl w-full sm:w-auto"
            >
              EXPLORE MARKETPLACE
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            <div className="text-center">
              <p className="text-white text-3xl font-black mb-1">100%</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Verified Agents</p>
            </div>
            <div className="text-center">
              <p className="text-white text-3xl font-black mb-1">Live</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Availability</p>
            </div>
            <div className="text-center">
              <p className="text-white text-3xl font-black mb-1">Direct</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pitching</p>
            </div>
            <div className="text-center">
              <p className="text-white text-3xl font-black mb-1">Secure</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">HOW IT WORKS</h2>
            <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: "01", 
                title: "The Brief", 
                desc: "Verified buyers post their exact requirements (Location, Budget, Amenities, Timeline)." 
              },
              { 
                step: "02", 
                title: "The Bid", 
                desc: "Verified agents search for matching briefs and pitch their currently available properties." 
              },
              { 
                step: "03", 
                title: "The Match", 
                desc: "Buyers receive a curated shortlist of 100% available options. No chasing ghost listings." 
              }
            ].map((item, i) => (
              <div key={i} className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/50 transition-all">
                <div className="text-5xl font-black text-indigo-500/20 mb-6 group-hover:text-indigo-500/40 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-blue-700 shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              READY TO FIND YOUR <br /> DREAM HOME?
            </h2>
            <Link 
              href="/auth/signup" 
              className="inline-block px-12 py-5 bg-white text-indigo-600 text-xl font-black rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl shadow-white/10"
            >
              SIGN UP NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
