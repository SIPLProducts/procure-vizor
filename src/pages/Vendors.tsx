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
import { Search, Plus, Filter, Download, MoreHorizontal } from "lucide-react";

const vendors = [
  {
    id: 1,
    name: "ABC Metals Pvt Ltd",
    code: "VND-001",
    category: "Raw Materials",
    materialGroup: "Metals",
    kycStatus: "verified",
    msme: true,
    riskScore: 15,
    vendorAge: "5 years",
    outstanding: "₹12.5 L",
    performance: 92,
    contact: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@abcmetals.com",
  },
  {
    id: 2,
    name: "XYZ Polymers Ltd",
    code: "VND-002",
    category: "Raw Materials",
    materialGroup: "Polymers",
    kycStatus: "verified",
    msme: false,
    riskScore: 22,
    vendorAge: "3 years",
    outstanding: "₹8.2 L",
    performance: 88,
    contact: "Priya Sharma",
    phone: "+91 98765 43211",
    email: "priya@xyzpolymers.com",
  },
  {
    id: 3,
    name: "Steel Corp India",
    code: "VND-003",
    category: "Raw Materials",
    materialGroup: "Metals",
    kycStatus: "pending",
    msme: true,
    riskScore: 45,
    vendorAge: "1 year",
    outstanding: "₹5.8 L",
    performance: 75,
    contact: "Amit Patel",
    phone: "+91 98765 43212",
    email: "amit@steelcorp.in",
  },
  {
    id: 4,
    name: "Pack Solutions",
    code: "VND-004",
    category: "Packaging",
    materialGroup: "Cartons",
    kycStatus: "verified",
    msme: true,
    riskScore: 8,
    vendorAge: "7 years",
    outstanding: "₹3.1 L",
    performance: 96,
    contact: "Meera Reddy",
    phone: "+91 98765 43213",
    email: "meera@packsolutions.com",
  },
  {
    id: 5,
    name: "Chemical Industries",
    code: "VND-005",
    category: "Chemicals",
    materialGroup: "Industrial",
    kycStatus: "expired",
    msme: false,
    riskScore: 68,
    vendorAge: "2 years",
    outstanding: "₹18.4 L",
    performance: 72,
    contact: "Suresh Menon",
    phone: "+91 98765 43214",
    email: "suresh@chemindustries.com",
  },
];

const getKYCBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-success/10 text-success border-0">Verified</Badge>;
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-0">Pending</Badge>;
    case "expired":
      return <Badge className="bg-destructive/10 text-destructive border-0">Expired</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getPerformanceBadge = (score: number) => {
  if (score >= 90) return <Badge className="bg-success/10 text-success border-0">{score}%</Badge>;
  if (score >= 80) return <Badge className="bg-info/10 text-info border-0">{score}%</Badge>;
  if (score >= 70) return <Badge className="bg-warning/10 text-warning border-0">{score}%</Badge>;
  return <Badge className="bg-destructive/10 text-destructive border-0">{score}%</Badge>;
};

const getRiskBadge = (score: number) => {
  if (score <= 20) return <Badge className="bg-success/10 text-success border-0">Low</Badge>;
  if (score <= 50) return <Badge className="bg-warning/10 text-warning border-0">Medium</Badge>;
  return <Badge className="bg-destructive/10 text-destructive border-0">High</Badge>;
};

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Vendor Management" subtitle="Manage and monitor your vendor network">
      <div className="space-y-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raw-materials">Raw Materials</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
                <SelectItem value="chemicals">Chemicals</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>MSME</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-secondary/30 cursor-pointer">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{vendor.category}</p>
                      <p className="text-xs text-muted-foreground">{vendor.materialGroup}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getKYCBadge(vendor.kycStatus)}</TableCell>
                  <TableCell>
                    {vendor.msme ? (
                      <Badge variant="secondary">MSME</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getRiskBadge(vendor.riskScore)}</TableCell>
                  <TableCell className="font-medium">{vendor.outstanding}</TableCell>
                  <TableCell>{getPerformanceBadge(vendor.performance)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{vendor.contact}</p>
                      <p className="text-xs text-muted-foreground">{vendor.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
