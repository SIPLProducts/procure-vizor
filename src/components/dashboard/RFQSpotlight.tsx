import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";

const rfqs = [
  { id: "RFQ-2024-001", title: "Steel Plates - Q1 Requirement", vendors: 5, dueIn: 2, status: "active" },
  { id: "RFQ-2024-002", title: "Packaging Materials", vendors: 8, dueIn: 5, status: "active" },
  { id: "RFQ-2024-003", title: "Industrial Chemicals", vendors: 3, dueIn: 1, status: "urgent" },
];

export function RFQSpotlight() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">RFQ Spotlight</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="space-y-3">
        {rfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{rfq.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rfq.id}</p>
              </div>
              <Badge variant={rfq.status === "urgent" ? "destructive" : "secondary"}>
                {rfq.status === "urgent" ? "Urgent" : "Active"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{rfq.vendors} vendors invited</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Due in {rfq.dueIn} days
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
