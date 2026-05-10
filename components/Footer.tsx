"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Camera, Globe, Mail, Send, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f7f5ef] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(22,163,74,0.14),transparent_28%),radial-gradient(circle_at_84%_36%,rgba(15,23,42,0.09),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-72 opacity-35">
        <Image src="/images/marketplace/house.jpg" alt="" fill sizes="100vw" className="object-cover blur-3xl" />
        <div className="absolute inset-0 bg-[#f7f5ef]/65" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/58 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
          <div className="grid grid-cols-1 gap-10 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:p-10">
            <div>
              <Link href="/" className="group mb-5 inline-block">
                <span className="text-3xl font-black tracking-tight text-gray-950">
                  Naya<span className="text-primary transition-all group-hover:text-primary-hover">Ghar</span>
                </span>
              </Link>
              <p className="max-w-md text-base font-medium leading-relaxed text-gray-600">
                The demand-first real estate marketplace where buyers post intent and verified agents compete with relevant properties.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/briefs/new"
                  className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-gray-900/15 transition-all hover:bg-primary"
                >
                  Post a brief
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/70 px-5 py-3 text-sm font-black text-gray-950 shadow-sm backdrop-blur-xl transition-all hover:text-primary"
                >
                  Browse demand
                  <Sparkles size={16} />
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/62 p-5 shadow-sm backdrop-blur-xl">
              <h4 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                <ShieldCheck size={15} />
                Platform
              </h4>
              <ul className="space-y-3">
                {[
                  ["Marketplace", "/marketplace"],
                  ["Post a Brief", "/briefs/new"],
                  ["How it Works", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="group flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-white/80 hover:text-primary">
                      {label}
                      <ArrowRight size={14} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/62 p-5 shadow-sm backdrop-blur-xl">
              <h4 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                <Mail size={15} />
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  ["About Us", "#"],
                  ["Privacy Policy", "#"],
                  ["Terms of Service", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="group flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-white/80 hover:text-primary">
                      {label}
                      <ArrowRight size={14} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/80 bg-white/42 px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div className="flex gap-3">
              {[
                { name: "Facebook", icon: Globe },
                { name: "Twitter", icon: Send },
                { name: "Instagram", icon: Camera },
                { name: "LinkedIn", icon: Briefcase },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/68 text-gray-500 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon size={17} />
                </a>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-500">
              &copy; {new Date().getFullYear()} NayaGhar. All rights reserved.
            </p>

            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
