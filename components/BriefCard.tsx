import Link from "next/link";
import type { Brief, BriefStatus } from "@/lib/types";

interface BriefCardProps {
  brief: Brief;
  onDelete?: (id: string) => void;
}

export default function BriefCard({ brief, onDelete }: BriefCardProps) {
  const statusColors: Record<BriefStatus, string> = {
    open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    closed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    fulfilled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[brief.status]}`}>
            {brief.status.toUpperCase()}
          </span>
          <div className="flex gap-2">
            <span className="text-slate-500 text-xs">
              {new Date(brief.createdAt).toLocaleDateString()}
            </span>
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm("Are you sure you want to delete this requirement?")) {
                    onDelete(brief._id!.toString());
                  }
                }}
                className="text-rose-500 hover:text-rose-400 transition-colors"
                title="Delete Requirement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
          {brief.category.charAt(0).toUpperCase() + brief.category.slice(1)} in {brief.area}, {brief.city}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300">
            {brief.purpose.toUpperCase()}
          </div>
          <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300">
            {brief.areaSize} {brief.areaUnit}
          </div>
          <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300">
            {brief.bedrooms} BHK
          </div>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-6">
          {brief.description || "No additional description provided."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="text-sm font-medium text-indigo-400">
            {brief.budgetNotSpecified ? "Budget Negotiable" : `PKR ${brief.budgetMin?.toLocaleString()} - ${brief.budgetMax?.toLocaleString()}`}
          </div>
          <Link 
            href={`/briefs/${brief._id}`}
            className="btn-primary !px-4 !py-2 !text-[10px] !rounded-xl"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </div>
  );
}
