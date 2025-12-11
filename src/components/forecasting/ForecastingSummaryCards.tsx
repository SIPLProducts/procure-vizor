import { TrendingUp, TrendingDown, AlertTriangle, Brain, Package, Target, LucideIcon } from "lucide-react";
import { ForecastItem } from "@/pages/PurchaseForecasting";
import { cn } from "@/lib/utils";

interface ForecastingSummaryCardsProps {
  items: ForecastItem[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  iconShadow: string;
  titleColor: string;
}

const StatCard = ({ title, value, icon: Icon, gradient, iconShadow, titleColor }: StatCardProps) => (
  <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className={cn("text-xs font-bold uppercase tracking-wider", titleColor)}>
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
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

export const ForecastingSummaryCards = ({ items }: ForecastingSummaryCardsProps) => {
  const itemsBelowReorder = items.filter(
    (item) => item.currentStock <= item.reorderPoint
  ).length;

  const avgConfidence = Math.round(
    items.reduce((sum, item) => sum + item.confidence, 0) / items.length
  );

  const increasingTrend = items.filter((item) => item.trend === "increasing").length;
  const decreasingTrend = items.filter((item) => item.trend === "decreasing").length;

  const totalForecastedDemand = items.reduce((sum, item) => {
    const nextMonthDemand = item.forecastData[0]?.predicted || 0;
    return sum + nextMonthDemand;
  }, 0);

  const cards = [
    {
      title: "Items Tracked",
      value: items.length,
      icon: Package,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconShadow: "shadow-blue-500/30",
      titleColor: "text-blue-600",
    },
    {
      title: "Below Reorder",
      value: itemsBelowReorder,
      icon: AlertTriangle,
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconShadow: "shadow-amber-500/30",
      titleColor: "text-amber-600",
    },
    {
      title: "Confidence",
      value: `${avgConfidence}%`,
      icon: Brain,
      gradient: "bg-gradient-to-br from-blue-400 to-sky-500",
      iconShadow: "shadow-sky-500/30",
      titleColor: "text-sky-600",
    },
    {
      title: "Next Month",
      value: totalForecastedDemand.toLocaleString(),
      icon: Target,
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-600",
      iconShadow: "shadow-indigo-500/30",
      titleColor: "text-indigo-600",
    },
    {
      title: "Increasing",
      value: increasingTrend,
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
      iconShadow: "shadow-emerald-500/30",
      titleColor: "text-emerald-600",
    },
    {
      title: "Decreasing",
      value: decreasingTrend,
      icon: TrendingDown,
      gradient: "bg-gradient-to-br from-red-400 to-rose-500",
      iconShadow: "shadow-red-500/30",
      titleColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};
