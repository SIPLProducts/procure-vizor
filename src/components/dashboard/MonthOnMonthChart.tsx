import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Month on Month Trend</h3>
          <p className="text-sm text-slate-500">Spend & orders (last 6 months)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
          <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Spend MoM</p>
          <p className="text-xl font-bold text-slate-800 mt-1">₹{currentMonth.spend}L</p>
          <p className={`text-xs font-semibold mt-1 ${Number(spendGrowth) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {Number(spendGrowth) >= 0 ? '+' : ''}{spendGrowth}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-xl p-4 border border-fuchsia-100">
          <p className="text-xs font-bold text-fuchsia-600 uppercase tracking-wider">Orders MoM</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{currentMonth.orders}</p>
          <p className={`text-xs font-semibold mt-1 ${Number(orderGrowth) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {Number(orderGrowth) >= 0 ? '+' : ''}{orderGrowth}%
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={monthlyData}>
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
          />
          <defs>
            <linearGradient id="colorSpendMoM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrdersMoM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d946ef" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="spend" stroke="#06b6d4" strokeWidth={2} fill="url(#colorSpendMoM)" name="Spend (₹L)" />
          <Area type="monotone" dataKey="orders" stroke="#d946ef" strokeWidth={2} fill="url(#colorOrdersMoM)" name="Orders" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}