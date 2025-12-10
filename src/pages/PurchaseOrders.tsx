import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { POList } from "@/components/purchase-order/POList";
import { PODetails } from "@/components/purchase-order/PODetails";
import { CreatePODialog } from "@/components/purchase-order/CreatePODialog";

export type POStatus = "draft" | "pending" | "approved" | "dispatched" | "delivered" | "cancelled";

export interface LineItem {
  id: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  vendorGST: string;
  deliveryLocation: string;
  paymentTerms: string;
  lineItems: LineItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  expectedDeliveryDate: string;
  status: POStatus;
  createdBy: string;
  notes: string;
}

const mockPOs: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    poDate: "2024-12-01",
    vendorId: "VND-003",
    vendorName: "Steel Corp India",
    vendorAddress: "Plot 45, Industrial Area, Phase 2, Pune 411018",
    vendorGST: "27AABCS1234A1Z5",
    deliveryLocation: "Warehouse A, Mumbai",
    paymentTerms: "Net 30",
    lineItems: [
      { id: "1", materialCode: "MAT-001", materialName: "Steel Plates 3mm", quantity: 5000, unit: "kg", unitPrice: 238, discount: 2, taxRate: 18, total: 1379320 },
      { id: "2", materialCode: "MAT-002", materialName: "Steel Rods 10mm", quantity: 2000, unit: "kg", unitPrice: 195, discount: 0, taxRate: 18, total: 460200 },
    ],
    subtotal: 1580000,
    totalDiscount: 23800,
    totalTax: 283320,
    grandTotal: 1839520,
    expectedDeliveryDate: "2024-12-15",
    status: "approved",
    createdBy: "Rahul Sharma",
    notes: "Urgent requirement for Q1 production",
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    poDate: "2024-12-05",
    vendorId: "VND-004",
    vendorName: "Pack Solutions",
    vendorAddress: "123, Packaging Complex, Thane 400601",
    vendorGST: "27AABCP5678B2Z6",
    deliveryLocation: "Warehouse B, Mumbai",
    paymentTerms: "Net 45",
    lineItems: [
      { id: "1", materialCode: "MAT-045", materialName: "Corrugated Cartons", quantity: 10000, unit: "pcs", unitPrice: 45, discount: 5, taxRate: 12, total: 478800 },
    ],
    subtotal: 450000,
    totalDiscount: 22500,
    totalTax: 51300,
    grandTotal: 478800,
    expectedDeliveryDate: "2024-12-20",
    status: "dispatched",
    createdBy: "Priya Patel",
    notes: "",
  },
  {
    id: "3",
    poNumber: "PO-2024-003",
    poDate: "2024-12-08",
    vendorId: "VND-001",
    vendorName: "ABC Metals Pvt Ltd",
    vendorAddress: "456, Metal Hub, Vashi, Navi Mumbai 400703",
    vendorGST: "27AABCA9012C3Z7",
    deliveryLocation: "Factory Unit 1, Pune",
    paymentTerms: "Net 30",
    lineItems: [
      { id: "1", materialCode: "MAT-067", materialName: "Copper Wire 2.5mm", quantity: 1000, unit: "meters", unitPrice: 125, discount: 0, taxRate: 18, total: 147500 },
    ],
    subtotal: 125000,
    totalDiscount: 0,
    totalTax: 22500,
    grandTotal: 147500,
    expectedDeliveryDate: "2024-12-18",
    status: "pending",
    createdBy: "Amit Kumar",
    notes: "Electrical maintenance requirement",
  },
  {
    id: "4",
    poNumber: "PO-2024-004",
    poDate: "2024-12-10",
    vendorId: "VND-005",
    vendorName: "Chemical Industries",
    vendorAddress: "789, MIDC Industrial Estate, Aurangabad 431001",
    vendorGST: "27AABCC3456D4Z8",
    deliveryLocation: "Warehouse A, Mumbai",
    paymentTerms: "Advance",
    lineItems: [
      { id: "1", materialCode: "MAT-089", materialName: "Industrial Adhesive", quantity: 500, unit: "liters", unitPrice: 320, discount: 0, taxRate: 18, total: 188800 },
    ],
    subtotal: 160000,
    totalDiscount: 0,
    totalTax: 28800,
    grandTotal: 188800,
    expectedDeliveryDate: "2024-12-22",
    status: "draft",
    createdBy: "Rahul Sharma",
    notes: "",
  },
];

export default function PurchaseOrders() {
  const [pos] = useState<PurchaseOrder[]>(mockPOs);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [view, setView] = useState<"list" | "details">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleViewDetails = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setView("details");
  };

  const handleBackToList = () => {
    setSelectedPO(null);
    setView("list");
  };

  return (
    <MainLayout title="Purchase Orders" subtitle="Create and manage purchase orders">
      <div className="animate-fade-in">
        {view === "list" && (
          <POList
            purchaseOrders={pos}
            onViewDetails={handleViewDetails}
            onCreateNew={() => setCreateDialogOpen(true)}
          />
        )}

        {view === "details" && selectedPO && (
          <PODetails po={selectedPO} onBack={handleBackToList} />
        )}

        <CreatePODialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>
    </MainLayout>
  );
}
