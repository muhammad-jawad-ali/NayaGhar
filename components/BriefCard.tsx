"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import type { Brief, BriefStatus } from "@/lib/types";

interface BriefCardProps {
  brief: Brief;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: BriefStatus) => void;
}

export default function BriefCard({ brief, onDelete, onStatusChange }: BriefCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const statusColors: Record<BriefStatus, string> = {
    open: "bg-emerald-50/90 text-emerald-700 border-emerald-100",
    closed: "bg-gray-100/90 text-gray-600 border-gray-200",
    fulfilled: "bg-blue-50/90 text-blue-700 border-blue-100",
  };
  const formatLabel = (value?: string) => value ? value.replace(/-/g, " ") : "Not specified";
  const budgetLabel = brief.budgetNotSpecified
    ? "Negotiable"
    : `PKR ${brief.budgetMin?.toLocaleString()} - ${brief.budgetMax?.toLocaleString()}`;
  const title = `${formatLabel(brief.category)} in ${brief.area}, ${brief.city}`;
  const isUrgent = brief.urgency === "immediate";
  const imageByCategory = {
    house: "/images/marketplace/house.jpg",
    flat: "/images/marketplace/flat.jpg",
    plot: "/images/marketplace/plot.jpg",
    commercial: "/images/marketplace/commercial.jpg",
    farmhouse: "/images/marketplace/house.jpg",
    other: "/images/marketplace/fallback.jpg",
  } as const;
  const imageSrc = imageByCategory[brief.category] || imageByCategory.other;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-xl ${statusColors[brief.status]}`}>
              <ShieldCheck size={12} strokeWidth={2.5} />
              {brief.status}
            </span>
            {isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700 shadow-sm backdrop-blur-xl">
                <Zap size={11} strokeWidth={2.5} />
                urgent
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-black text-gray-700 shadow-sm backdrop-blur-xl">
              {brief.bidsCount || 0} bids
            </span>
            {onStatusChange && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onStatusChange(brief._id!.toString(), brief.status === "open" ? "closed" : "open");
                }}
                className={`text-xs font-bold px-2 py-1 rounded border transition-colors ${
                  brief.status === "open" ? "text-rose-500 border-rose-100 bg-rose-50 hover:bg-rose-100" : "text-emerald-500 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                }`}
              >
                {brief.status === "open" ? "Close" : "Reopen"}
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm("Are you sure you want to delete this requirement?")) {
                    onDelete(brief._id!.toString());
                  }
                }}
                className="rounded-full bg-white/92 p-2 text-gray-500 shadow-sm backdrop-blur-xl transition-colors hover:bg-red-50 hover:text-red-500"
                title="Delete Requirement"
              >
                <Trash2 size={15} />
              </button>
            )}
            {!onDelete && (
              <button
                type="button"
                className="rounded-full bg-white/92 p-2 text-gray-700 shadow-sm backdrop-blur-xl transition-colors hover:text-emerald-700"
                title="Save brief"
              >
                <Heart size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 pt-16">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <MapPin size={14} strokeWidth={2.5} />
            {brief.area}, {brief.city}
          </div>
        </div>
      </div>

      <div className="flex min-h-[260px] flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[1.35rem] font-black leading-tight tracking-tight text-gray-950">
              {budgetLabel}
            </p>
            <h3 className="mt-1 text-base font-bold capitalize leading-snug text-gray-900">
            {title}
          </h3>
          </div>
          <span className="whitespace-nowrap text-[11px] font-bold text-gray-400">
            {new Date(brief.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
          </span>
        </div>

        <p className="mb-3 text-sm font-black text-gray-950">
          {brief.areaSize} {formatLabel(brief.areaUnit)}
          <span className="mx-2 text-gray-300">|</span>
          {brief.bedrooms || "N/A"} beds
          <span className="mx-2 text-gray-300">|</span>
          {brief.bathrooms || "N/A"} baths
        </p>

        <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-gray-500">
          {brief.description || "No additional description provided."}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {[formatLabel(brief.purpose), formatLabel(brief.propertyStatus), formatLabel(brief.paymentPlan)].map((item) => (
            <span key={item} className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-600">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-black text-gray-600">
              <Clock3 size={13} />
              {formatLabel(brief.urgency)}
          </div>
          <Link 
            href={`/briefs/${brief._id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-gray-900/10 transition-all hover:bg-emerald-700"
          >
            Details
            <ArrowRight size={16} strokeWidth={2.6} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
