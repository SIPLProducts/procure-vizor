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
import { ArrowLeft, Award, CheckCircle, Download, FileText, XCircle } from "lucide-react";
import type { RFQ } from "@/pages/RFQManagement";

interface QuotationComparisonProps {
  rfq: RFQ;
  onBack: () => void;
}

interface Quotation {
  id: number;
  vendorName: string;
  vendorCode: string;
  unitPrice: number;
  leadTime: number;
  qualityScore: number;
  performanceScore: number;
  weightedScore: number;
  rank: "L1" | "L2" | "L3" | "L4";
  complianceStatus: "compliant" | "partial" | "non-compliant";
  hasAttachments: boolean;
  notes: string;
}

const quotations: Quotation[] = [
  {
    id: 1,
    vendorName: "Steel Corp India",
    vendorCode: "VND-003",
    unitPrice: 238,
    leadTime: 10,
    qualityScore: 92,
    performanceScore: 88,
    weightedScore: 94.5,
    rank: "L1",
    complianceStatus: "compliant",
    hasAttachments: true,
    notes: "Preferred vendor for metals",
  },
  {
    id: 2,
    vendorName: "Metal Works Co",
    vendorCode: "VND-008",
    unitPrice: 241,
    leadTime: 12,
    qualityScore: 90,
    performanceScore: 85,
    weightedScore: 91.2,
    rank: "L2",
    complianceStatus: "compliant",
    hasAttachments: true,
    notes: "",
  },
  {
    id: 3,
    vendorName: "ABC Metals Pvt Ltd",
    vendorCode: "VND-001",
    unitPrice: 245,
    leadTime: 8,
    qualityScore: 95,
    performanceScore: 92,
    weightedScore: 89.8,
    rank: "L3",
    complianceStatus: "compliant",
    hasAttachments: true,
    notes: "Fastest delivery",
  },
  {
    id: 4,
    vendorName: "XYZ Polymers Ltd",
    vendorCode: "VND-002",
    unitPrice: 252,
    leadTime: 14,
    qualityScore: 88,
    performanceScore: 82,
    weightedScore: 85.4,
    rank: "L4",
    complianceStatus: "partial",
    hasAttachments: false,
    notes: "Missing quality cert",
  },
];

const weightage = {
  price: 40,
  leadTime: 20,
  quality: 25,
  performance: 15,
};

const getRankBadge = (rank: Quotation["rank"]) => {
  const styles = {
    L1: "bg-success text-success-foreground",
    L2: "bg-info text-info-foreground",
    L3: "bg-warning text-warning-foreground",
    L4: "bg-muted text-muted-foreground",
  };
  return <Badge className={`${styles[rank]} border-0 font-bold`}>{rank}</Badge>;
};

const getComplianceBadge = (status: Quotation["complianceStatus"]) => {
  switch (status) {
    case "compliant":
      return (
        <div className="flex items-center gap-1 text-success">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Compliant</span>
        </div>
      );
    case "partial":
      return (
        <div className="flex items-center gap-1 text-warning">
          <XCircle className="w-4 h-4" />
          <span className="text-sm">Partial</span>
        </div>
      );
    case "non-compliant":
      return (
        <div className="flex items-center gap-1 text-destructive">
          <XCircle className="w-4 h-4" />
          <span className="text-sm">Non-Compliant</span>
        </div>
      );
  }
};

export function QuotationComparison({ rfq, onBack }: QuotationComparisonProps) {
  const lowestPrice = Math.min(...quotations.map((q) => q.unitPrice));
  const shortestLead = Math.min(...quotations.map((q) => q.leadTime));
  const highestQuality = Math.max(...quotations.map((q) => q.qualityScore));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Quotation Comparison</h2>
            <p className="text-muted-foreground mt-1">
              {rfq.rfqNo} - {rfq.title}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Award className="w-4 h-4 mr-2" />
            Award RFQ
          </Button>
        </div>
      </div>

      {/* Weightage Info */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">Scoring Weightage</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Price: {weightage.price}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span className="text-sm text-muted-foreground">Lead Time: {weightage.leadTime}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Quality: {weightage.quality}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Performance: {weightage.performance}%</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Rank</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Unit Price (₹)</TableHead>
              <TableHead className="text-right">Lead Time (Days)</TableHead>
              <TableHead className="text-right">Quality Score</TableHead>
              <TableHead className="text-right">Performance Score</TableHead>
              <TableHead className="text-right">Weighted Score</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((quote) => (
              <TableRow
                key={quote.id}
                className={quote.rank === "L1" ? "bg-success/5" : "hover:bg-secondary/30"}
              >
                <TableCell>{getRankBadge(quote.rank)}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{quote.vendorName}</p>
                    <p className="text-xs text-muted-foreground">{quote.vendorCode}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold ${
                      quote.unitPrice === lowestPrice ? "text-success" : "text-foreground"
                    }`}
                  >
                    ₹{quote.unitPrice}
                  </span>
                  {quote.unitPrice === lowestPrice && (
                    <Badge className="ml-2 bg-success/10 text-success border-0 text-xs">Lowest</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${
                      quote.leadTime === shortestLead ? "text-success" : "text-foreground"
                    }`}
                  >
                    {quote.leadTime}
                  </span>
                  {quote.leadTime === shortestLead && (
                    <Badge className="ml-2 bg-success/10 text-success border-0 text-xs">Fastest</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${
                      quote.qualityScore === highestQuality ? "text-success" : "text-foreground"
                    }`}
                  >
                    {quote.qualityScore}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{quote.performanceScore}%</TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-lg text-foreground">{quote.weightedScore}</span>
                </TableCell>
                <TableCell>{getComplianceBadge(quote.complianceStatus)}</TableCell>
                <TableCell>
                  {quote.hasAttachments ? (
                    <Button variant="ghost" size="sm" className="text-primary">
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[150px]">
                  <p className="text-sm text-muted-foreground truncate">{quote.notes || "-"}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-success">
          <h4 className="text-sm font-medium text-muted-foreground">Recommended Vendor (L1)</h4>
          <p className="text-xl font-bold text-foreground mt-2">{quotations[0].vendorName}</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="text-muted-foreground">
              Price: <span className="font-medium text-foreground">₹{quotations[0].unitPrice}</span>
            </span>
            <span className="text-muted-foreground">
              Lead: <span className="font-medium text-foreground">{quotations[0].leadTime} days</span>
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card">
          <h4 className="text-sm font-medium text-muted-foreground">Potential Savings</h4>
          <p className="text-xl font-bold text-success mt-2">
            ₹{((quotations[3].unitPrice - quotations[0].unitPrice) * rfq.quantity).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            vs highest quote ({quotations[3].vendorName})
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card">
          <h4 className="text-sm font-medium text-muted-foreground">Total Order Value</h4>
          <p className="text-xl font-bold text-foreground mt-2">
            ₹{(quotations[0].unitPrice * rfq.quantity).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {rfq.quantity.toLocaleString()} {rfq.unit} @ ₹{quotations[0].unitPrice}/{rfq.unit}
          </p>
        </div>
      </div>
    </div>
  );
}
