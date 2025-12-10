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
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, FileText, Sparkles, TrendingUp, Calendar } from "lucide-react";
import type { InventoryItem } from "@/pages/Inventory";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ReorderSuggestionsProps {
  inventory: InventoryItem[];
}

interface ReorderSuggestion {
  item: InventoryItem;
  suggestedQty: number;
  estimatedCost: number;
  urgency: "critical" | "high" | "medium" | "low";
  daysUntilStockout: number;
  suggestedOrderDate: string;
  reason: string;
}

export function ReorderSuggestions({ inventory }: ReorderSuggestionsProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Generate reorder suggestions based on stock levels and consumption
  const suggestions: ReorderSuggestion[] = inventory
    .filter((item) => item.availableQty <= item.reorderPoint)
    .map((item) => {
      const daysUntilStockout = Math.floor(item.availableQty / item.avgDailyConsumption);
      const suggestedQty = item.maxStock - item.onHandQty;
      const estimatedCost = suggestedQty * item.unitCost;

      let urgency: ReorderSuggestion["urgency"] = "low";
      let reason = "Stock at reorder point";

      if (item.availableQty < item.safetyStock) {
        urgency = "critical";
        reason = "Below safety stock - immediate action required";
      } else if (item.availableQty < item.minStock) {
        urgency = "high";
        reason = "Below minimum stock level";
      } else if (daysUntilStockout <= 7) {
        urgency = "medium";
        reason = `Only ${daysUntilStockout} days of stock remaining`;
      }

      // Calculate suggested order date based on lead time (assuming 7 days average)
      const leadTimeDays = 7;
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() + Math.max(0, daysUntilStockout - leadTimeDays));

      return {
        item,
        suggestedQty,
        estimatedCost,
        urgency,
        daysUntilStockout,
        suggestedOrderDate: orderDate.toISOString().split("T")[0],
        reason,
      };
    })
    .sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

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
    });
  };

  const getUrgencyBadge = (urgency: ReorderSuggestion["urgency"]) => {
    switch (urgency) {
      case "critical":
        return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
      case "high":
        return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "medium":
        return <Badge className="bg-info text-info-foreground">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === suggestions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(suggestions.map((s) => s.item.id));
    }
  };

  const selectedTotal = suggestions
    .filter((s) => selectedItems.includes(s.item.id))
    .reduce((sum, s) => sum + s.estimatedCost, 0);

  const handleCreatePO = () => {
    toast({
      title: "Purchase Orders Created",
      description: `${selectedItems.length} items added to purchase orders.`,
    });
    setSelectedItems([]);
  };

  const handleCreateRFQ = () => {
    toast({
      title: "RFQs Created",
      description: `RFQs created for ${selectedItems.length} items.`,
    });
    setSelectedItems([]);
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-card rounded-xl p-12 shadow-card text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">All Stock Levels Healthy</h3>
        <p className="text-muted-foreground mt-2">
          No materials currently need reordering. All items are above their reorder points.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Items to Reorder</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{suggestions.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Total Estimated Cost</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(suggestions.reduce((sum, s) => sum + s.estimatedCost, 0))}
          </p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-destructive">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Critical Items</span>
          </div>
          <p className="text-2xl font-bold text-destructive">
            {suggestions.filter((s) => s.urgency === "critical").length}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">
              {selectedItems.length} items selected
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated total: {formatCurrency(selectedTotal)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCreateRFQ}>
              <FileText className="w-4 h-4 mr-2" />
              Create RFQ
            </Button>
            <Button onClick={handleCreatePO}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Create PO
            </Button>
          </div>
        </div>
      )}

      {/* Suggestions Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === suggestions.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Suggested Qty</TableHead>
              <TableHead className="text-right">Est. Cost</TableHead>
              <TableHead className="text-right">Days to Stockout</TableHead>
              <TableHead>Order By</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.map((suggestion) => (
              <TableRow
                key={suggestion.item.id}
                className={`hover:bg-secondary/30 ${
                  suggestion.urgency === "critical" ? "bg-destructive/5" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(suggestion.item.id)}
                    onCheckedChange={() => toggleItem(suggestion.item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{suggestion.item.materialName}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.item.materialCode}</p>
                  </div>
                </TableCell>
                <TableCell>{getUrgencyBadge(suggestion.urgency)}</TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">{suggestion.item.availableQty.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs ml-1">{suggestion.item.unit}</span>
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {suggestion.suggestedQty.toLocaleString()} {suggestion.item.unit}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(suggestion.estimatedCost)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${
                      suggestion.daysUntilStockout <= 3
                        ? "text-destructive"
                        : suggestion.daysUntilStockout <= 7
                        ? "text-warning"
                        : "text-foreground"
                    }`}
                  >
                    {suggestion.daysUntilStockout} days
                  </span>
                </TableCell>
                <TableCell>{formatDate(suggestion.suggestedOrderDate)}</TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="text-sm text-muted-foreground truncate">{suggestion.reason}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-primary/5 to-info/5 rounded-xl p-5 border border-primary/10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">AI-Powered Insights</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                • Consider consolidating orders for <strong>Steel Plates</strong> and{" "}
                <strong>Steel Rods</strong> with Steel Corp India for better pricing
              </li>
              <li>
                • <strong>Industrial Adhesive</strong> has slow-moving stock - reduce reorder quantity
                by 20%
              </li>
              <li>
                • Historical data suggests increasing safety stock for <strong>Copper Wire</strong>{" "}
                during Q1
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
