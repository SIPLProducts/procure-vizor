import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  // Weighbridge fields
  entryWeight?: number;
  exitWeight?: number;
  netWeight?: number;
  // Photo capture fields
  driverPhoto?: string;
  vehiclePhoto?: string;
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

interface GateEntryContextType {
  vehicles: VehicleEntry[];
  materials: MaterialEntry[];
  visitors: VisitorEntry[];
  addVehicle: (vehicle: Omit<VehicleEntry, "id">) => void;
  updateVehicle: (id: string, updates: Partial<VehicleEntry>) => void;
  addMaterial: (material: Omit<MaterialEntry, "id">) => void;
  updateMaterial: (id: string, updates: Partial<MaterialEntry>) => void;
  addVisitor: (visitor: Omit<VisitorEntry, "id">) => void;
  updateVisitor: (id: string, updates: Partial<VisitorEntry>) => void;
}

const GateEntryContext = createContext<GateEntryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  vehicles: "gate_entry_vehicles",
  materials: "gate_entry_materials",
  visitors: "gate_entry_visitors",
};

// Helper to serialize dates for localStorage
const serializeData = <T,>(data: T): string => JSON.stringify(data);

// Helper to deserialize dates from localStorage
const deserializeVehicles = (data: string): VehicleEntry[] => {
  const parsed = JSON.parse(data);
  return parsed.map((v: any) => ({
    ...v,
    entryTime: new Date(v.entryTime),
    exitTime: v.exitTime ? new Date(v.exitTime) : undefined,
  }));
};

const deserializeMaterials = (data: string): MaterialEntry[] => {
  const parsed = JSON.parse(data);
  return parsed.map((m: any) => ({
    ...m,
    timestamp: new Date(m.timestamp),
  }));
};

const deserializeVisitors = (data: string): VisitorEntry[] => {
  const parsed = JSON.parse(data);
  return parsed.map((v: any) => ({
    ...v,
    entryTime: new Date(v.entryTime),
    exitTime: v.exitTime ? new Date(v.exitTime) : undefined,
  }));
};

// Sample data
const sampleVehicles: VehicleEntry[] = [
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

const sampleMaterials: MaterialEntry[] = [
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

const sampleVisitors: VisitorEntry[] = [
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

export const GateEntryProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<VehicleEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.vehicles);
    return stored ? deserializeVehicles(stored) : sampleVehicles;
  });

  const [materials, setMaterials] = useState<MaterialEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.materials);
    return stored ? deserializeMaterials(stored) : sampleMaterials;
  });

  const [visitors, setVisitors] = useState<VisitorEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.visitors);
    return stored ? deserializeVisitors(stored) : sampleVisitors;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.vehicles, serializeData(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.materials, serializeData(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.visitors, serializeData(visitors));
  }, [visitors]);

  const addVehicle = (vehicle: Omit<VehicleEntry, "id">) => {
    const newVehicle = { ...vehicle, id: `V${Date.now()}` };
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const updateVehicle = (id: string, updates: Partial<VehicleEntry>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const addMaterial = (material: Omit<MaterialEntry, "id">) => {
    const newMaterial = { ...material, id: `M${Date.now()}` };
    setMaterials((prev) => [newMaterial, ...prev]);
  };

  const updateMaterial = (id: string, updates: Partial<MaterialEntry>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const addVisitor = (visitor: Omit<VisitorEntry, "id">) => {
    const newVisitor = { ...visitor, id: `VS${Date.now()}` };
    setVisitors((prev) => [newVisitor, ...prev]);
  };

  const updateVisitor = (id: string, updates: Partial<VisitorEntry>) => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  return (
    <GateEntryContext.Provider
      value={{
        vehicles,
        materials,
        visitors,
        addVehicle,
        updateVehicle,
        addMaterial,
        updateMaterial,
        addVisitor,
        updateVisitor,
      }}
    >
      {children}
    </GateEntryContext.Provider>
  );
};

export const useGateEntry = () => {
  const context = useContext(GateEntryContext);
  if (!context) {
    throw new Error("useGateEntry must be used within a GateEntryProvider");
  }
  return context;
};
