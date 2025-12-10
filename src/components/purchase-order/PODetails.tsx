import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  MapPin,
  Printer,
  Send,
  Truck,
} from "lucide-react";
import type { PurchaseOrder, POStatus } from "@/pages/PurchaseOrders";
import { toast } from "@/hooks/use-toast";

interface PODetailsProps {
  po: PurchaseOrder;
  onBack: () => void;
}

const statusConfig: Record<POStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending: { label: "Pending Approval", className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  dispatched: { label: "Dispatched", className: "bg-info/10 text-info" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

export function PODetails({ po, onBack }: PODetailsProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export Started",
      description: "Your purchase order PDF is being generated...",
    });
    // In a real app, this would generate a PDF using a library like jsPDF or html2pdf
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Purchase order has been exported successfully.",
      });
    }, 1500);
  };

  const handleSendToVendor = () => {
    toast({
      title: "PO Sent to Vendor",
      description: `Purchase order ${po.poNumber} has been sent to ${po.vendorName}.`,
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
              <h2 className="text-2xl font-bold text-foreground">{po.poNumber}</h2>
              <Badge className={`${statusConfig[po.status].className} border-0`}>
                {statusConfig[po.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Created on {formatDate(po.poDate)} by {po.createdBy}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {po.status === "approved" && (
            <Button onClick={handleSendToVendor}>
              <Send className="w-4 h-4 mr-2" />
              Send to Vendor
            </Button>
          )}
        </div>
      </div>

      {/* PO Document */}
      <div ref={printRef} className="bg-card rounded-xl shadow-card overflow-hidden print:shadow-none">
        {/* Document Header */}
        <div className="bg-primary/5 p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Building2 className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sharvi Industries</h1>
                <p className="text-sm text-muted-foreground">Purchase Order</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{po.poNumber}</p>
              <p className="text-sm text-muted-foreground">Date: {formatDate(po.poDate)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Vendor & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Vendor Details
              </h3>
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="font-semibold text-foreground">{po.vendorName}</p>
                <p className="text-sm text-muted-foreground mt-1">{po.vendorAddress}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">GST:</span> {po.vendorGST}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Delivery Details
              </h3>
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-foreground">{po.deliveryLocation}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">
                    <span className="text-muted-foreground">Expected:</span>{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(po.expectedDeliveryDate)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">
                    <span className="text-muted-foreground">Payment:</span>{" "}
                    <span className="font-medium text-foreground">{po.paymentTerms}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Order Items
            </h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Item Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {po.lineItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.materialName}</p>
                          <p className="text-xs text-muted-foreground">{item.materialCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity.toLocaleString()} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">
                        {item.discount > 0 ? `${item.discount}%` : "-"}
                      </TableCell>
                      <TableCell className="text-right">{item.taxRate}%</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(po.subtotal)}</span>
              </div>
              {po.totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Discount</span>
                  <span className="font-medium text-success">
                    -{formatCurrency(po.totalDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (GST)</span>
                <span className="font-medium">{formatCurrency(po.totalTax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Grand Total</span>
                <span className="font-bold text-primary">{formatCurrency(po.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Terms & Conditions
            </h3>
            <div className="bg-secondary/30 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
              <p>1. Goods must be delivered to the specified location by the expected delivery date.</p>
              <p>2. Quality should conform to the specifications provided in the RFQ.</p>
              <p>3. Invoice must include PO number, GST details, and delivery challan.</p>
              <p>4. Payment will be processed as per the agreed payment terms after goods inspection.</p>
              <p>5. Any deviation from the order specifications must be communicated in writing.</p>
              <p>6. Supplier must provide test certificates and quality documentation where applicable.</p>
            </div>
          </div>

          {/* Notes */}
          {po.notes && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Notes
              </h3>
              <p className="text-sm text-foreground">{po.notes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="h-16 border-b border-border mb-2" />
              <p className="text-sm text-muted-foreground">Prepared By</p>
            </div>
            <div className="text-center">
              <div className="h-16 border-b border-border mb-2" />
              <p className="text-sm text-muted-foreground">Approved By</p>
            </div>
            <div className="text-center">
              <div className="h-16 border-b border-border mb-2" />
              <p className="text-sm text-muted-foreground">Vendor Acknowledgement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Order Status
        </h3>
        <div className="flex items-center justify-between">
          {["draft", "pending", "approved", "dispatched", "delivered"].map((status, index) => {
            const isActive = ["draft", "pending", "approved", "dispatched", "delivered"].indexOf(po.status) >= index;
            return (
              <div key={status} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                  </div>
                  <p className={`text-xs mt-2 capitalize ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {status}
                  </p>
                </div>
                {index < 4 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${isActive ? "bg-success" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
