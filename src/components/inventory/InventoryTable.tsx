import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Filter, Download, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import type { InventoryItem } from "@/pages/Inventory";

interface InventoryTableProps {
  inventory: InventoryItem[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStockStatus = (item: InventoryItem) => {
    if (item.availableQty < item.safetyStock) return "critical";
    if (item.availableQty < item.minStock) return "low";
    if (item.availableQty <= item.reorderPoint) return "reorder";
    return "healthy";
  };

  const categories = [...new Set(inventory.map((item) => item.category))];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materialCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || getStockStatus(item) === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <Badge className="bg-destructive/10 text-destructive border-0 gap-1">
            <AlertCircle className="w-3 h-3" />
            Critical
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-warning/10 text-warning border-0 gap-1">
            <AlertTriangle className="w-3 h-3" />
            Low
          </Badge>
        );
      case "reorder":
        return (
          <Badge className="bg-info/10 text-info border-0">
            Reorder
          </Badge>
        );
      default:
        return (
          <Badge className="bg-success/10 text-success border-0 gap-1">
            <CheckCircle className="w-3 h-3" />
            Healthy
          </Badge>
        );
    }
  };

  const getStockLevelBar = (item: InventoryItem) => {
    const percentage = Math.min((item.availableQty / item.maxStock) * 100, 100);
    const safetyPercentage = (item.safetyStock / item.maxStock) * 100;
    const minPercentage = (item.minStock / item.maxStock) * 100;

    let colorClass = "bg-success";
    if (item.availableQty < item.safetyStock) colorClass = "bg-destructive";
    else if (item.availableQty < item.minStock) colorClass = "bg-warning";
    else if (item.availableQty <= item.reorderPoint) colorClass = "bg-info";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-32 relative">
            <Progress value={percentage} className={`h-2 [&>div]:${colorClass}`} />
            <div
              className="absolute top-0 h-2 w-px bg-destructive"
              style={{ left: `${safetyPercentage}%` }}
            />
            <div
              className="absolute top-0 h-2 w-px bg-warning"
              style={{ left: `${minPercentage}%` }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p>Available: {item.availableQty.toLocaleString()} {item.unit}</p>
            <p>Min: {item.minStock.toLocaleString()} | Max: {item.maxStock.toLocaleString()}</p>
            <p>Safety: {item.safetyStock.toLocaleString()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="reorder">Need Reorder</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Material</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">On Hand</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-right">Reorder Point</TableHead>
              <TableHead>Last Receipt</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className="hover:bg-secondary/30">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{item.materialName}</p>
                    <p className="text-xs text-muted-foreground">{item.materialCode}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.onHandQty.toLocaleString()} {item.unit}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.reservedQty.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {item.availableQty.toLocaleString()}
                </TableCell>
                <TableCell>{getStockLevelBar(item)}</TableCell>
                <TableCell className="text-right">
                  {item.reorderPoint.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(item.lastReceiptDate)}
                </TableCell>
                <TableCell>{getStatusBadge(getStockStatus(item))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
