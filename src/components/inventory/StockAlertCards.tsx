import { Package, AlertTriangle, AlertCircle, RefreshCw, IndianRupee } from "lucide-react";

interface StockAlertCardsProps {
  totalItems: number;
  criticalCount: number;
  lowStockCount: number;
  reorderCount: number;
  totalValue: number;
}

export function StockAlertCards({
  totalItems,
  criticalCount,
  lowStockCount,
  reorderCount,
  totalValue,
}: StockAlertCardsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total SKUs</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalItems}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-destructive">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Critical Stock</p>
            <p className="text-2xl font-bold text-destructive mt-1">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Below safety stock</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-warning">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold text-warning mt-1">{lowStockCount}</p>
            <p className="text-xs text-muted-foreground">Below minimum</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-info">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Need Reorder</p>
            <p className="text-2xl font-bold text-info mt-1">{reorderCount}</p>
            <p className="text-xs text-muted-foreground">At reorder point</p>
          </div>
          <div className="p-3 rounded-lg bg-info/10 text-info">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Inventory Value</p>
            <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalValue)}</p>
          </div>
          <div className="p-3 rounded-lg bg-success/10 text-success">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
