import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Raw Materials", value: 35, amount: "₹1.47 Cr" },
  { name: "Packaging", value: 25, amount: "₹1.05 Cr" },
  { name: "Equipment", value: 20, amount: "₹84 L" },
  { name: "Services", value: 12, amount: "₹50.4 L" },
  { name: "Others", value: 8, amount: "₹33.6 L" },
];

const COLORS = [
  "#10b981",
  "#14b8a6",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
];

export function SpendByCategoryChart() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Spend by Category</h3>
          <p className="text-sm text-slate-500 mt-1">Year-to-date breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">₹4.2 Cr</p>
          <p className="text-sm text-slate-500">Total Spend</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                padding: "12px 16px",
              }}
              formatter={(value: number, name: string, props: any) => [
                <span className="font-semibold">{props.payload.amount} ({value}%)</span>,
                <span className="text-slate-600">{name}</span>
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={50}
              formatter={(value, entry: any) => (
                <span className="text-sm font-medium text-slate-600 ml-1">{value}</span>
              )}
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
