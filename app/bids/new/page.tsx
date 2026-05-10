"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Brief, PropertyCategory, PropertyStatus, PaymentPlan, AreaUnit } from "@/lib/types";
import { AREA_UNITS, AMENITIES_LIST } from "@/lib/types";
import { Sparkles, MapPin, Building2, CheckCircle2, ArrowRight, X, Image as ImageIcon, Plus, TrendingUp } from "lucide-react";

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

  const [imageUrlInput, setImageUrlInput] = useState("");

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

  const handleAddImage = () => {
    if (imageUrlInput) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput] }));
      setImageUrlInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.price <= 0) {
      setError("Price must be a positive number");
      setLoading(false); return;
    }
    if (formData.areaSize <= 0) {
      setError("Area size must be a positive number");
      setLoading(false); return;
    }

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/agent");
        router.refresh();
      } else {
        const errorMessage = data.details ? `${data.error}: ${data.details}` : (data.error || "Failed to submit bid");
        setError(errorMessage);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-gray-500 font-medium">Preparing proposal workspace...</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#111827] selection:bg-primary/20 selection:text-primary overflow-hidden relative">
      {/* ─── Ambient Background ─── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-emerald-600/5 blur-[150px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* ─── LEFT COLUMN (STICKY SUMMARY) ─── */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 shadow-sm backdrop-blur-xl mb-6">
                <Sparkles size={14} />
                Proposal Draft
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] text-gray-950 tracking-tight mb-8">
                Pitch <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Your Vision</span>
              </h1>

              {brief && (
                <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.9),transparent_50%,rgba(255,255,255,0.2))] before:opacity-80 mt-12 group">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-colors duration-700" />
                  
                  <div className="relative">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Target Requirement</p>
                    <h3 className="text-2xl font-black text-gray-950 capitalize mb-6">{brief.category} Needed</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center shrink-0">
                          <MapPin size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                          <p className="font-bold text-gray-900">{brief.area}, {brief.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center shrink-0">
                          <Building2 size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Range</p>
                          <p className="font-bold text-gray-900">PKR {brief.minBudget?.toLocaleString()} - {brief.maxBudget?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Market Insights / Popular Areas ─── */}
              <div className="mt-8 relative overflow-hidden rounded-[2rem] border border-gray-200/50 bg-white/20 p-8 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">Trending Areas</h3>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'DHA', desc: 'High demand for premium 1-Kanal houses.' },
                    { name: 'Bahria Town', desc: 'Surge in commercial plots and family villas.' },
                    { name: 'Gulberg Greens', desc: 'Luxury farmhouses seeing a 30% price jump.' },
                    { name: 'Sector F-7', desc: 'Prime commercial and residential hotspot.' }
                  ].map((area) => (
                    <div 
                      key={area.name} 
                      className="group flex flex-col rounded-2xl border border-white/60 bg-white/40 p-4 transition-all hover:bg-white/80 hover:shadow-md cursor-pointer"
                    >
                      <h4 className="text-sm font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{area.name}</h4>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">{area.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                    Insight: +24% Engagement
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-400">
                    Properties pitched in these areas are closing faster this month.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (FORM) ─── */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-16">
              
              {/* 1. Basics */}
              <section className="space-y-8">
                <div className="border-b-2 border-gray-950 pb-4">
                  <h2 className="text-2xl font-black text-gray-950">01. The Property</h2>
                </div>
                
                <div className="space-y-10">
                  <div className="group relative">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Property Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Modern 10 Marla Park-Facing House"
                      value={formData.propertyTitle}
                      onChange={e => setFormData({...formData, propertyTitle: e.target.value})}
                      className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-2xl font-bold text-gray-900 placeholder:text-gray-300 focus:ring-0 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="group relative">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Complete Address</label>
                    <input 
                      type="text"
                      placeholder="House #, Street #, Sector..."
                      value={formData.propertyAddress}
                      onChange={e => setFormData({...formData, propertyAddress: e.target.value})}
                      className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-xl font-bold text-gray-900 placeholder:text-gray-300 focus:ring-0 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* 2. Specs */}
              <section className="space-y-8">
                <div className="border-b-2 border-gray-950 pb-4">
                  <h2 className="text-2xl font-black text-gray-950">02. Value & Size</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group relative">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Price (PKR)</label>
                    <div className="relative">
                      <span className="absolute left-0 top-3 text-2xl font-black text-gray-300">Rs.</span>
                      <input 
                        type="number"
                        value={formData.price || ''}
                        placeholder="0"
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-transparent border-0 border-b border-gray-300 pl-12 py-3 text-3xl font-black text-primary placeholder:text-gray-200 focus:ring-0 focus:border-primary transition-colors"
                        required min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="group relative flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Area Size</label>
                      <input 
                        type="number"
                        value={formData.areaSize || ''}
                        placeholder="0"
                        onChange={e => setFormData({...formData, areaSize: Number(e.target.value)})}
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-3xl font-black text-gray-900 placeholder:text-gray-200 focus:ring-0 focus:border-primary transition-colors"
                        required min="1"
                      />
                    </div>
                    <div className="group relative w-32 shrink-0">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Unit</label>
                      <select 
                        value={formData.areaUnit}
                        onChange={e => setFormData({...formData, areaUnit: e.target.value as AreaUnit})}
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-xl font-bold text-gray-500 focus:ring-0 focus:border-primary transition-colors appearance-none cursor-pointer"
                      >
                        {AREA_UNITS.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-8">
                  <div className="bg-white/40 rounded-3xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Bedrooms</label>
                      <span className="font-black text-3xl text-gray-900">{formData.bedrooms}</span>
                    </div>
                    <input 
                      type="range"
                      value={formData.bedrooms}
                      onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                      min="0" max="10" step="1"
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-bold mt-3">
                      <span>0</span><span>10+</span>
                    </div>
                  </div>
                  <div className="bg-white/40 rounded-3xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Bathrooms</label>
                      <span className="font-black text-3xl text-gray-900">{formData.bathrooms}</span>
                    </div>
                    <input 
                      type="range"
                      value={formData.bathrooms}
                      onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                      min="0" max="10" step="1"
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-bold mt-3">
                      <span>0</span><span>10+</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Amenities */}
              <section className="space-y-8">
                <div className="border-b-2 border-gray-950 pb-4">
                  <h2 className="text-2xl font-black text-gray-950">03. Amenities</h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {AMENITIES_LIST.map(amenity => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-5 py-3 rounded-full text-sm font-bold border-2 transition-all duration-300 flex items-center gap-2 ${
                          isSelected
                          ? "bg-primary border-primary text-white shadow-[0_8px_20px_rgba(22,163,74,0.3)] scale-105"
                          : "bg-transparent border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-900"
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={16} />}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 4. Images */}
              <section className="space-y-8">
                <div className="border-b-2 border-gray-950 pb-4">
                  <h2 className="text-2xl font-black text-gray-950">04. Visuals</h2>
                </div>
                
                <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-300 bg-white/20 p-8 sm:p-12 text-center transition-all hover:bg-white/40 hover:border-primary/50 group">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-md text-gray-400 group-hover:text-primary transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Add Property Imagery</h3>
                  <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm mx-auto">
                    Provide direct links to high-quality photos to make your pitch stand out.
                  </p>
                  
                  <div className="flex max-w-md mx-auto items-center gap-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
                    <input 
                      type="url"
                      placeholder="Paste image URL here..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); } }}
                      className="flex-1 bg-transparent border-none px-4 text-sm font-medium focus:ring-0 placeholder:text-gray-400"
                    />
                    <button 
                      type="button"
                      onClick={handleAddImage}
                      className="h-10 w-10 shrink-0 rounded-full bg-gray-950 text-white flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((url, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-gray-200 shadow-sm">
                        <img src={url} alt={`Property ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="p-3 bg-white text-rose-500 rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={18} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Submit Area */}
              <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-6">
                {error && <span className="text-rose-500 font-bold text-sm bg-rose-50 px-4 py-2 rounded-full">{error}</span>}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel Pitch
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-5 rounded-full font-black text-white bg-gray-950 hover:bg-primary shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_40px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 flex items-center gap-3 text-lg"
                >
                  {loading ? "Submitting..." : "Submit Proposal"}
                  {!loading && <ArrowRight size={20} />}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function NewBidPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-gray-500 font-medium text-lg">Loading pitch workspace...</span>
        </div>
      </div>
    }>
      <BidForm />
    </Suspense>
  );
}
