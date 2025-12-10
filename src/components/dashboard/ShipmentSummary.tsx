import { Truck, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const shipments = [
  { id: "SHP-001", vendor: "ABC Metals", eta: "Today, 2:30 PM", status: "on-time" },
  { id: "SHP-002", vendor: "XYZ Polymers", eta: "Tomorrow, 10:00 AM", status: "on-time" },
  { id: "SHP-003", vendor: "Steel Corp", eta: "Dec 12, 4:00 PM", status: "delayed" },
  { id: "SHP-004", vendor: "Pack Solutions", eta: "Dec 13, 9:00 AM", status: "on-time" },
];

export function ShipmentSummary() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Incoming Shipments</h3>
            <p className="text-sm text-slate-500">4 in transit</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold">
          Track All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="space-y-3">
        {shipments.map((shipment) => (
          <div
            key={shipment.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {shipment.status === "on-time" ? (
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-amber-100">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              )}
              <div>
                <p className="text-[15px] font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{shipment.vendor}</p>
                <p className="text-sm text-slate-500">{shipment.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5 justify-end">
                <Clock className="w-4 h-4 text-slate-400" />
                {shipment.eta}
              </p>
              <p className={`text-sm font-medium ${shipment.status === "on-time" ? "text-green-600" : "text-amber-600"}`}>
                {shipment.status === "on-time" ? "On Time" : "Delayed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
