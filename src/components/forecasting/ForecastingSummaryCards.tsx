import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Brain, Package, Target } from "lucide-react";
import { ForecastItem } from "@/pages/PurchaseForecasting";

interface ForecastingSummaryCardsProps {
  items: ForecastItem[];
}

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
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Below Reorder Point",
      value: itemsBelowReorder,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Forecast Confidence",
      value: `${avgConfidence}%`,
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Next Month Demand",
      value: totalForecastedDemand.toLocaleString(),
      icon: Target,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Increasing Trends",
      value: increasingTrend,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Decreasing Trends",
      value: decreasingTrend,
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
