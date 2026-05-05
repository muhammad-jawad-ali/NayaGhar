"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { 
  Brief, 
} from "@/lib/types";
import { 
  AREA_UNITS, 
  AMENITIES_LIST,
} from "@/lib/types";
import type {
  PropertyCategory,
  PropertyStatus,
  PaymentPlan,
  AreaUnit
} from "@/lib/types";

function BidForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const briefId = searchParams.get("briefId");

  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    briefId: briefId || "",
    propertyTitle: "",
    propertyAddress: "",
    city: "",
    area: "",
    areaSize: 5,
    areaUnit: "marla" as AreaUnit,
    category: "house" as PropertyCategory,
    propertyStatus: "ready-to-move" as PropertyStatus,
    price: 0,
    paymentPlan: "lump-sum" as PaymentPlan,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [] as string[],
    description: "",
    images: [] as string[],
  });

  useEffect(() => {
    async function fetchBrief() {
      if (!briefId) {
        router.push("/marketplace");
        return;
      }
      try {
        const res = await fetch(`/api/briefs/${briefId}`);
        if (res.ok) {
          const data = await res.json();
          setBrief(data);
          // Pre-fill some data from brief to help agent
          setFormData(prev => ({
            ...prev,
            city: data.city,
            area: data.area,
            category: data.category,
            areaUnit: data.areaUnit,
          }));
        }
      } catch (err) {
        console.error("Error fetching brief:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchBrief();
  }, [briefId, router]);

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.price <= 0) {
      setError("Price must be a positive number");
      setLoading(false);
      return;
    }

    if (formData.areaSize <= 0) {
      setError("Area size must be a positive number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Show detailed error if available
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : (data.error || "Failed to submit bid");
        setError(errorMessage);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-slate-400">Loading requirement details...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Submit Your Bid</h1>
        {brief && (
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-slate-400 text-sm">
            Pitching for: <span className="text-indigo-400 font-bold">{brief.category.toUpperCase()}</span> in <span className="text-indigo-400 font-bold">{brief.area}, {brief.city}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-shake">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span className="font-bold">Submission Error</span>
            </div>
            {error}
          </div>
        )}


        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Property Details</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Property Title</label>
              <input 
                type="text"
                placeholder="e.g. Modern 10 Marla Luxury House"
                value={formData.propertyTitle}
                onChange={e => setFormData({...formData, propertyTitle: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Complete Address</label>
              <input 
                type="text"
                placeholder="House #, Street #, Sector..."
                value={formData.propertyAddress}
                onChange={e => setFormData({...formData, propertyAddress: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Specifications & Price</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Price (PKR)</label>
              <input 
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Area Size</label>
              <input 
                type="number"
                value={formData.areaSize}
                onChange={e => setFormData({...formData, areaSize: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Unit</label>
              <select 
                value={formData.areaUnit}
                onChange={e => setFormData({...formData, areaUnit: e.target.value as AreaUnit})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {AREA_UNITS.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Bedrooms</label>
              <input 
                type="number"
                value={formData.bedrooms}
                onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Bathrooms</label>
              <input 
                type="number"
                value={formData.bathrooms}
                onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AMENITIES_LIST.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  formData.amenities.includes(amenity)
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Property Images</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Image URL (Optional)</label>
              <div className="flex gap-2">
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  id="imageInput"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('imageInput') as HTMLInputElement;
                    if (input.value) {
                      setFormData(prev => ({ ...prev, images: [...prev.images, input.value] }));
                      input.value = "";
                    }
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all"
                >
                  ADD
                </button>
              </div>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-white/5 border border-white/10">
                    <img src={url} alt="Property" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-1 right-1 p-1 bg-rose-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-4 pb-12">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1"
          >
            {loading ? "SUBMITTING..." : "SUBMIT BID"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewBidPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <BidForm />
    </Suspense>
  );
}
