import { AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { material: "Steel Plates 3mm", code: "MAT-001", currentStock: 50, minStock: 100, severity: "critical" },
  { material: "PVC Sheets", code: "MAT-045", currentStock: 180, minStock: 200, severity: "warning" },
  { material: "Industrial Adhesive", code: "MAT-089", currentStock: 25, minStock: 50, severity: "critical" },
];

export function StockAlerts() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="text-base font-semibold text-foreground">Stock Alerts</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.code}
            className="p-3 rounded-lg border border-border bg-secondary/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{alert.material}</p>
                  <p className="text-xs text-muted-foreground">{alert.code}</p>
                </div>
              </div>
              <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                {alert.severity === "critical" ? "Critical" : "Low"}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">
                Current: <span className="font-medium text-foreground">{alert.currentStock}</span>
              </span>
              <span className="text-muted-foreground">
                Min: <span className="font-medium text-foreground">{alert.minStock}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
