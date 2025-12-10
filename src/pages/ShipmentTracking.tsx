import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ShipmentList } from "@/components/shipment/ShipmentList";
import { ShipmentDetails } from "@/components/shipment/ShipmentDetails";

export type ShipmentStatus = "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "delayed";

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  location: string;
  description: string;
  status: ShipmentStatus;
}

export interface Shipment {
  id: string;
  shipmentId: string;
  poNumber: string;
  vendorName: string;
  vendorId: string;
  carrierName: string;
  vehicleNo: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  driverPhoto?: string;
  origin: string;
  destination: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    lastUpdated: string;
  };
  eta: string;
  status: ShipmentStatus;
  dispatchDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  weight: string;
  packages: number;
  events: ShipmentEvent[];
  podDocument?: string;
  podUploadedAt?: string;
}

const mockShipments: Shipment[] = [
  {
    id: "1",
    shipmentId: "SHP-2024-001",
    poNumber: "PO-2024-001",
    vendorName: "Steel Corp India",
    vendorId: "VND-003",
    carrierName: "FastTrack Logistics",
    vehicleNo: "MH-12-AB-1234",
    vehicleType: "20 Ton Truck",
    driverName: "Ramesh Kumar",
    driverPhone: "+91 98765 43210",
    origin: "Pune, Maharashtra",
    destination: "Mumbai, Maharashtra",
    currentLocation: {
      lat: 18.9388,
      lng: 73.0988,
      address: "Near Lonavala, Mumbai-Pune Expressway",
      lastUpdated: "2024-12-10T10:30:00",
    },
    eta: "2024-12-10T14:30:00",
    status: "in_transit",
    dispatchDate: "2024-12-10T06:00:00",
    expectedDelivery: "2024-12-10T14:30:00",
    weight: "5,000 kg",
    packages: 25,
    events: [
      { id: "1", timestamp: "2024-12-10T06:00:00", location: "Pune, Maharashtra", description: "Shipment dispatched from vendor warehouse", status: "picked_up" },
      { id: "2", timestamp: "2024-12-10T06:30:00", location: "Pune, Maharashtra", description: "Vehicle departed from origin", status: "in_transit" },
      { id: "3", timestamp: "2024-12-10T08:15:00", location: "Talegaon, Maharashtra", description: "Crossed Talegaon toll plaza", status: "in_transit" },
      { id: "4", timestamp: "2024-12-10T10:30:00", location: "Near Lonavala", description: "Currently in transit - on schedule", status: "in_transit" },
    ],
  },
  {
    id: "2",
    shipmentId: "SHP-2024-002",
    poNumber: "PO-2024-002",
    vendorName: "Pack Solutions",
    vendorId: "VND-004",
    carrierName: "Express Carriers",
    vehicleNo: "MH-04-CD-5678",
    vehicleType: "10 Ton Truck",
    driverName: "Suresh Patil",
    driverPhone: "+91 98765 43211",
    origin: "Thane, Maharashtra",
    destination: "Mumbai, Maharashtra",
    currentLocation: {
      lat: 19.1860,
      lng: 72.9640,
      address: "Mulund Check Naka, Mumbai",
      lastUpdated: "2024-12-10T11:00:00",
    },
    eta: "2024-12-10T12:00:00",
    status: "out_for_delivery",
    dispatchDate: "2024-12-10T08:00:00",
    expectedDelivery: "2024-12-10T12:00:00",
    weight: "2,500 kg",
    packages: 150,
    events: [
      { id: "1", timestamp: "2024-12-10T08:00:00", location: "Thane, Maharashtra", description: "Shipment picked up from vendor", status: "picked_up" },
      { id: "2", timestamp: "2024-12-10T09:30:00", location: "Thane, Maharashtra", description: "Vehicle departed for delivery", status: "in_transit" },
      { id: "3", timestamp: "2024-12-10T11:00:00", location: "Mulund, Mumbai", description: "Out for final delivery", status: "out_for_delivery" },
    ],
  },
  {
    id: "3",
    shipmentId: "SHP-2024-003",
    poNumber: "PO-2024-003",
    vendorName: "ABC Metals Pvt Ltd",
    vendorId: "VND-001",
    carrierName: "SafeMove Transport",
    vehicleNo: "MH-14-EF-9012",
    vehicleType: "15 Ton Truck",
    driverName: "Prakash Jadhav",
    driverPhone: "+91 98765 43212",
    origin: "Navi Mumbai, Maharashtra",
    destination: "Pune, Maharashtra",
    currentLocation: {
      lat: 18.5204,
      lng: 73.8567,
      address: "Warehouse A, Pune",
      lastUpdated: "2024-12-09T16:00:00",
    },
    eta: "2024-12-09T16:00:00",
    status: "delivered",
    dispatchDate: "2024-12-09T08:00:00",
    expectedDelivery: "2024-12-09T16:00:00",
    actualDelivery: "2024-12-09T15:45:00",
    weight: "3,200 kg",
    packages: 40,
    podDocument: "pod_signed.pdf",
    podUploadedAt: "2024-12-09T15:50:00",
    events: [
      { id: "1", timestamp: "2024-12-09T08:00:00", location: "Navi Mumbai", description: "Shipment dispatched", status: "picked_up" },
      { id: "2", timestamp: "2024-12-09T10:30:00", location: "Mumbai-Pune Expressway", description: "In transit", status: "in_transit" },
      { id: "3", timestamp: "2024-12-09T14:00:00", location: "Pune Outskirts", description: "Approaching destination", status: "in_transit" },
      { id: "4", timestamp: "2024-12-09T15:30:00", location: "Warehouse A, Pune", description: "Arrived at destination", status: "out_for_delivery" },
      { id: "5", timestamp: "2024-12-09T15:45:00", location: "Warehouse A, Pune", description: "Delivered and signed by receiver", status: "delivered" },
    ],
  },
  {
    id: "4",
    shipmentId: "SHP-2024-004",
    poNumber: "PO-2024-004",
    vendorName: "Chemical Industries",
    vendorId: "VND-005",
    carrierName: "HazMat Logistics",
    vehicleNo: "MH-20-GH-3456",
    vehicleType: "Tanker Truck",
    driverName: "Vijay Sharma",
    driverPhone: "+91 98765 43213",
    origin: "Aurangabad, Maharashtra",
    destination: "Mumbai, Maharashtra",
    currentLocation: {
      lat: 19.4315,
      lng: 74.7387,
      address: "Near Ahmednagar, Maharashtra",
      lastUpdated: "2024-12-10T09:00:00",
    },
    eta: "2024-12-10T18:00:00",
    status: "delayed",
    dispatchDate: "2024-12-10T04:00:00",
    expectedDelivery: "2024-12-10T14:00:00",
    weight: "8,000 liters",
    packages: 1,
    events: [
      { id: "1", timestamp: "2024-12-10T04:00:00", location: "Aurangabad", description: "Shipment dispatched", status: "picked_up" },
      { id: "2", timestamp: "2024-12-10T07:00:00", location: "Highway NH-211", description: "In transit", status: "in_transit" },
      { id: "3", timestamp: "2024-12-10T09:00:00", location: "Near Ahmednagar", description: "Delayed due to traffic congestion", status: "delayed" },
    ],
  },
];

export default function ShipmentTracking() {
  const [shipments] = useState<Shipment[]>(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [view, setView] = useState<"list" | "details">("list");

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setView("details");
  };

  const handleBackToList = () => {
    setSelectedShipment(null);
    setView("list");
  };

  return (
    <MainLayout title="Shipment Tracking" subtitle="Track deliveries in real-time">
      <div className="animate-fade-in">
        {view === "list" && (
          <ShipmentList shipments={shipments} onViewDetails={handleViewDetails} />
        )}

        {view === "details" && selectedShipment && (
          <ShipmentDetails shipment={selectedShipment} onBack={handleBackToList} />
        )}
      </div>
    </MainLayout>
  );
}
