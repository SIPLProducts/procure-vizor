import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { week: "Week 1", current: 18, previous: 15 },
  { week: "Week 2", current: 22, previous: 19 },
  { week: "Week 3", current: 28, previous: 23 },
  { week: "Week 4", current: 32, previous: 26 },
];

const monthlyData = [
  { month: "Jul", spend: 38, orders: 45 },
  { month: "Aug", spend: 42, orders: 52 },
  { month: "Sep", spend: 35, orders: 48 },
  { month: "Oct", spend: 48, orders: 58 },
  { month: "Nov", spend: 52, orders: 62 },
  { month: "Dec", spend: 58, orders: 68 },
];

export function MonthOnMonthChart() {
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const spendGrowth = (((currentMonth.spend - previousMonth.spend) / previousMonth.spend) * 100).toFixed(1);
  const orderGrowth = (((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Month on Month Trend</h3>
          <p className="text-sm text-slate-500">Spend & order trends (last 6 months)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Spend MoM</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹{currentMonth.spend}L</p>
          <p className={`text-sm font-medium mt-1 ${Number(spendGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(spendGrowth) >= 0 ? '+' : ''}{spendGrowth}% vs last month
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
          <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Orders MoM</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{currentMonth.orders}</p>
          <p className={`text-sm font-medium mt-1 ${Number(orderGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(orderGrowth) >= 0 ? '+' : ''}{orderGrowth}% vs last month
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSpend)" name="Spend (₹L)" />
          <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorOrders)" name="Orders" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
