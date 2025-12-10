import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const quarterlyData = [
  { quarter: "Q1", current: 125, last: 108, label: "Q1 2024" },
  { quarter: "Q2", current: 155, last: 133, label: "Q2 2024" },
  { quarter: "Q3", current: 185, last: 156, label: "Q3 2024" },
  { quarter: "Q4", current: 215, last: 174, label: "Q4 2024" },
];

const categoryComparison = [
  { category: "Raw Materials", current: 280, last: 245, growth: 14.3 },
  { category: "Equipment", current: 120, last: 98, growth: 22.4 },
  { category: "Services", current: 85, last: 72, growth: 18.1 },
  { category: "Logistics", current: 65, last: 58, growth: 12.1 },
  { category: "Packaging", current: 45, last: 42, growth: 7.1 },
];

export function YearComparisonChart() {
  const totalCurrent = quarterlyData.reduce((sum, item) => sum + item.current, 0);
  const totalLast = quarterlyData.reduce((sum, item) => sum + item.last, 0);
  const totalGrowth = (((totalCurrent - totalLast) / totalLast) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Current vs Last Year</h3>
          <p className="text-sm text-slate-500">Quarterly procurement comparison</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">₹{(totalCurrent / 100).toFixed(1)} Cr</p>
          <p className="text-sm text-green-600 font-medium">+{totalGrowth}% growth</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={quarterlyData} layout="vertical" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis dataKey="quarter" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} width={40} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number) => [`₹${value}L`, ""]}
          />
          <Bar dataKey="current" name="2024" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
          <Bar dataKey="last" name="2023" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Category-wise Growth</p>
        <div className="space-y-3">
          {categoryComparison.slice(0, 4).map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-slate-600 w-28">{item.category}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    style={{ width: `${(item.current / 300) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-green-600 ml-3">+{item.growth}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
