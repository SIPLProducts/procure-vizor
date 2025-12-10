import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", currentYear: 42, lastYear: 38 },
  { month: "Feb", currentYear: 35, lastYear: 32 },
  { month: "Mar", currentYear: 48, lastYear: 41 },
  { month: "Apr", currentYear: 52, lastYear: 45 },
  { month: "May", currentYear: 45, lastYear: 40 },
  { month: "Jun", currentYear: 58, lastYear: 48 },
  { month: "Jul", currentYear: 62, lastYear: 52 },
  { month: "Aug", currentYear: 55, lastYear: 49 },
  { month: "Sep", currentYear: 68, lastYear: 55 },
  { month: "Oct", currentYear: 72, lastYear: 58 },
  { month: "Nov", currentYear: 65, lastYear: 54 },
  { month: "Dec", currentYear: 78, lastYear: 62 },
];

export function YearOnYearChart() {
  const currentYearTotal = data.reduce((sum, item) => sum + item.currentYear, 0);
  const lastYearTotal = data.reduce((sum, item) => sum + item.lastYear, 0);
  const growthPercent = (((currentYearTotal - lastYearTotal) / lastYearTotal) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Year on Year Comparison</h3>
          <p className="text-sm text-slate-500">Purchase orders: 2024 vs 2023</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <span className="text-sm font-semibold text-emerald-600">+{growthPercent}% YoY</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
          <span className="text-sm text-slate-600">2024 (₹{currentYearTotal}L)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          <span className="text-sm text-slate-600">2023 (₹{lastYearTotal}L)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
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
            <linearGradient id="colorCurrentYoY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <Bar dataKey="currentYear" name="2024" fill="url(#colorCurrentYoY)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="lastYear" name="2023" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}