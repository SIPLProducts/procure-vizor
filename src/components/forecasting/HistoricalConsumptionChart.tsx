import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { History, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { ForecastItem } from "@/pages/PurchaseForecasting";

interface HistoricalConsumptionChartProps {
  items: ForecastItem[];
}

export const HistoricalConsumptionChart = ({ items }: HistoricalConsumptionChartProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const categories = ["all", ...new Set(items.map((item) => item.category))];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Aggregate data by month across all items
  const aggregatedData = filteredItems[0]?.historicalData.map((_, monthIndex) => {
    const monthData: Record<string, number | string> = {
      month: filteredItems[0].historicalData[monthIndex].month,
    };
    filteredItems.forEach((item) => {
      monthData[item.itemCode] = item.historicalData[monthIndex]?.consumption || 0;
    });
    monthData.total = filteredItems.reduce(
      (sum, item) => sum + (item.historicalData[monthIndex]?.consumption || 0),
      0
    );
    return monthData;
  }) || [];

  const calculateGrowth = (item: ForecastItem) => {
    const data = item.historicalData;
    if (data.length < 2) return 0;
    const first = data[0].consumption;
    const last = data[data.length - 1].consumption;
    return ((last - first) / first) * 100;
  };

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-500" />
                Historical Consumption Analysis
              </CardTitle>
              <CardDescription>
                6-month consumption patterns and trends
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={viewMode} onValueChange={(v) => setViewMode(v as "chart" | "table")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "chart" ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregatedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {filteredItems.map((item, index) => (
                    <Bar
                      key={item.id}
                      dataKey={item.itemCode}
                      fill={COLORS[index % COLORS.length]}
                      name={item.itemName}
                      stackId="stack"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    {filteredItems.map((item) => (
                      <TableHead key={item.id} className="text-right">
                        {item.itemCode}
                      </TableHead>
                    ))}
                    <TableHead className="text-right font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      {filteredItems.map((item) => (
                        <TableCell key={item.id} className="text-right">
                          {(row[item.itemCode] as number).toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-bold">
                        {(row.total as number).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Item-wise Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const growth = calculateGrowth(item);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{item.itemCode}</p>
                        <p className="text-xs text-muted-foreground">{item.itemName}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          growth > 0
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : growth < 0
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-muted"
                        }
                      >
                        {growth > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : growth < 0 ? (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        ) : null}
                        {Math.abs(growth).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="h-[80px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={item.historicalData}>
                          <Line
                            type="monotone"
                            dataKey="consumption"
                            stroke={growth >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Seasonality: {item.seasonality}</span>
                      <span>Avg: {item.avgMonthlyConsumption}/mo</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
