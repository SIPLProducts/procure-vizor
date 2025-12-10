import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { range: "0-30 days", value: 45, amount: "₹1.89 Cr", color: "#22c55e" },
  { range: "31-60 days", value: 28, amount: "₹1.18 Cr", color: "#84cc16" },
  { range: "61-90 days", value: 15, amount: "₹63 L", color: "#f59e0b" },
  { range: "91-180 days", value: 8, amount: "₹33.6 L", color: "#f97316" },
  { range: "180+ days", value: 4, amount: "₹16.8 L", color: "#ef4444" },
];

export function InventoryAgingChart() {
  const totalValue = "₹4.2 Cr";
  const healthyPercent = data[0].value + data[1].value;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Inventory Aging</h3>
          <p className="text-sm text-slate-500">Stock age distribution</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
          <span className="text-sm font-semibold text-green-600">{healthyPercent}% Healthy</span>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              dataKey="range" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${props.payload.amount} (${value}%)`,
                "Value"
              ]}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Total Inventory Value</span>
          <span className="font-bold text-slate-800">{totalValue}</span>
        </div>
        <div className="flex gap-1 mt-3">
          {data.map((item) => (
            <div 
              key={item.range}
              className="h-2 rounded-full transition-all hover:scale-y-150"
              style={{ 
                backgroundColor: item.color, 
                width: `${item.value}%` 
              }}
              title={`${item.range}: ${item.amount}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-400">
          <span>Fresh Stock</span>
          <span>Aging Stock</span>
        </div>
      </div>
    </div>
  );
}