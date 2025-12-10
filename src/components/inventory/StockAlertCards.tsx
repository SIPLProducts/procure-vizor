import { Package, AlertTriangle, AlertCircle, RefreshCw, IndianRupee, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockAlertCardsProps {
  totalItems: number;
  criticalCount: number;
  lowStockCount: number;
  reorderCount: number;
  totalValue: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  iconShadow: string;
  titleColor: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, gradient, iconShadow, titleColor }: StatCardProps) => (
  <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className={cn("text-xs font-bold uppercase tracking-wider", titleColor)}>
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className={cn(
        "p-3 rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105",
        gradient,
        iconShadow
      )}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

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

  const cards = [
    {
      title: "Total SKUs",
      value: totalItems,
      icon: Package,
      gradient: "bg-gradient-to-br from-blue-400 to-cyan-500",
      iconShadow: "shadow-blue-500/30",
      titleColor: "text-blue-600",
    },
    {
      title: "Critical Stock",
      value: criticalCount,
      subtitle: "Below safety stock",
      icon: AlertCircle,
      gradient: "bg-gradient-to-br from-red-400 to-rose-500",
      iconShadow: "shadow-red-500/30",
      titleColor: "text-red-600",
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      subtitle: "Below minimum",
      icon: AlertTriangle,
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconShadow: "shadow-amber-500/30",
      titleColor: "text-amber-600",
    },
    {
      title: "Need Reorder",
      value: reorderCount,
      subtitle: "At reorder point",
      icon: RefreshCw,
      gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
      iconShadow: "shadow-cyan-500/30",
      titleColor: "text-cyan-600",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalValue),
      icon: IndianRupee,
      gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
      iconShadow: "shadow-green-500/30",
      titleColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
