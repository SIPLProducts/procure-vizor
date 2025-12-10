import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Raw Materials", value: 35, amount: "₹1.47 Cr", color: "#6366f1" },
  { name: "Packaging", value: 25, amount: "₹1.05 Cr", color: "#8b5cf6" },
  { name: "Equipment", value: 20, amount: "₹84 L", color: "#ec4899" },
  { name: "Services", value: 12, amount: "₹50.4 L", color: "#f97316" },
  { name: "Others", value: 8, amount: "₹33.6 L", color: "#14b8a6" },
];

export function SpendByCategoryChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Spend by Category</h3>
          <p className="text-sm text-slate-500">Year-to-date breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">₹4.2 Cr</p>
          <p className="text-xs text-slate-500">Total Spend</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="h-48 w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "10px 14px",
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${props.payload.amount} (${value}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-800">{item.amount}</span>
                <span className="text-xs text-slate-400 ml-2">({item.value}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
