import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const quarterlyData = [
  { quarter: "Q1", current: 125, last: 108 },
  { quarter: "Q2", current: 155, last: 133 },
  { quarter: "Q3", current: 185, last: 156 },
  { quarter: "Q4", current: 215, last: 174 },
];

const categoryComparison = [
  { category: "Raw Materials", current: 280, last: 245, growth: 14.3, color: "#6366f1" },
  { category: "Equipment", current: 120, last: 98, growth: 22.4, color: "#8b5cf6" },
  { category: "Services", current: 85, last: 72, growth: 18.1, color: "#ec4899" },
  { category: "Logistics", current: 65, last: 58, growth: 12.1, color: "#f97316" },
];

export function YearComparisonChart() {
  const totalCurrent = quarterlyData.reduce((sum, item) => sum + item.current, 0);
  const totalLast = quarterlyData.reduce((sum, item) => sum + item.last, 0);
  const totalGrowth = (((totalCurrent - totalLast) / totalLast) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Current vs Last Year</h3>
          <p className="text-sm text-slate-500">Quarterly comparison</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-800">₹{(totalCurrent / 100).toFixed(1)} Cr</p>
          <p className="text-xs text-emerald-600 font-semibold">+{totalGrowth}% growth</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={quarterlyData} layout="vertical" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
          <YAxis dataKey="quarter" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} width={30} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number) => [`₹${value}L`, ""]}
          />
          <defs>
            <linearGradient id="colorCurrentQ" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <Bar dataKey="current" name="2024" fill="url(#colorCurrentQ)" radius={[0, 4, 4, 0]} barSize={14} />
          <Bar dataKey="last" name="2023" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Category Growth</p>
        <div className="space-y-2.5">
          {categoryComparison.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 w-24">{item.category}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${(item.current / 300) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 ml-2">+{item.growth}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}