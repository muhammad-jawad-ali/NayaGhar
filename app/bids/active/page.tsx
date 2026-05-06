"use client";

import Link from "next/link";

export default function ActiveBidsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mx-auto text-center p-12 md:p-20 rounded-[40px] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Active Leads</h1>
        <p className="text-gray-600 text-xl font-medium mb-12 leading-relaxed">
          The leads management console is currently undergoing maintenance and will be available shortly.
        </p>
        <Link 
          href="/dashboard"
          className="btn-primary btn-xl px-12 shadow-lg shadow-primary/20"
        >
          BACK TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
