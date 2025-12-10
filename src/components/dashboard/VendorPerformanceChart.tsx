import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
    <div className="bg-card rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Vendor Performance</h3>
          <p className="text-sm text-slate-500 mt-1">Monthly trend analysis</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 font-medium">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-slate-300" />
            <span className="text-slate-600 font-medium">Target</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 13, fill: "#64748b", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 13, fill: "#64748b", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={[70, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                padding: "12px 16px",
              }}
              formatter={(value: number, name: string) => [
                <span className="font-semibold">{value}%</span>,
                <span className="text-slate-600 capitalize">{name}</span>
              ]}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="performance" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
            <Bar dataKey="target" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
