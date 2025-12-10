import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const alerts = [
  { material: "Steel Plates 3mm", code: "MAT-001", currentStock: 50, minStock: 100, severity: "critical" },
  { material: "PVC Sheets", code: "MAT-045", currentStock: 180, minStock: 200, severity: "warning" },
  { material: "Industrial Adhesive", code: "MAT-089", currentStock: 25, minStock: 50, severity: "critical" },
];

export function StockAlerts() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-500">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Stock Alerts</h3>
            <p className="text-sm text-slate-500">3 items low</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const percentage = Math.round((alert.currentStock / alert.minStock) * 100);
          return (
            <div
              key={alert.code}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-200/70">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{alert.material}</p>
                    <p className="text-sm text-slate-500">{alert.code}</p>
                  </div>
                </div>
                <Badge 
                  className={alert.severity === "critical" 
                    ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" 
                    : "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"
                  }
                >
                  {alert.severity === "critical" ? "Critical" : "Low"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Progress 
                  value={percentage} 
                  className="h-2 bg-slate-200"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Current: <span className="font-semibold text-slate-700">{alert.currentStock}</span>
                  </span>
                  <span className="text-slate-500">
                    Min: <span className="font-semibold text-slate-700">{alert.minStock}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
