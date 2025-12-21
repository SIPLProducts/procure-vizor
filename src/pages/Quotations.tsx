import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText
} from "lucide-react";
import { differenceInDays, format } from "date-fns";

type QuotationStatus = "pending" | "under_review" | "accepted" | "rejected" | "expired";

interface Quotation {
  id: string;
  quotationNo: string;
  rfqNo: string;
  rfqTitle: string;
  vendorName: string;
  vendorCode: string;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  leadTime: number;
  validUntil: string;
  submittedDate: string;
  status: QuotationStatus;
}

const mockQuotations: Quotation[] = [
  {
    id: "1",
    quotationNo: "QT-2024-001",
    rfqNo: "RFQ-2024-001",
    rfqTitle: "Steel Plates 3mm - Q1 Requirement",
    vendorName: "ABC Metals Pvt Ltd",
    vendorCode: "VND-001",
    material: "Steel Plates 3mm",
    quantity: 5000,
    unit: "kg",
    unitPrice: 85,
    totalPrice: 425000,
    leadTime: 14,
    validUntil: "2024-12-25",
    submittedDate: "2024-12-10",
    status: "under_review",
  },
  {
    id: "2",
    quotationNo: "QT-2024-002",
    rfqNo: "RFQ-2024-001",
    rfqTitle: "Steel Plates 3mm - Q1 Requirement",
    vendorName: "Steel Corp India",
    vendorCode: "VND-003",
    material: "Steel Plates 3mm",
    quantity: 5000,
    unit: "kg",
    unitPrice: 82,
    totalPrice: 410000,
    leadTime: 10,
    validUntil: "2024-12-28",
    submittedDate: "2024-12-08",
    status: "pending",
  },
  {
    id: "3",
    quotationNo: "QT-2024-003",
    rfqNo: "RFQ-2024-002",
    rfqTitle: "Packaging Materials - Cartons",
    vendorName: "Pack Solutions",
    vendorCode: "VND-004",
    material: "Corrugated Cartons",
    quantity: 10000,
    unit: "pcs",
    unitPrice: 12,
    totalPrice: 120000,
    leadTime: 7,
    validUntil: "2024-12-30",
    submittedDate: "2024-12-12",
    status: "accepted",
  },
  {
    id: "4",
    quotationNo: "QT-2024-004",
    rfqNo: "RFQ-2024-003",
    rfqTitle: "Industrial Chemicals - Adhesives",
    vendorName: "Chemical Industries",
    vendorCode: "VND-005",
    material: "Industrial Adhesive",
    quantity: 500,
    unit: "liters",
    unitPrice: 450,
    totalPrice: 225000,
    leadTime: 21,
    validUntil: "2024-12-20",
    submittedDate: "2024-12-05",
    status: "rejected",
  },
  {
    id: "5",
    quotationNo: "QT-2024-005",
    rfqNo: "RFQ-2024-001",
    rfqTitle: "Steel Plates 3mm - Q1 Requirement",
    vendorName: "Metal Works Co",
    vendorCode: "VND-008",
    material: "Steel Plates 3mm",
    quantity: 5000,
    unit: "kg",
    unitPrice: 88,
    totalPrice: 440000,
    leadTime: 12,
    validUntil: "2024-12-15",
    submittedDate: "2024-12-01",
    status: "expired",
  },
  {
    id: "6",
    quotationNo: "QT-2024-006",
    rfqNo: "RFQ-2024-002",
    rfqTitle: "Packaging Materials - Cartons",
    vendorName: "Prime Suppliers",
    vendorCode: "VND-012",
    material: "Corrugated Cartons",
    quantity: 10000,
    unit: "pcs",
    unitPrice: 14,
    totalPrice: 140000,
    leadTime: 5,
    validUntil: "2024-12-22",
    submittedDate: "2024-12-14",
    status: "under_review",
  },
];

const statusConfig: Record<QuotationStatus, { label: string; className: string; icon: any }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600", icon: Clock },
  under_review: { label: "Under Review", className: "bg-blue-500/10 text-blue-600", icon: Eye },
  accepted: { label: "Accepted", className: "bg-green-500/10 text-green-600", icon: CheckCircle },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600", icon: XCircle },
  expired: { label: "Expired", className: "bg-gray-500/10 text-gray-600", icon: AlertTriangle },
};

const getAgingBucket = (submittedDate: string) => {
  const days = differenceInDays(new Date(), new Date(submittedDate));
  if (days <= 3) return { label: "0-3 days", className: "bg-green-500/10 text-green-600" };
  if (days <= 7) return { label: "4-7 days", className: "bg-blue-500/10 text-blue-600" };
  if (days <= 14) return { label: "8-14 days", className: "bg-yellow-500/10 text-yellow-600" };
  return { label: "15+ days", className: "bg-red-500/10 text-red-600" };
};

export default function Quotations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredQuotations = mockQuotations.filter((q) => {
    const matchesSearch =
      q.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.rfqNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy");
  };

  // Stats
  const stats = {
    total: mockQuotations.length,
    pending: mockQuotations.filter((q) => q.status === "pending").length,
    underReview: mockQuotations.filter((q) => q.status === "under_review").length,
    accepted: mockQuotations.filter((q) => q.status === "accepted").length,
    totalValue: mockQuotations.reduce((acc, q) => acc + q.totalPrice, 0),
  };

  // Aging breakdown
  const agingStats = {
    "0-3": mockQuotations.filter((q) => differenceInDays(new Date(), new Date(q.submittedDate)) <= 3).length,
    "4-7": mockQuotations.filter((q) => {
      const days = differenceInDays(new Date(), new Date(q.submittedDate));
      return days > 3 && days <= 7;
    }).length,
    "8-14": mockQuotations.filter((q) => {
      const days = differenceInDays(new Date(), new Date(q.submittedDate));
      return days > 7 && days <= 14;
    }).length,
    "15+": mockQuotations.filter((q) => differenceInDays(new Date(), new Date(q.submittedDate)) > 14).length,
  };

  return (
    <MainLayout
      title="Quotations"
      subtitle="Manage and track quotations received from vendors"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Quotations</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Eye className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.underReview}</p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.accepted}</p>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalValue)}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Aging Chart */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Quotation Aging</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-600">{agingStats["0-3"]}</p>
              <p className="text-sm text-muted-foreground">0-3 Days</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-600">{agingStats["4-7"]}</p>
              <p className="text-sm text-muted-foreground">4-7 Days</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-600">{agingStats["8-14"]}</p>
              <p className="text-sm text-muted-foreground">8-14 Days</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-2xl font-bold text-red-600">{agingStats["15+"]}</p>
              <p className="text-sm text-muted-foreground">15+ Days</p>
            </div>
          </div>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search quotations..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Quotation No</TableHead>
                <TableHead>RFQ Reference</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => {
                const StatusIcon = statusConfig[quotation.status].icon;
                const aging = getAgingBucket(quotation.submittedDate);
                return (
                  <TableRow key={quotation.id} className="hover:bg-secondary/30">
                    <TableCell className="font-medium text-primary">
                      {quotation.quotationNo}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{quotation.rfqNo}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {quotation.rfqTitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{quotation.vendorName}</p>
                        <p className="text-xs text-muted-foreground">{quotation.vendorCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{quotation.material}</p>
                      <p className="text-xs text-muted-foreground">
                        {quotation.quantity.toLocaleString()} {quotation.unit}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(quotation.unitPrice)}/{quotation.unit}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatCurrency(quotation.totalPrice)}
                    </TableCell>
                    <TableCell>{quotation.leadTime} days</TableCell>
                    <TableCell>
                      <Badge className={`${aging.className} border-0`}>{aging.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[quotation.status].className} border-0 flex items-center gap-1 w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[quotation.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {quotation.status === "pending" && (
                            <>
                              <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Quotation
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Quotation
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}
