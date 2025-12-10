import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GateEntrySummary } from "@/components/gate-entry/GateEntrySummary";
import { VehicleRegistry } from "@/components/gate-entry/VehicleRegistry";
import { MaterialTracking } from "@/components/gate-entry/MaterialTracking";
import { VisitorManagement } from "@/components/gate-entry/VisitorManagement";

export interface VehicleEntry {
  id: string;
  vehicleNumber: string;
  vehicleType: "truck" | "van" | "car" | "bike" | "other";
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  purpose: "delivery" | "pickup" | "service" | "visitor" | "employee";
  vendor?: string;
  poNumber?: string;
  entryTime: Date;
  exitTime?: Date;
  status: "in" | "out";
  gateNumber: string;
  remarks?: string;
}

export interface MaterialEntry {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  type: "inward" | "outward";
  materialDescription: string;
  quantity: number;
  unit: string;
  poNumber?: string;
  invoiceNumber?: string;
  vendor?: string;
  department: string;
  receivedBy?: string;
  dispatchedBy?: string;
  timestamp: Date;
  status: "pending" | "verified" | "rejected";
  grnNumber?: string;
  remarks?: string;
}

export interface VisitorEntry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  idType: "aadhar" | "pan" | "driving_license" | "passport" | "employee_id";
  idNumber: string;
  photo?: string;
  purpose: string;
  hostName: string;
  hostDepartment: string;
  entryTime: Date;
  exitTime?: Date;
  status: "checked_in" | "checked_out" | "expected";
  badge?: string;
  vehicleNumber?: string;
  laptop?: boolean;
  laptopSerial?: string;
}

const mockVehicles: VehicleEntry[] = [
  {
    id: "V001",
    vehicleNumber: "MH12AB1234",
    vehicleType: "truck",
    driverName: "Ramesh Kumar",
    driverPhone: "9876543210",
    driverLicense: "MH1220200012345",
    purpose: "delivery",
    vendor: "Steel Corp Ltd",
    poNumber: "PO-2024-0156",
    entryTime: new Date("2024-12-10T08:30:00"),
    status: "in",
    gateNumber: "Gate 1",
  },
  {
    id: "V002",
    vehicleNumber: "GJ05CD5678",
    vehicleType: "van",
    driverName: "Suresh Patel",
    driverPhone: "9123456780",
    driverLicense: "GJ0520190078901",
    purpose: "pickup",
    poNumber: "SO-2024-0089",
    entryTime: new Date("2024-12-10T09:15:00"),
    exitTime: new Date("2024-12-10T11:45:00"),
    status: "out",
    gateNumber: "Gate 2",
  },
  {
    id: "V003",
    vehicleNumber: "MH04EF9012",
    vehicleType: "car",
    driverName: "Amit Singh",
    driverPhone: "9988776655",
    driverLicense: "MH0420180034567",
    purpose: "service",
    vendor: "Tech Solutions",
    entryTime: new Date("2024-12-10T10:00:00"),
    status: "in",
    gateNumber: "Gate 1",
    remarks: "AMC service visit",
  },
];

const mockMaterials: MaterialEntry[] = [
  {
    id: "M001",
    vehicleId: "V001",
    vehicleNumber: "MH12AB1234",
    type: "inward",
    materialDescription: "Steel Sheets 2mm",
    quantity: 500,
    unit: "kg",
    poNumber: "PO-2024-0156",
    invoiceNumber: "INV-SC-2024-789",
    vendor: "Steel Corp Ltd",
    department: "Production",
    receivedBy: "Mahesh Sharma",
    timestamp: new Date("2024-12-10T08:45:00"),
    status: "verified",
    grnNumber: "GRN-2024-0234",
  },
  {
    id: "M002",
    vehicleId: "V002",
    vehicleNumber: "GJ05CD5678",
    type: "outward",
    materialDescription: "Finished Assemblies - Model X",
    quantity: 50,
    unit: "units",
    poNumber: "SO-2024-0089",
    invoiceNumber: "INV-2024-0567",
    department: "Dispatch",
    dispatchedBy: "Rajesh Kumar",
    timestamp: new Date("2024-12-10T11:30:00"),
    status: "verified",
  },
  {
    id: "M003",
    vehicleId: "V001",
    vehicleNumber: "MH12AB1234",
    type: "inward",
    materialDescription: "Aluminum Rods 10mm",
    quantity: 200,
    unit: "kg",
    poNumber: "PO-2024-0156",
    invoiceNumber: "INV-SC-2024-789",
    vendor: "Steel Corp Ltd",
    department: "Production",
    timestamp: new Date("2024-12-10T08:50:00"),
    status: "pending",
  },
];

const mockVisitors: VisitorEntry[] = [
  {
    id: "VS001",
    name: "Priya Sharma",
    phone: "9876543211",
    email: "priya.sharma@techcorp.com",
    company: "Tech Corp Solutions",
    idType: "aadhar",
    idNumber: "1234-5678-9012",
    purpose: "Business Meeting - Q1 Review",
    hostName: "Vikram Mehta",
    hostDepartment: "Sales",
    entryTime: new Date("2024-12-10T09:00:00"),
    status: "checked_in",
    badge: "VB-045",
    laptop: true,
    laptopSerial: "DELL-SVC-78901",
  },
  {
    id: "VS002",
    name: "Arun Joshi",
    phone: "9123456781",
    company: "Audit Associates",
    idType: "pan",
    idNumber: "ABCDE1234F",
    purpose: "Annual Audit",
    hostName: "Sunita Rao",
    hostDepartment: "Finance",
    entryTime: new Date("2024-12-10T10:30:00"),
    exitTime: new Date("2024-12-10T13:00:00"),
    status: "checked_out",
    badge: "VB-046",
  },
  {
    id: "VS003",
    name: "Kiran Desai",
    phone: "9988776656",
    email: "kiran.d@supplier.com",
    company: "Global Suppliers",
    idType: "driving_license",
    idNumber: "GJ0720180045678",
    purpose: "Vendor Registration",
    hostName: "Ankit Patel",
    hostDepartment: "Procurement",
    entryTime: new Date("2024-12-10T14:00:00"),
    status: "expected",
    vehicleNumber: "GJ07GH3456",
  },
];

const GateEntry = () => {
  const [vehicles] = useState<VehicleEntry[]>(mockVehicles);
  const [materials] = useState<MaterialEntry[]>(mockMaterials);
  const [visitors] = useState<VisitorEntry[]>(mockVisitors);

  return (
    <MainLayout
      title="Gate Entry Management"
      subtitle="Vehicle registration, material tracking, and visitor management"
    >
      <div className="space-y-6">
        <GateEntrySummary
          vehicles={vehicles}
          materials={materials}
          visitors={visitors}
        />

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="vehicles">Vehicle Registry</TabsTrigger>
            <TabsTrigger value="materials">Material Tracking</TabsTrigger>
            <TabsTrigger value="visitors">Visitor Management</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <VehicleRegistry vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialTracking materials={materials} />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorManagement visitors={visitors} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GateEntry;
