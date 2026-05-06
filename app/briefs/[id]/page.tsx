"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Brief } from "@/lib/types";
import { AMENITIES_LIST } from "@/lib/types";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BriefDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(false);
  const [hasAlreadyBid, setHasAlreadyBid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchBriefAndBids() {
      try {
        const res = await fetch(`/api/briefs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBrief(data);
          
          // If user is the owner or admin, fetch bids
          if (session?.user && (session.user.id === data.buyerId || session.user.role === "admin")) {
            fetchBids();
          }

          // If user is an agent, check if they already bid
          if (session?.user && session.user.role === "agent") {
            checkIfAlreadyBid();
          }
        } else {
          router.push("/marketplace");
        }
      } catch (error) {
        console.error("Error fetching brief:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchBids() {
      setLoadingBids(true);
      try {
        const res = await fetch(`/api/bids?briefId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setBids(data.bids || []);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoadingBids(false);
      }
    }

    async function checkIfAlreadyBid() {
      try {
        const res = await fetch(`/api/bids?briefId=${id}&agentId=${session?.user?.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.bids && data.bids.length > 0) {
            setHasAlreadyBid(true);
          }
        }
      } catch (error) {
        console.error("Error checking bid status:", error);
      }
    }

    if (id && session) fetchBriefAndBids();
  }, [id, router, session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">Loading requirement details...</p>
      </div>
    );
  }

  if (!brief) return null;

  const isOwner = session?.user && session.user.id === brief.buyerId;
  const isAdmin = session?.user && session.user.role === "admin";
  const canSeeBids = isOwner || isAdmin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <Link 
          href="/marketplace"
          className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-8 group transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Marketplace
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${
                brief.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-100'
              }`}>
                {brief.status}
              </span>
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Posted on {mounted ? new Date(brief.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
                {brief.buyerName && <span>by <strong>{brief.buyerName}</strong></span>}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {brief.category.charAt(0).toUpperCase() + brief.category.slice(1)} Requirement
            </h1>
            <div className="flex items-center gap-2 text-gray-600 text-xl font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {brief.area}, {brief.city}
            </div>
          </div>

          {session?.user?.role === "agent" && (
            hasAlreadyBid ? (
              <div className="px-8 py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-emerald-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                BID SUBMITTED
              </div>
            ) : (
              <Link
                href={`/bids/new?briefId=${brief._id}`}
                className="btn-primary btn-xl shadow-xl shadow-primary/30"
              >
                SUBMIT A BID
              </Link>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Details Section */}
          <section className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </span>
              Requirement Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Purpose</p>
                <p className="text-gray-900 font-bold text-lg">{brief.purpose.toUpperCase()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Area Size</p>
                <p className="text-gray-900 font-bold text-lg">{brief.areaSize} {brief.areaUnit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Budget</p>
                <p className="text-primary font-black text-lg">
                  {brief.budgetNotSpecified ? "Negotiable" : `PKR ${brief.budgetMin?.toLocaleString()} - ${brief.budgetMax?.toLocaleString()}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bedrooms</p>
                <p className="text-gray-900 font-bold text-lg">{brief.bedrooms || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bathrooms</p>
                <p className="text-gray-900 font-bold text-lg">{brief.bathrooms || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Urgency</p>
                <p className="text-gray-900 font-bold text-lg capitalize">{brief.urgency.replace(/-/g, ' ')}</p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </span>
              Additional Information
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {brief.description || "The buyer has not provided additional details."}
              </p>
            </div>
          </section>

          {/* Bids Section for Owner/Admin */}
          {canSeeBids && (
            <section className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </span>
                  Bids Received
                </h2>
                <span className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-black shadow-lg shadow-primary/20">
                  {bids.length} Total
                </span>
              </div>

              {loadingBids ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 font-bold">Fetching bids...</p>
                </div>
              ) : bids.length > 0 ? (
                <div className="space-y-8">
                  {bids.map((bid) => (
                    <div key={bid._id?.toString()} className="p-8 rounded-[24px] bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                      
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative z-10">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">{bid.propertyTitle}</h3>
                          <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            {bid.propertyAddress}
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-3xl font-black text-primary mb-1">PKR {bid.price.toLocaleString()}</p>
                          <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                            {bid.paymentPlan}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-gray-200/60 mb-8 relative z-10">
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Area</p>
                          <p className="text-gray-900 text-sm font-bold">{bid.areaSize} {bid.areaUnit}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Status</p>
                          <p className="text-gray-900 text-sm font-bold capitalize">{bid.propertyStatus.replace(/-/g, ' ')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Rooms</p>
                          <p className="text-gray-900 text-sm font-bold">{bid.bedrooms}B / {bid.bathrooms}B</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Agent</p>
                          <p className="text-primary text-sm font-black">{bid.agentName}</p>
                        </div>
                      </div>

                      {bid.images && bid.images.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide relative z-10">
                          {bid.images.map((img: string, i: number) => (
                            <div key={i} className="flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                              <img src={img} alt="Property" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${
                          bid.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          bid.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {bid.status}
                        </div>
                        
                        <div className="flex gap-3 w-full sm:w-auto">
                           <button className="w-full sm:w-auto btn-primary px-8 py-3 text-sm shadow-lg shadow-primary/20">
                             CONTACT AGENT
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>
                  <p className="text-gray-500 font-bold text-lg">No bids received yet.</p>
                  <p className="text-gray-400 text-sm">Active agents will pitch their properties here.</p>
                </div>
              )}
            </section>
          )}

          {/* Amenities */}
          <section className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM9 9h6M9 15h6"></path></svg>
              </span>
              Required Amenities
            </h2>
            <div className="flex flex-wrap gap-4">
              {brief.amenities.length > 0 ? (
                brief.amenities.map(amenity => (
                  <span key={amenity} className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-700 text-sm font-bold border border-gray-100 shadow-sm hover:border-primary/30 transition-colors">
                    {amenity}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 italic font-medium">No specific amenities requested.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar info */}
        <div className="space-y-8">
          <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 shadow-xl shadow-primary/5">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Market Stats
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-primary/10">
                <span className="text-gray-500 font-bold text-sm">Bids Received</span>
                <span className="text-primary font-black text-xl">{brief.bidsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold text-sm">Profile Views</span>
                <span className="text-gray-900 font-black text-xl">142</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 rounded-[32px] bg-gray-50 border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Safety Tips</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                <span className="text-primary mt-1">•</span>
                <span>Always verify property documents physically.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                <span className="text-primary mt-1">•</span>
                <span>Do not share sensitive payment info online.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                <span className="text-primary mt-1">•</span>
                <span>Prefer meeting in public, secure places.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-[32px] bg-white border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-500 text-sm font-medium mb-4">Our support team is available 24/7 for any assistance.</p>
            <button className="text-primary font-black text-sm hover:underline flex items-center gap-2">
              Contact Support
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

