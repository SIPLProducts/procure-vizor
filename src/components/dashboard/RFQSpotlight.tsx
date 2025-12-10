import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, FileText } from "lucide-react";

const rfqs = [
  { id: "RFQ-2024-001", title: "Steel Plates - Q1 Requirement", vendors: 5, dueIn: 2, status: "active" },
  { id: "RFQ-2024-002", title: "Packaging Materials", vendors: 8, dueIn: 5, status: "active" },
  { id: "RFQ-2024-003", title: "Industrial Chemicals", vendors: 3, dueIn: 1, status: "urgent" },
];

export function RFQSpotlight() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">RFQ Spotlight</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="space-y-3">
        {rfqs.map((rfq, index) => (
          <div
            key={rfq.id}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{rfq.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{rfq.id}</p>
              </div>
              <Badge 
                className={rfq.status === "urgent" 
                  ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" 
                  : "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                }
              >
                {rfq.status === "urgent" ? "Urgent" : "Active"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="font-medium">{rfq.vendors} vendors invited</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Due in {rfq.dueIn} days
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
