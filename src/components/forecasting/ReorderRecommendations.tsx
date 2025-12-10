import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  AlertTriangle,
  Clock,
  TrendingUp,
  Package,
  ShoppingCart,
  CheckCircle2,
  Info,
} from "lucide-react";
import { ForecastItem } from "@/pages/PurchaseForecasting";
import { toast } from "sonner";

interface ReorderRecommendationsProps {
  items: ForecastItem[];
}

interface Recommendation {
  item: ForecastItem;
  urgency: "critical" | "high" | "medium" | "low";
  suggestedQty: number;
  reason: string;
  daysUntilStockout: number;
  estimatedCost: number;
  savingsOpportunity: number;
}

export const ReorderRecommendations = ({ items }: ReorderRecommendationsProps) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  // Generate AI-style recommendations
  const generateRecommendations = (): Recommendation[] => {
    return items
      .map((item) => {
        const monthlyRate = item.avgMonthlyConsumption;
        const dailyRate = monthlyRate / 30;
        const daysUntilStockout = Math.max(0, Math.floor(item.currentStock / dailyRate));
        const daysUntilReorder = Math.max(
          0,
          Math.floor((item.currentStock - item.reorderPoint) / dailyRate)
        );

        let urgency: "critical" | "high" | "medium" | "low";
        if (daysUntilStockout <= item.leadTimeDays) {
          urgency = "critical";
        } else if (daysUntilReorder <= 7) {
          urgency = "high";
        } else if (daysUntilReorder <= 14) {
          urgency = "medium";
        } else {
          urgency = "low";
        }

        // Calculate optimal order quantity (EOQ-inspired)
        const nextMonthDemand = item.forecastData[0]?.predicted || monthlyRate;
        const suggestedQty = Math.ceil(nextMonthDemand * 1.2 + item.safetyStock);

        // Mock cost calculations
        const unitCost = Math.random() * 500 + 50;
        const estimatedCost = suggestedQty * unitCost;
        const savingsOpportunity = item.trend === "decreasing" ? estimatedCost * 0.1 : 0;

        let reason = "";
        if (urgency === "critical") {
          reason = `Stock will run out before next delivery. Order immediately to avoid production delays.`;
        } else if (urgency === "high") {
          reason = `Approaching reorder point with ${item.trend} demand trend. Order soon to maintain safety stock.`;
        } else if (item.trend === "increasing") {
          reason = `Demand is increasing. Consider ordering extra ${Math.round(
            (nextMonthDemand - monthlyRate) * 0.5
          )} units to prevent shortages.`;
        } else {
          reason = `Stock levels healthy. Monitor for ${
            item.seasonality === "high" ? "seasonal variations" : "demand changes"
          }.`;
        }

        return {
          item,
          urgency,
          suggestedQty,
          reason,
          daysUntilStockout,
          estimatedCost,
          savingsOpportunity,
        };
      })
      .sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
  };

  const recommendations = generateRecommendations();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <Clock className="h-4 w-4" />;
      case "medium":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const handleCreatePO = (recommendation: Recommendation) => {
    toast.success(`Purchase order created for ${recommendation.suggestedQty} units of ${recommendation.item.itemName}`);
  };

  const criticalCount = recommendations.filter((r) => r.urgency === "critical").length;
  const highCount = recommendations.filter((r) => r.urgency === "high").length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Reorder Recommendations
          </CardTitle>
          <CardDescription>
            Smart suggestions based on demand forecasting, lead times, and inventory levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">
                  {criticalCount} Critical
                </span>
              </div>
            )}
            {highCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-500">
                  {highCount} High Priority
                </span>
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Days to Stockout</TableHead>
                  <TableHead>Suggested Qty</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.item.id}>
                    <TableCell>
                      <Badge variant="outline" className={getUrgencyColor(rec.urgency)}>
                        {getUrgencyIcon(rec.urgency)}
                        <span className="ml-1 capitalize">{rec.urgency}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rec.item.itemCode}</p>
                        <p className="text-xs text-muted-foreground">{rec.item.itemName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span>{rec.item.currentStock.toLocaleString()}</span>
                        <Progress
                          value={(rec.item.currentStock / (rec.item.reorderPoint * 2)) * 100}
                          className="h-1.5 w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          rec.daysUntilStockout <= rec.item.leadTimeDays
                            ? "text-red-500 font-medium"
                            : ""
                        }
                      >
                        {rec.daysUntilStockout} days
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {rec.suggestedQty.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ₹{rec.estimatedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRecommendation(rec)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Recommendation Details</DialogTitle>
                              <DialogDescription>
                                AI analysis for {rec.item.itemName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-sm font-medium mb-2">Analysis</p>
                                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border">
                                  <p className="text-xs text-muted-foreground">Lead Time</p>
                                  <p className="font-medium">{rec.item.leadTimeDays} days</p>
                                </div>
                                <div className="p-3 rounded-lg border">
                                  <p className="text-xs text-muted-foreground">Safety Stock</p>
                                  <p className="font-medium">{rec.item.safetyStock} units</p>
                                </div>
                                <div className="p-3 rounded-lg border">
                                  <p className="text-xs text-muted-foreground">Reorder Point</p>
                                  <p className="font-medium">{rec.item.reorderPoint} units</p>
                                </div>
                                <div className="p-3 rounded-lg border">
                                  <p className="text-xs text-muted-foreground">Forecast Confidence</p>
                                  <p className="font-medium">{rec.item.confidence}%</p>
                                </div>
                              </div>
                              {rec.savingsOpportunity > 0 && (
                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                  <p className="text-sm font-medium text-green-600">
                                    💡 Savings Opportunity
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Demand is decreasing. Consider ordering{" "}
                                    {Math.round(rec.suggestedQty * 0.9).toLocaleString()} units
                                    instead to save ~₹
                                    {rec.savingsOpportunity.toLocaleString(undefined, {
                                      maximumFractionDigits: 0,
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" onClick={() => handleCreatePO(rec)}>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Create PO
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bulk Order Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Combine orders from the same category to optimize shipping costs
            </p>
            <div className="space-y-3">
              {["Raw Materials", "Components"].map((category) => {
                const categoryItems = recommendations.filter(
                  (r) => r.item.category === category && r.urgency !== "low"
                );
                if (categoryItems.length < 2) return null;
                const totalCost = categoryItems.reduce((sum, r) => sum + r.estimatedCost, 0);
                return (
                  <div key={category} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-xs text-muted-foreground">
                          {categoryItems.length} items pending
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Combine Orders
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm font-medium">Seasonal Pattern Detected</p>
                <p className="text-xs text-muted-foreground">
                  Cardboard Boxes show high seasonality. Consider pre-ordering for Q4 peak demand.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm font-medium">Vendor Consolidation</p>
                <p className="text-xs text-muted-foreground">
                  3 items can be sourced from a single vendor for better pricing.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-medium">Cost Optimization</p>
                <p className="text-xs text-muted-foreground">
                  Ordering lubricants in bulk (40L) could save 15% per unit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
