import { Truck, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const shipments = [
  { id: "SHP-001", vendor: "ABC Metals", eta: "Today, 2:30 PM", status: "on-time" },
  { id: "SHP-002", vendor: "XYZ Polymers", eta: "Tomorrow, 10:00 AM", status: "on-time" },
  { id: "SHP-003", vendor: "Steel Corp", eta: "Dec 12, 4:00 PM", status: "delayed" },
  { id: "SHP-004", vendor: "Pack Solutions", eta: "Dec 13, 9:00 AM", status: "on-time" },
];

export function ShipmentSummary() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Incoming Shipments</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Truck className="w-4 h-4" />
          <span>4 in transit</span>
        </div>
      </div>
      <div className="space-y-3">
        {shipments.map((shipment) => (
          <div
            key={shipment.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              {shipment.status === "on-time" ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-warning" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{shipment.vendor}</p>
                <p className="text-xs text-muted-foreground">{shipment.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {shipment.eta}
              </p>
              <p className={`text-xs ${shipment.status === "on-time" ? "text-success" : "text-warning"}`}>
                {shipment.status === "on-time" ? "On Time" : "Delayed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
