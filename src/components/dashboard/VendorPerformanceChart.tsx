import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", performance: 85, target: 90 },
  { name: "Feb", performance: 88, target: 90 },
  { name: "Mar", performance: 92, target: 90 },
  { name: "Apr", performance: 87, target: 90 },
  { name: "May", performance: 94, target: 90 },
  { name: "Jun", performance: 91, target: 90 },
];

export function VendorPerformanceChart() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card">
      <h3 className="text-base font-semibold text-foreground mb-4">Vendor Performance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              domain={[70, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="performance" fill="hsl(226, 70%, 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
