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

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">Loading requirement details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Submit Your Bid</h1>
        {brief && (
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pitching for Requirement</p>
              <p className="text-lg font-bold text-gray-900">
                {brief.category.toUpperCase()} in <span className="text-primary">{brief.area}, {brief.city}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex gap-3 items-start animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <p className="mb-1 font-black">Submission Error</p>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        <section className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">1</span>
            Property Details
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Property Title</label>
              <input 
                type="text"
                placeholder="e.g. Modern 10 Marla Luxury House"
                value={formData.propertyTitle}
                onChange={e => setFormData({...formData, propertyTitle: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Complete Address</label>
              <input 
                type="text"
                placeholder="House #, Street #, Sector..."
                value={formData.propertyAddress}
                onChange={e => setFormData({...formData, propertyAddress: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">2</span>
            Specifications & Price
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Price (PKR)</label>
              <input 
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Area Size</label>
              <input 
                type="number"
                value={formData.areaSize}
                onChange={e => setFormData({...formData, areaSize: Number(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Unit</label>
              <select 
                value={formData.areaUnit}
                onChange={e => setFormData({...formData, areaUnit: e.target.value as AreaUnit})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
              >
                {AREA_UNITS.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Bedrooms</label>
              <input 
                type="number"
                value={formData.bedrooms}
                onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Bathrooms</label>
              <input 
                type="number"
                value={formData.bathrooms}
                onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">3</span>
            Amenities
          </h2>
          <div className="flex flex-wrap gap-3">
            {AMENITIES_LIST.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  formData.amenities.includes(amenity)
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">4</span>
            Property Images
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Image URL (Optional)</label>
              <div className="flex gap-3">
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  id="imageInput"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                  className="btn-secondary whitespace-nowrap"
                >
                  ADD IMAGE
                </button>
              </div>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200 shadow-sm">
                    <img src={url} alt="Property" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-12">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary px-10 py-4"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-12 py-4 shadow-lg shadow-primary/20 disabled:opacity-50"
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
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">Loading form...</p>
      </div>
    }>
      <BidForm />
    </Suspense>
  );
}
