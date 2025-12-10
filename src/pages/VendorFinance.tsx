import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InvoiceList } from "@/components/vendor-finance/InvoiceList";
import { InvoiceAgingChart } from "@/components/vendor-finance/InvoiceAgingChart";
import { FinanceSummaryCards } from "@/components/vendor-finance/FinanceSummaryCards";
import { PaymentStatusTracker } from "@/components/vendor-finance/PaymentStatusTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorCode: string;
  poNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: "pending" | "partial" | "paid" | "overdue" | "disputed";
  paymentTerms: string;
  interestRate: number;
  description: string;
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2024-0156",
    vendorName: "ABC Steel Corporation",
    vendorCode: "VND-001",
    poNumber: "PO-2024-0089",
    invoiceDate: new Date("2024-09-15"),
    dueDate: new Date("2024-10-15"),
    amount: 245000,
    paidAmount: 0,
    status: "overdue",
    paymentTerms: "Net 30",
    interestRate: 1.5,
    description: "Steel plates and structural beams",
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2024-0178",
    vendorName: "Global Logistics Ltd",
    vendorCode: "VND-002",
    poNumber: "PO-2024-0102",
    invoiceDate: new Date("2024-10-01"),
    dueDate: new Date("2024-10-31"),
    amount: 78500,
    paidAmount: 30000,
    status: "partial",
    paymentTerms: "Net 30",
    interestRate: 1.5,
    description: "Freight and handling charges",
  },
  {
    id: "INV-003",
    invoiceNumber: "INV-2024-0192",
    vendorName: "TechParts Industries",
    vendorCode: "VND-003",
    poNumber: "PO-2024-0115",
    invoiceDate: new Date("2024-10-20"),
    dueDate: new Date("2024-11-19"),
    amount: 156000,
    paidAmount: 0,
    status: "pending",
    paymentTerms: "Net 30",
    interestRate: 1.5,
    description: "Electronic components",
  },
  {
    id: "INV-004",
    invoiceNumber: "INV-2024-0145",
    vendorName: "Raw Materials Hub",
    vendorCode: "VND-004",
    poNumber: "PO-2024-0078",
    invoiceDate: new Date("2024-08-25"),
    dueDate: new Date("2024-09-24"),
    amount: 320000,
    paidAmount: 0,
    status: "overdue",
    paymentTerms: "Net 30",
    interestRate: 2.0,
    description: "Copper wiring and cables",
  },
  {
    id: "INV-005",
    invoiceNumber: "INV-2024-0201",
    vendorName: "Chemical Solutions Co",
    vendorCode: "VND-005",
    poNumber: "PO-2024-0125",
    invoiceDate: new Date("2024-11-01"),
    dueDate: new Date("2024-12-01"),
    amount: 89000,
    paidAmount: 89000,
    status: "paid",
    paymentTerms: "Net 30",
    interestRate: 1.5,
    description: "Industrial chemicals",
  },
  {
    id: "INV-006",
    invoiceNumber: "INV-2024-0167",
    vendorName: "Precision Tools Inc",
    vendorCode: "VND-006",
    poNumber: "PO-2024-0095",
    invoiceDate: new Date("2024-09-10"),
    dueDate: new Date("2024-10-10"),
    amount: 134500,
    paidAmount: 0,
    status: "overdue",
    paymentTerms: "Net 30",
    interestRate: 1.5,
    description: "Machine tools and equipment",
  },
  {
    id: "INV-007",
    invoiceNumber: "INV-2024-0189",
    vendorName: "SafetyGear Plus",
    vendorCode: "VND-007",
    poNumber: "PO-2024-0110",
    invoiceDate: new Date("2024-10-15"),
    dueDate: new Date("2024-11-14"),
    amount: 45000,
    paidAmount: 0,
    status: "disputed",
    paymentTerms: "Net 30",
    interestRate: 1.0,
    description: "Safety equipment and PPE",
  },
  {
    id: "INV-008",
    invoiceNumber: "INV-2024-0210",
    vendorName: "PackagePro Systems",
    vendorCode: "VND-008",
    poNumber: "PO-2024-0130",
    invoiceDate: new Date("2024-11-05"),
    dueDate: new Date("2024-12-05"),
    amount: 67800,
    paidAmount: 0,
    status: "pending",
    paymentTerms: "Net 30",
    interestRate: 1.5,
    description: "Packaging materials",
  },
];

const VendorFinance = () => {
  const [invoices] = useState<Invoice[]>(mockInvoices);

  return (
    <MainLayout
      title="Vendor Finance"
      subtitle="Track outstanding invoices, interest calculations, and payment status"
    >
      <div className="space-y-6">
        <FinanceSummaryCards invoices={invoices} />

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoice List</TabsTrigger>
            <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
            <TabsTrigger value="payments">Payment Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <InvoiceList invoices={invoices} />
          </TabsContent>

          <TabsContent value="aging">
            <InvoiceAgingChart invoices={invoices} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentStatusTracker invoices={invoices} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default VendorFinance;
