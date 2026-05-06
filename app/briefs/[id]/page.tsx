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

  useEffect(() => {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!brief) return null;

  const isOwner = session?.user && session.user.id === brief.buyerId;
  const isAdmin = session?.user && session.user.role === "admin";
  const canSeeBids = isOwner || isAdmin;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/marketplace"
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-6 transition-colors"
        >
          ← Back to Marketplace
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                brief.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {brief.status}
              </span>
              <span className="text-slate-500 text-sm">Posted on {new Date(brief.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              {brief.category.charAt(0).toUpperCase() + brief.category.slice(1)} Requirement
            </h1>
            <p className="text-slate-400 text-xl">{brief.area}, {brief.city}</p>
          </div>

          {session?.user?.role === "agent" && (
            hasAlreadyBid ? (
              <div className="px-8 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                BID SUBMITTED
              </div>
            ) : (
              <Link
                href={`/bids/new?briefId=${brief._id}`}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1"
              >
                SUBMIT A BID
              </Link>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Details Section */}
          <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Property Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-tight">Purpose</p>
                <p className="text-white font-semibold">{brief.purpose.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-tight">Area Size</p>
                <p className="text-white font-semibold">{brief.areaSize} {brief.areaUnit}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-tight">Budget</p>
                <p className="text-white font-semibold">
                  {brief.budgetNotSpecified ? "Negotiable" : `PKR ${brief.budgetMin?.toLocaleString()} - ${brief.budgetMax?.toLocaleString()}`}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-tight">Bedrooms</p>
                <p className="text-white font-semibold">{brief.bedrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-tight">Bathrooms</p>
                <p className="text-white font-semibold">{brief.bathrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-tight">Urgency</p>
                <p className="text-white font-semibold">{brief.urgency.replace(/-/g, ' ')}</p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
              {brief.description || "The buyer has not provided additional details."}
            </p>
          </section>

          {/* Bids Section for Owner/Admin */}
          {canSeeBids && (
            <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Bids Received</h2>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                  {bids.length} Total
                </span>
              </div>

              {loadingBids ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bids.length > 0 ? (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid._id?.toString()} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{bid.propertyTitle}</h3>
                          <p className="text-slate-400 text-sm">{bid.propertyAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-indigo-400">PKR {bid.price.toLocaleString()}</p>
                          <p className="text-slate-500 text-xs uppercase tracking-widest">{bid.paymentPlan}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/5 mb-4">
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Area</p>
                          <p className="text-white text-sm font-semibold">{bid.areaSize} {bid.areaUnit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                          <p className="text-white text-sm font-semibold">{bid.propertyStatus.replace(/-/g, ' ')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Beds</p>
                          <p className="text-white text-sm font-semibold">{bid.bedrooms}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Agent</p>
                          <p className="text-indigo-400 text-sm font-semibold">{bid.agentName}</p>
                        </div>
                      </div>

                      {bid.images && bid.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                          {bid.images.map((img: string, i: number) => (
                            <img key={i} src={img} alt="Property" className="h-20 w-32 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          bid.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          bid.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {bid.status}
                        </span>
                        
                        <div className="flex gap-2">
                           <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all">
                             CONTACT AGENT
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-2xl border border-dashed border-white/10">
                  <p className="text-slate-500">No bids received yet for this requirement.</p>
                </div>
              )}
            </section>
          )}

          {/* Amenities */}
          <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Required Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {brief.amenities.length > 0 ? (
                brief.amenities.map(amenity => (
                  <span key={amenity} className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 text-sm border border-white/5">
                    {amenity}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 italic">No specific amenities requested.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
            <h3 className="text-lg font-bold text-white mb-4">Market Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Bids Received</span>
                <span className="text-indigo-400 font-bold">{brief.bidsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Views</span>
                <span className="text-slate-300">142</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Safety Tips</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>• Always verify property documents.</li>
              <li>• Do not share sensitive payment info.</li>
              <li>• Prefer meeting in public secure places.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

