import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
  Package,
  Send,
  User,
  Users,
  Clock,
  CheckCircle,
  Circle,
} from "lucide-react";
import type { RFQ, RFQStatus } from "@/pages/RFQManagement";

interface RFQDetailsProps {
  rfq: RFQ;
  onBack: () => void;
  onViewComparison: () => void;
}

const statusConfig: Record<RFQStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  open: { label: "Open", className: "bg-info/10 text-info" },
  evaluation: { label: "Evaluation", className: "bg-warning/10 text-warning" },
  awarded: { label: "Awarded", className: "bg-success/10 text-success" },
  closed: { label: "Closed", className: "bg-secondary text-secondary-foreground" },
};

const invitedVendors = [
  { id: 1, name: "ABC Metals Pvt Ltd", code: "VND-001", quoteSubmitted: true, quotedPrice: "₹245/kg" },
  { id: 2, name: "Steel Corp India", code: "VND-003", quoteSubmitted: true, quotedPrice: "₹238/kg" },
  { id: 3, name: "XYZ Polymers Ltd", code: "VND-002", quoteSubmitted: true, quotedPrice: "₹252/kg" },
  { id: 4, name: "Metal Works Co", code: "VND-008", quoteSubmitted: true, quotedPrice: "₹241/kg" },
  { id: 5, name: "Prime Suppliers", code: "VND-012", quoteSubmitted: false, quotedPrice: "-" },
];

const timeline = [
  { date: "Dec 01, 2024", event: "RFQ Created", user: "Rahul Sharma", completed: true },
  { date: "Dec 02, 2024", event: "Sent to 5 Vendors", user: "System", completed: true },
  { date: "Dec 05, 2024", event: "First Quote Received", user: "Steel Corp India", completed: true },
  { date: "Dec 08, 2024", event: "4 Quotes Received", user: "Multiple Vendors", completed: true },
  { date: "Dec 15, 2024", event: "Due Date", user: "-", completed: false },
];

export function RFQDetails({ rfq, onBack, onViewComparison }: RFQDetailsProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">{rfq.rfqNo}</h2>
              <Badge className={`${statusConfig[rfq.status].className} border-0`}>
                {statusConfig[rfq.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{rfq.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {rfq.status === "draft" && (
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Send to Vendors
            </Button>
          )}
          {rfq.quotesReceived > 0 && (
            <Button onClick={onViewComparison}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare Quotes
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* RFQ Details Card */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              RFQ Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium text-foreground">{rfq.material}</p>
                <p className="text-xs text-muted-foreground">{rfq.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity Required</p>
                <p className="font-medium text-foreground">
                  {rfq.quantity.toLocaleString()} {rfq.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="font-medium text-foreground">{formatDate(rfq.createdDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium text-foreground">{formatDate(rfq.dueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium text-foreground">{rfq.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specification</p>
                <Button variant="link" className="h-auto p-0 text-primary">
                  View Attachment
                </Button>
              </div>
            </div>
          </div>

          {/* Invited Vendors */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Invited Vendors ({invitedVendors.length})
            </h3>
            <div className="space-y-3">
              {invitedVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={vendor.quoteSubmitted} disabled />
                    <div>
                      <p className="font-medium text-foreground">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {vendor.quoteSubmitted ? (
                      <>
                        <p className="font-medium text-foreground">{vendor.quotedPrice}</p>
                        <p className="text-xs text-success">Quote Submitted</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Vendors Invited</span>
                </div>
                <span className="font-semibold text-foreground">{rfq.invitedVendors}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Quotes Received</span>
                </div>
                <span className="font-semibold text-foreground">{rfq.quotesReceived}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">Quantity</span>
                </div>
                <span className="font-semibold text-foreground">
                  {rfq.quantity.toLocaleString()} {rfq.unit}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Days to Due</span>
                </div>
                <span className="font-semibold text-foreground">
                  {Math.ceil(
                    (new Date(rfq.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    {index < timeline.length - 1 && (
                      <div className="w-px h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    {item.user !== "-" && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {item.user}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
