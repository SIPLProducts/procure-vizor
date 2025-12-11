import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemandPredictionChart } from "@/components/forecasting/DemandPredictionChart";
import { HistoricalConsumptionChart } from "@/components/forecasting/HistoricalConsumptionChart";
import { ReorderRecommendations } from "@/components/forecasting/ReorderRecommendations";
import { ForecastingSummaryCards } from "@/components/forecasting/ForecastingSummaryCards";

export interface ForecastItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  avgMonthlyConsumption: number;
  leadTimeDays: number;
  safetyStock: number;
  reorderPoint: number;
  historicalData: { month: string; consumption: number }[];
  forecastData: { month: string; predicted: number; lower: number; upper: number }[];
  confidence: number;
  trend: "increasing" | "decreasing" | "stable";
  seasonality: "high" | "medium" | "low";
}

const mockForecastItems: ForecastItem[] = [
  {
    id: "1",
    itemCode: "RM-STL-001",
    itemName: "Steel Sheets (2mm)",
    category: "Raw Materials",
    currentStock: 450,
    avgMonthlyConsumption: 120,
    leadTimeDays: 14,
    safetyStock: 60,
    reorderPoint: 120,
    historicalData: [
      { month: "Jul 2024", consumption: 95 },
      { month: "Aug 2024", consumption: 110 },
      { month: "Sep 2024", consumption: 125 },
      { month: "Oct 2024", consumption: 130 },
      { month: "Nov 2024", consumption: 115 },
      { month: "Dec 2024", consumption: 140 },
    ],
    forecastData: [
      { month: "Jan 2025", predicted: 135, lower: 120, upper: 150 },
      { month: "Feb 2025", predicted: 140, lower: 125, upper: 155 },
      { month: "Mar 2025", predicted: 145, lower: 130, upper: 160 },
    ],
    confidence: 85,
    trend: "increasing",
    seasonality: "medium",
  },
  {
    id: "2",
    itemCode: "RM-ALU-002",
    itemName: "Aluminum Rods (10mm)",
    category: "Raw Materials",
    currentStock: 280,
    avgMonthlyConsumption: 85,
    leadTimeDays: 10,
    safetyStock: 40,
    reorderPoint: 70,
    historicalData: [
      { month: "Jul 2024", consumption: 80 },
      { month: "Aug 2024", consumption: 88 },
      { month: "Sep 2024", consumption: 82 },
      { month: "Oct 2024", consumption: 90 },
      { month: "Nov 2024", consumption: 85 },
      { month: "Dec 2024", consumption: 78 },
    ],
    forecastData: [
      { month: "Jan 2025", predicted: 82, lower: 70, upper: 95 },
      { month: "Feb 2025", predicted: 85, lower: 72, upper: 98 },
      { month: "Mar 2025", predicted: 88, lower: 75, upper: 100 },
    ],
    confidence: 78,
    trend: "stable",
    seasonality: "low",
  },
  {
    id: "3",
    itemCode: "CP-BRG-003",
    itemName: "Ball Bearings (6205)",
    category: "Components",
    currentStock: 150,
    avgMonthlyConsumption: 200,
    leadTimeDays: 21,
    safetyStock: 150,
    reorderPoint: 290,
    historicalData: [
      { month: "Jul 2024", consumption: 180 },
      { month: "Aug 2024", consumption: 210 },
      { month: "Sep 2024", consumption: 195 },
      { month: "Oct 2024", consumption: 220 },
      { month: "Nov 2024", consumption: 205 },
      { month: "Dec 2024", consumption: 190 },
    ],
    forecastData: [
      { month: "Jan 2025", predicted: 205, lower: 180, upper: 230 },
      { month: "Feb 2025", predicted: 210, lower: 185, upper: 235 },
      { month: "Mar 2025", predicted: 215, lower: 190, upper: 240 },
    ],
    confidence: 82,
    trend: "increasing",
    seasonality: "medium",
  },
  {
    id: "4",
    itemCode: "PK-BOX-004",
    itemName: "Cardboard Boxes (Large)",
    category: "Packaging",
    currentStock: 2500,
    avgMonthlyConsumption: 800,
    leadTimeDays: 7,
    safetyStock: 300,
    reorderPoint: 500,
    historicalData: [
      { month: "Jul 2024", consumption: 650 },
      { month: "Aug 2024", consumption: 720 },
      { month: "Sep 2024", consumption: 850 },
      { month: "Oct 2024", consumption: 920 },
      { month: "Nov 2024", consumption: 980 },
      { month: "Dec 2024", consumption: 1100 },
    ],
    forecastData: [
      { month: "Jan 2025", predicted: 950, lower: 850, upper: 1050 },
      { month: "Feb 2025", predicted: 880, lower: 780, upper: 980 },
      { month: "Mar 2025", predicted: 820, lower: 720, upper: 920 },
    ],
    confidence: 72,
    trend: "decreasing",
    seasonality: "high",
  },
  {
    id: "5",
    itemCode: "CH-LUB-005",
    itemName: "Industrial Lubricant (20L)",
    category: "Consumables",
    currentStock: 45,
    avgMonthlyConsumption: 30,
    leadTimeDays: 5,
    safetyStock: 10,
    reorderPoint: 15,
    historicalData: [
      { month: "Jul 2024", consumption: 28 },
      { month: "Aug 2024", consumption: 32 },
      { month: "Sep 2024", consumption: 30 },
      { month: "Oct 2024", consumption: 29 },
      { month: "Nov 2024", consumption: 31 },
      { month: "Dec 2024", consumption: 30 },
    ],
    forecastData: [
      { month: "Jan 2025", predicted: 30, lower: 26, upper: 34 },
      { month: "Feb 2025", predicted: 31, lower: 27, upper: 35 },
      { month: "Mar 2025", predicted: 30, lower: 26, upper: 34 },
    ],
    confidence: 90,
    trend: "stable",
    seasonality: "low",
  },
];

const PurchaseForecasting = () => {
  return (
    <MainLayout
      title="Purchase Forecasting"
      subtitle="AI-powered demand prediction and reorder recommendations"
    >
      <div className="space-y-6">
        <ForecastingSummaryCards items={mockForecastItems} />

        <Tabs defaultValue="predictions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-blue-50 border border-blue-100">
            <TabsTrigger value="predictions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Demand Predictions</TabsTrigger>
            <TabsTrigger value="historical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Historical Analysis</TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Reorder Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <DemandPredictionChart items={mockForecastItems} />
          </TabsContent>

          <TabsContent value="historical">
            <HistoricalConsumptionChart items={mockForecastItems} />
          </TabsContent>

          <TabsContent value="recommendations">
            <ReorderRecommendations items={mockForecastItems} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PurchaseForecasting;
