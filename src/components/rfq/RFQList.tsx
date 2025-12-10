import { useState } from "react";
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
import { Search, Plus, Filter, Download, MoreHorizontal, Eye, BarChart3, Send } from "lucide-react";
import type { RFQ, RFQStatus } from "@/pages/RFQManagement";

interface RFQListProps {
  rfqs: RFQ[];
  onViewDetails: (rfq: RFQ) => void;
  onViewComparison: (rfq: RFQ) => void;
  onCreateNew: () => void;
}

const statusConfig: Record<RFQStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  open: { label: "Open", className: "bg-info/10 text-info" },
  evaluation: { label: "Evaluation", className: "bg-warning/10 text-warning" },
  awarded: { label: "Awarded", className: "bg-success/10 text-success" },
  closed: { label: "Closed", className: "bg-secondary text-secondary-foreground" },
};

export function RFQList({ rfqs, onViewDetails, onViewComparison, onCreateNew }: RFQListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.rfqNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search RFQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="evaluation">Evaluation</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
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
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create RFQ
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = rfqs.filter((r) => r.status === status).length;
          return (
            <div
              key={status}
              className="bg-card rounded-lg p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => setStatusFilter(status)}
            >
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-sm text-muted-foreground capitalize">{config.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>RFQ No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Vendors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRFQs.map((rfq) => (
              <TableRow
                key={rfq.id}
                className="hover:bg-secondary/30 cursor-pointer"
                onClick={() => onViewDetails(rfq)}
              >
                <TableCell className="font-medium text-primary">{rfq.rfqNo}</TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">{rfq.title}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{rfq.material}</p>
                    <p className="text-xs text-muted-foreground">{rfq.materialCode}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {rfq.quantity.toLocaleString()} {rfq.unit}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{rfq.quotesReceived}/{rfq.invitedVendors}</span>
                    <span className="text-xs text-muted-foreground">quotes</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusConfig[rfq.status].className} border-0`}>
                    {statusConfig[rfq.status].label}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(rfq.dueDate)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{rfq.createdBy}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(rfq)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {rfq.quotesReceived > 0 && (
                        <DropdownMenuItem onClick={() => onViewComparison(rfq)}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Compare Quotes
                        </DropdownMenuItem>
                      )}
                      {rfq.status === "draft" && (
                        <DropdownMenuItem>
                          <Send className="w-4 h-4 mr-2" />
                          Send to Vendors
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
