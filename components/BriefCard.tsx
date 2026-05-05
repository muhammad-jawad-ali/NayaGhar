import Link from "next/link";
import type { Brief, BriefStatus } from "@/lib/types";

interface BriefCardProps {
  brief: Brief;
  onDelete?: (id: string) => void;
}

export default function BriefCard({ brief, onDelete }: BriefCardProps) {
  const statusColors: Record<BriefStatus, string> = {
    open: "bg-green-50 text-green-700 border-green-100",
    closed: "bg-gray-50 text-gray-600 border-gray-100",
    fulfilled: "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary/50 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-5">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider ${statusColors[brief.status]}`}>
            {brief.status.toUpperCase()}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-[11px] font-bold">
              {new Date(brief.createdAt).toLocaleDateString("en-PK", { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm("Are you sure you want to delete this requirement?")) {
                    onDelete(brief._id!.toString());
                  }
                }}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Delete Requirement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
          {brief.category.charAt(0).toUpperCase() + brief.category.slice(1)} in {brief.area}, {brief.city}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-tight">
            {brief.purpose}
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-tight">
            {brief.areaSize} {brief.areaUnit}
          </div>
          {brief.bedrooms > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-tight">
              {brief.bedrooms} Bedrooms
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
          {brief.description || "No additional description provided."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Budget Range</span>
            <div className="text-sm font-bold text-primary">
              {brief.budgetNotSpecified ? "Negotiable" : `PKR ${brief.budgetMin?.toLocaleString()} - ${brief.budgetMax?.toLocaleString()}`}
            </div>
          </div>
          <Link 
            href={`/briefs/${brief._id}`}
            className="btn-primary !px-5 !py-2.5 !text-xs !font-bold rounded-xl shadow-md shadow-primary/10"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

