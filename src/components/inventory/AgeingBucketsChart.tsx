import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { InventoryItem } from "@/pages/Inventory";

interface AgeingBucketsChartProps {
  inventory: InventoryItem[];
}

const COLORS = ["hsl(152, 69%, 40%)", "hsl(199, 89%, 48%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

export function AgeingBucketsChart({ inventory }: AgeingBucketsChartProps) {
  // Aggregate ageing data
  const ageingTotals = inventory.reduce(
    (acc, item) => {
      acc["0-30"] += item.ageing["0-30"] * item.unitCost;
      acc["31-60"] += item.ageing["31-60"] * item.unitCost;
      acc["61-90"] += item.ageing["61-90"] * item.unitCost;
      acc["90+"] += item.ageing["90+"] * item.unitCost;
      return acc;
    },
    { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 }
  );

  const pieData = [
    { name: "0-30 Days", value: ageingTotals["0-30"], color: COLORS[0] },
    { name: "31-60 Days", value: ageingTotals["31-60"], color: COLORS[1] },
    { name: "61-90 Days", value: ageingTotals["61-90"], color: COLORS[2] },
    { name: "90+ Days", value: ageingTotals["90+"], color: COLORS[3] },
  ];

  const barData = inventory.map((item) => ({
    name: item.materialCode,
    fullName: item.materialName,
    "0-30": item.ageing["0-30"],
    "31-60": item.ageing["31-60"],
    "61-90": item.ageing["61-90"],
    "90+": item.ageing["90+"],
  }));

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const totalAgedValue = Object.values(ageingTotals).reduce((a, b) => a + b, 0);
  const oldStockPercentage = ((ageingTotals["61-90"] + ageingTotals["90+"]) / totalAgedValue) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {pieData.map((item, index) => (
          <div key={item.name} className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-sm text-muted-foreground">{item.name}</p>
            </div>
            <p className="text-xl font-bold text-foreground mt-2">
              {formatCurrency(item.value)}
            </p>
            <p className="text-xs text-muted-foreground">
              {((item.value / totalAgedValue) * 100).toFixed(1)}% of total
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h3 className="text-base font-semibold text-foreground mb-4">Stock Value by Age</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-warning/10 rounded-lg">
            <p className="text-sm text-warning font-medium">
              {oldStockPercentage.toFixed(1)}% of inventory value is over 60 days old
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Ageing by Material (Qty)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(label) => {
                    const item = barData.find((d) => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Legend />
                <Bar dataKey="0-30" stackId="a" fill={COLORS[0]} name="0-30 Days" />
                <Bar dataKey="31-60" stackId="a" fill={COLORS[1]} name="31-60 Days" />
                <Bar dataKey="61-90" stackId="a" fill={COLORS[2]} name="61-90 Days" />
                <Bar dataKey="90+" stackId="a" fill={COLORS[3]} name="90+ Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="text-base font-semibold text-foreground mb-4">Ageing Details by Material</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Material</th>
                <th className="text-right py-3 px-4 font-medium text-success">0-30 Days</th>
                <th className="text-right py-3 px-4 font-medium text-info">31-60 Days</th>
                <th className="text-right py-3 px-4 font-medium text-warning">61-90 Days</th>
                <th className="text-right py-3 px-4 font-medium text-destructive">90+ Days</th>
                <th className="text-right py-3 px-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const total =
                  item.ageing["0-30"] + item.ageing["31-60"] + item.ageing["61-90"] + item.ageing["90+"];
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4">
                      <p className="font-medium">{item.materialName}</p>
                      <p className="text-xs text-muted-foreground">{item.materialCode}</p>
                    </td>
                    <td className="text-right py-3 px-4">{item.ageing["0-30"].toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{item.ageing["31-60"].toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{item.ageing["61-90"].toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{item.ageing["90+"].toLocaleString()}</td>
                    <td className="text-right py-3 px-4 font-semibold">{total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
