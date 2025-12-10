import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { RFQList } from "@/components/rfq/RFQList";
import { RFQDetails } from "@/components/rfq/RFQDetails";
import { CreateRFQDialog } from "@/components/rfq/CreateRFQDialog";
import { QuotationComparison } from "@/components/rfq/QuotationComparison";

export type RFQStatus = "draft" | "open" | "evaluation" | "awarded" | "closed";

export interface RFQ {
  id: string;
  rfqNo: string;
  title: string;
  material: string;
  materialCode: string;
  quantity: number;
  unit: string;
  invitedVendors: number;
  quotesReceived: number;
  status: RFQStatus;
  dueDate: string;
  createdDate: string;
  createdBy: string;
}

const mockRFQs: RFQ[] = [
  {
    id: "1",
    rfqNo: "RFQ-2024-001",
    title: "Steel Plates 3mm - Q1 Requirement",
    material: "Steel Plates 3mm",
    materialCode: "MAT-001",
    quantity: 5000,
    unit: "kg",
    invitedVendors: 5,
    quotesReceived: 4,
    status: "evaluation",
    dueDate: "2024-12-15",
    createdDate: "2024-12-01",
    createdBy: "Rahul Sharma",
  },
  {
    id: "2",
    rfqNo: "RFQ-2024-002",
    title: "Packaging Materials - Cartons",
    material: "Corrugated Cartons",
    materialCode: "MAT-045",
    quantity: 10000,
    unit: "pcs",
    invitedVendors: 8,
    quotesReceived: 6,
    status: "open",
    dueDate: "2024-12-18",
    createdDate: "2024-12-05",
    createdBy: "Priya Patel",
  },
  {
    id: "3",
    rfqNo: "RFQ-2024-003",
    title: "Industrial Chemicals - Adhesives",
    material: "Industrial Adhesive",
    materialCode: "MAT-089",
    quantity: 500,
    unit: "liters",
    invitedVendors: 3,
    quotesReceived: 3,
    status: "awarded",
    dueDate: "2024-12-10",
    createdDate: "2024-11-28",
    createdBy: "Amit Kumar",
  },
  {
    id: "4",
    rfqNo: "RFQ-2024-004",
    title: "PVC Sheets - Production Line 2",
    material: "PVC Sheets 5mm",
    materialCode: "MAT-023",
    quantity: 2000,
    unit: "sqm",
    invitedVendors: 4,
    quotesReceived: 0,
    status: "draft",
    dueDate: "2024-12-20",
    createdDate: "2024-12-08",
    createdBy: "Rahul Sharma",
  },
  {
    id: "5",
    rfqNo: "RFQ-2024-005",
    title: "Copper Wire - Electrical",
    material: "Copper Wire 2.5mm",
    materialCode: "MAT-067",
    quantity: 1000,
    unit: "meters",
    invitedVendors: 6,
    quotesReceived: 5,
    status: "closed",
    dueDate: "2024-12-05",
    createdDate: "2024-11-20",
    createdBy: "Meera Reddy",
  },
];

export default function RFQManagement() {
  const [rfqs] = useState<RFQ[]>(mockRFQs);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [view, setView] = useState<"list" | "details" | "comparison">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleViewDetails = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setView("details");
  };

  const handleViewComparison = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setView("comparison");
  };

  const handleBackToList = () => {
    setSelectedRFQ(null);
    setView("list");
  };

  return (
    <MainLayout
      title="RFQ Management"
      subtitle="Create, manage, and evaluate Request for Quotations"
    >
      <div className="animate-fade-in">
        {view === "list" && (
          <RFQList
            rfqs={rfqs}
            onViewDetails={handleViewDetails}
            onViewComparison={handleViewComparison}
            onCreateNew={() => setCreateDialogOpen(true)}
          />
        )}

        {view === "details" && selectedRFQ && (
          <RFQDetails
            rfq={selectedRFQ}
            onBack={handleBackToList}
            onViewComparison={() => setView("comparison")}
          />
        )}

        {view === "comparison" && selectedRFQ && (
          <QuotationComparison rfq={selectedRFQ} onBack={() => setView("details")} />
        )}

        <CreateRFQDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>
    </MainLayout>
  );
}
