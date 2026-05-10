"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  PAKISTANI_CITIES, 
  AREA_UNITS, 
  AMENITIES_LIST,
} from "@/lib/types";
import type {
  BriefPurpose,
  PropertyCategory,
  PropertyStatus,
  BoundaryPref,
  PaymentPlan,
  Urgency,
  AreaUnit
} from "@/lib/types";
import { Check, ArrowRight, Home, MapPin, Ruler, Sparkles } from "lucide-react";

export default function NewBriefPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    purpose: "buy" as BriefPurpose,
    category: "house" as PropertyCategory,
    propertyStatus: "ready-to-move" as PropertyStatus,
    city: "Lahore",
    area: "",
    boundaryPref: "none" as BoundaryPref,
    areaSize: 5,
    areaUnit: "marla" as AreaUnit,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [] as string[],
    description: "",
    budgetMin: 10000000,
    budgetMax: 50000000,
    budgetNotSpecified: false,
    paymentPlan: "lump-sum" as PaymentPlan,
    urgency: "immediate" as Urgency,
  });

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

    if (formData.areaSize <= 0) {
      setError("Area size must be a positive number");
      setLoading(false);
      return;
    }

    if (!formData.budgetNotSpecified && formData.budgetMin > formData.budgetMax) {
      setError("Minimum budget cannot be greater than maximum budget");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/buyer");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create requirement");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const glassSection = "relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-xl shadow-black/[0.03] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_40%,rgba(255,255,255,0.2))] before:opacity-80 transition-all hover:bg-white/50";
  const inputStyle = "w-full bg-white/60 border border-gray-200/60 rounded-xl px-4 py-3.5 text-gray-950 font-medium placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-sm";
  const labelStyle = "text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block";

  const StepIcon = ({ icon: Icon, number }: { icon: any, number: number }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 mb-6 border border-emerald-300/50">
      <Icon size={20} strokeWidth={2.5} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#111827] pb-24 relative overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] rounded-full bg-emerald-400/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-[150px] translate-y-1/4" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-16 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 shadow-sm mb-6">
            <Sparkles size={14} />
            Demand-First Engine
          </div>
          <h1 className="text-5xl font-black text-gray-950 mb-6 tracking-tight leading-tight">
            Draft Your Dream Property Brief
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Tell us exactly what you're looking for. Our platform matches your brief with the top 1% of agents who will bid to find your perfect property.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100">!</span>
              {error}
            </div>
          )}

          {/* Section 1: Intent & Category */}
          <section className={glassSection}>
            <StepIcon icon={Home} number={1} />
            <h2 className="text-2xl font-black text-gray-950 mb-8 tracking-tight">The Basics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelStyle}>Purpose</label>
                <select 
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value as BriefPurpose})}
                  className={inputStyle}
                >
                  <option value="buy">Purchase</option>
                  <option value="rent">Rent</option>
                  <option value="short-term-lease">Short-term Lease</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Property Type</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as PropertyCategory})}
                  className={inputStyle}
                >
                  <option value="house">House / Villa</option>
                  <option value="flat">Apartment</option>
                  <option value="plot">Plot / Land</option>
                  <option value="commercial">Commercial Space</option>
                  <option value="farmhouse">Farmhouse</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Construction Status</label>
                <select 
                  value={formData.propertyStatus}
                  onChange={e => setFormData({...formData, propertyStatus: e.target.value as PropertyStatus})}
                  className={inputStyle}
                >
                  <option value="ready-to-move">Ready to Move</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="off-plan">Off-plan / Pre-launch</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Location */}
          <section className={glassSection}>
            <StepIcon icon={MapPin} number={2} />
            <h2 className="text-2xl font-black text-gray-950 mb-8 tracking-tight">Location Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>City</label>
                <select 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className={inputStyle}
                >
                  {PAKISTANI_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Preferred Area / Society</label>
                <input 
                  type="text"
                  placeholder="e.g., DHA Phase 6, Bahria Town Sector F..."
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className={inputStyle}
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 3: Specs & Budget */}
          <section className={glassSection}>
            <StepIcon icon={Ruler} number={3} />
            <h2 className="text-2xl font-black text-gray-950 mb-8 tracking-tight">Scale & Budget</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className={labelStyle}>Area Size</label>
                <input 
                  type="number"
                  value={formData.areaSize}
                  onChange={e => setFormData({...formData, areaSize: Number(e.target.value)})}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Measurement Unit</label>
                <select 
                  value={formData.areaUnit}
                  onChange={e => setFormData({...formData, areaUnit: e.target.value as AreaUnit})}
                  className={inputStyle}
                >
                  {AREA_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Minimum Bedrooms</label>
                <input 
                  type="number"
                  value={formData.bedrooms}
                  onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Min Budget (PKR)</label>
                <input 
                  type="number"
                  value={formData.budgetMin}
                  onChange={e => setFormData({...formData, budgetMin: Number(e.target.value)})}
                  className={`${inputStyle} ${formData.budgetNotSpecified ? 'opacity-50' : ''}`}
                  disabled={formData.budgetNotSpecified}
                />
              </div>
              <div>
                <label className={labelStyle}>Max Budget (PKR)</label>
                <input 
                  type="number"
                  value={formData.budgetMax}
                  onChange={e => setFormData({...formData, budgetMax: Number(e.target.value)})}
                  className={`${inputStyle} ${formData.budgetNotSpecified ? 'opacity-50' : ''}`}
                  disabled={formData.budgetNotSpecified}
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50">
              <input 
                type="checkbox"
                id="notSpecified"
                checked={formData.budgetNotSpecified}
                onChange={e => setFormData({...formData, budgetNotSpecified: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="notSpecified" className="text-sm text-gray-700 font-bold cursor-pointer select-none">
                Budget is strictly negotiable / I don't want to specify right now
              </label>
            </div>
          </section>

          {/* Section 4: Amenities & Desc */}
          <section className={glassSection}>
            <StepIcon icon={Sparkles} number={4} />
            <h2 className="text-2xl font-black text-gray-950 mb-8 tracking-tight">The Finer Details</h2>
            
            <div className="mb-10">
              <label className={labelStyle}>Must-Have Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {AMENITIES_LIST.map(amenity => {
                  const isSelected = formData.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-between ${
                        isSelected
                        ? "bg-gray-950 text-white shadow-md border border-gray-900"
                        : "bg-white/60 border border-gray-200/60 text-gray-500 hover:border-emerald-500 hover:text-emerald-700"
                      }`}
                    >
                      {amenity}
                      {isSelected && <Check size={14} className="text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className={labelStyle}>Special Instructions</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Paint a picture for the agents. E.g. 'Must be a corner plot near a park, prefer modern architecture with high ceilings...'"
                className={`${inputStyle} resize-none`}
              />
            </div>
          </section>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-white hover:text-gray-900 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-white bg-gray-950 hover:bg-emerald-600 shadow-xl shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 w-full sm:w-auto text-lg"
            >
              {loading ? "Publishing..." : "Publish Requirement"}
              {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
