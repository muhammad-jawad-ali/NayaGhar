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
        router.push("/marketplace");
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Post Your Requirement</h1>
        <p className="text-slate-400 text-lg">Tell us what you're looking for, and let the best properties find you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Intent & Category */}
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-xs">1</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Purpose</label>
              <select 
                value={formData.purpose}
                onChange={e => setFormData({...formData, purpose: e.target.value as BriefPurpose})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="short-term-lease">Short-term Lease</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as PropertyCategory})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="house">House</option>
                <option value="flat">Flat</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
                <option value="farmhouse">Farmhouse</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Property Status</label>
              <select 
                value={formData.propertyStatus}
                onChange={e => setFormData({...formData, propertyStatus: e.target.value as PropertyStatus})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="ready-to-move">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
                <option value="off-plan">Off-plan</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Location */}
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-xs">2</span>
            Location Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">City</label>
              <select 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {PAKISTANI_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Preferred Area / Society</label>
              <input 
                type="text"
                placeholder="e.g. DHA Phase 6, Bahria Town"
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
        </section>

        {/* Section 3: Specs & Budget */}
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-xs">3</span>
            Size & Budget
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Bedrooms</label>
              <input 
                type="number"
                value={formData.bedrooms}
                onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Min Budget (PKR)</label>
              <input 
                type="number"
                value={formData.budgetMin}
                onChange={e => setFormData({...formData, budgetMin: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={formData.budgetNotSpecified}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Max Budget (PKR)</label>
              <input 
                type="number"
                value={formData.budgetMax}
                onChange={e => setFormData({...formData, budgetMax: Number(e.target.value)})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={formData.budgetNotSpecified}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input 
              type="checkbox"
              id="notSpecified"
              checked={formData.budgetNotSpecified}
              onChange={e => setFormData({...formData, budgetNotSpecified: e.target.checked})}
              className="w-4 h-4 rounded border-white/10 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="notSpecified" className="text-sm text-slate-400 font-medium">Budget is negotiable / not specific</label>
          </div>
        </section>

        {/* Section 4: Amenities & Desc */}
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-xs">4</span>
            Amenities & Description
          </h2>
          <div className="mb-8">
            <label className="text-sm font-medium text-slate-400 mb-4 block">Select Required Amenities</label>
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
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Additional Notes / Special Instructions</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="e.g. Near park, quiet street, corner house preferred..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 pb-12">
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
            {loading ? "POSTING..." : "POST REQUIREMENT"}
          </button>
        </div>
      </form>
    </div>
  );
}
