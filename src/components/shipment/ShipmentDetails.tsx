import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Phone,
  User,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  FileText,
  Upload,
  Calendar,
  Weight,
} from "lucide-react";
import { ShipmentMap } from "./ShipmentMap";
import { ShipmentTimeline } from "./ShipmentTimeline";
import { PODUpload } from "./PODUpload";
import type { Shipment, ShipmentStatus } from "@/pages/ShipmentTracking";

interface ShipmentDetailsProps {
  shipment: Shipment;
  onBack: () => void;
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  picked_up: { label: "Picked Up", className: "bg-info/10 text-info" },
  in_transit: { label: "In Transit", className: "bg-primary/10 text-primary" },
  out_for_delivery: { label: "Out for Delivery", className: "bg-warning/10 text-warning" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success" },
  delayed: { label: "Delayed", className: "bg-destructive/10 text-destructive" },
};

export function ShipmentDetails({ shipment, onBack }: ShipmentDetailsProps) {
  const [showPODUpload, setShowPODUpload] = useState(false);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilETA = (eta: string) => {
    const now = new Date();
    const etaDate = new Date(eta);
    const diff = etaDate.getTime() - now.getTime();

    if (diff < 0) return "Overdue";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes} minutes remaining`;
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
              <h2 className="text-2xl font-bold text-foreground">{shipment.shipmentId}</h2>
              <Badge className={`${statusConfig[shipment.status].className} border-0`}>
                {statusConfig[shipment.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {shipment.poNumber} • {shipment.vendorName}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {shipment.status === "delivered" && !shipment.podDocument && (
            <Button onClick={() => setShowPODUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload POD
            </Button>
          )}
          {shipment.podDocument && (
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View POD
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map & Location */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map */}
          <ShipmentMap shipment={shipment} />

          {/* ETA Card */}
          {shipment.status !== "delivered" && (
            <div className={`rounded-xl p-5 ${shipment.status === "delayed" ? "bg-destructive/10 border border-destructive/20" : "bg-card shadow-card"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {shipment.status === "delayed" ? (
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  ) : (
                    <Clock className="w-6 h-6 text-primary" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                    <p className="text-xl font-bold text-foreground">{formatDateTime(shipment.eta)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${shipment.status === "delayed" ? "text-destructive" : "text-primary"}`}>
                    {getTimeUntilETA(shipment.eta)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Confirmed */}
          {shipment.status === "delivered" && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <div>
                  <p className="font-semibold text-success">Delivered Successfully</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.actualDelivery && formatDateTime(shipment.actualDelivery)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <ShipmentTimeline events={shipment.events} />
        </div>

        {/* Sidebar - Details */}
        <div className="space-y-6">
          {/* Driver Info */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Driver Details
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{shipment.driverName}</p>
                <p className="text-sm text-muted-foreground">{shipment.carrierName}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full" asChild>
              <a href={`tel:${shipment.driverPhone}`}>
                <Phone className="w-4 h-4 mr-2" />
                {shipment.driverPhone}
              </a>
            </Button>
          </div>

          {/* Vehicle Info */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Vehicle Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vehicle No</span>
                <span className="font-medium">{shipment.vehicleNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">{shipment.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Carrier</span>
                <span className="font-medium">{shipment.carrierName}</span>
              </div>
            </div>
          </div>

          {/* Shipment Info */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Shipment Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">PO Number</span>
                <span className="font-medium text-primary">{shipment.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vendor</span>
                <span className="font-medium">{shipment.vendorName}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Weight className="w-3 h-3" /> Weight
                </span>
                <span className="font-medium">{shipment.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="w-3 h-3" /> Packages
                </span>
                <span className="font-medium">{shipment.packages}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Dispatched
                </span>
                <span className="font-medium text-sm">{formatDateTime(shipment.dispatchDate)}</span>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Route
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-success mt-1.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Origin</p>
                  <p className="font-medium">{shipment.origin}</p>
                </div>
              </div>
              <div className="ml-1.5 w-px h-8 bg-border" />
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Destination</p>
                  <p className="font-medium">{shipment.destination}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POD Upload Dialog */}
      <PODUpload open={showPODUpload} onOpenChange={setShowPODUpload} shipmentId={shipment.shipmentId} />
    </div>
  );
}
