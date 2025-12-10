import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MapPin, Clock, Truck, Package, CheckCircle, AlertTriangle } from "lucide-react";
import type { Shipment, ShipmentStatus } from "@/pages/ShipmentTracking";

interface ShipmentListProps {
  shipments: Shipment[];
  onViewDetails: (shipment: Shipment) => void;
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground", icon: <Clock className="w-3 h-3" /> },
  picked_up: { label: "Picked Up", className: "bg-info/10 text-info", icon: <Package className="w-3 h-3" /> },
  in_transit: { label: "In Transit", className: "bg-primary/10 text-primary", icon: <Truck className="w-3 h-3" /> },
  out_for_delivery: { label: "Out for Delivery", className: "bg-warning/10 text-warning", icon: <MapPin className="w-3 h-3" /> },
  delivered: { label: "Delivered", className: "bg-success/10 text-success", icon: <CheckCircle className="w-3 h-3" /> },
  delayed: { label: "Delayed", className: "bg-destructive/10 text-destructive", icon: <AlertTriangle className="w-3 h-3" /> },
};

export function ShipmentList({ shipments, onViewDetails }: ShipmentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
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
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const inTransitCount = shipments.filter((s) => s.status === "in_transit").length;
  const delayedCount = shipments.filter((s) => s.status === "delayed").length;
  const deliveredToday = shipments.filter((s) => {
    if (s.status !== "delivered" || !s.actualDelivery) return false;
    const today = new Date().toDateString();
    return new Date(s.actualDelivery).toDateString() === today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inTransitCount}</p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-destructive">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{delayedCount}</p>
              <p className="text-sm text-muted-foreground">Delayed</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10 text-success">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{deliveredToday}</p>
              <p className="text-sm text-muted-foreground">Delivered Today</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-info/10 text-info">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{shipments.length}</p>
              <p className="text-sm text-muted-foreground">Total Shipments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Shipment ID</TableHead>
              <TableHead>PO / Vendor</TableHead>
              <TableHead>Carrier / Vehicle</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Current Location</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow
                key={shipment.id}
                className="hover:bg-secondary/30 cursor-pointer"
                onClick={() => onViewDetails(shipment)}
              >
                <TableCell className="font-medium text-primary">{shipment.shipmentId}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{shipment.poNumber}</p>
                    <p className="text-xs text-muted-foreground">{shipment.vendorName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{shipment.carrierName}</p>
                    <p className="text-xs text-muted-foreground">{shipment.vehicleNo}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-muted-foreground">{shipment.origin}</p>
                    <p className="text-foreground">→ {shipment.destination}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground max-w-[150px] truncate">
                      {shipment.currentLocation.address}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {shipment.status === "delivered" ? (
                    <span className="text-sm text-success">Delivered</span>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">{formatDateTime(shipment.eta)}</p>
                      <p className={`text-xs ${shipment.status === "delayed" ? "text-destructive" : "text-muted-foreground"}`}>
                        {getTimeUntilETA(shipment.eta)}
                      </p>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`${statusConfig[shipment.status].className} border-0 gap-1`}>
                    {statusConfig[shipment.status].icon}
                    {statusConfig[shipment.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
