import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGateEntry } from "@/contexts/GateEntryContext";
import { format, subDays, startOfDay, endOfDay, isWithinInterval, eachDayOfInterval } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  primary: "hsl(var(--primary))",
  blue: "#3b82f6",
  emerald: "#10b981",
  orange: "#f97316",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  slate: "#64748b",
  red: "#ef4444",
  cyan: "#06b6d4",
};

export const GateEntryTrends = () => {
  const { vehicles, materials, visitors } = useGateEntry();

  // Generate last 7 days data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  // Daily trends data
  const dailyTrends = last7Days.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const interval = { start: dayStart, end: dayEnd };

    const dayVehicles = vehicles.filter((v) => isWithinInterval(v.entryTime, interval));
    const dayMaterials = materials.filter((m) => isWithinInterval(m.timestamp, interval));
    const dayVisitors = visitors.filter((v) => isWithinInterval(v.entryTime, interval));

    return {
      date: format(day, "EEE"),
      fullDate: format(day, "dd MMM"),
      vehicles: dayVehicles.length,
      vehiclesIn: dayVehicles.filter((v) => v.status === "in").length,
      vehiclesOut: dayVehicles.filter((v) => v.status === "out").length,
      materials: dayMaterials.length,
      inward: dayMaterials.filter((m) => m.type === "inward").length,
      outward: dayMaterials.filter((m) => m.type === "outward").length,
      visitors: dayVisitors.length,
      checkedIn: dayVisitors.filter((v) => v.status === "checked_in").length,
      checkedOut: dayVisitors.filter((v) => v.status === "checked_out").length,
    };
  });

  // Vehicle purpose distribution
  const vehiclePurposeData = [
    { name: "Delivery", value: vehicles.filter((v) => v.purpose === "delivery").length, color: COLORS.emerald },
    { name: "Pickup", value: vehicles.filter((v) => v.purpose === "pickup").length, color: COLORS.orange },
    { name: "Service", value: vehicles.filter((v) => v.purpose === "service").length, color: COLORS.blue },
    { name: "Visitor", value: vehicles.filter((v) => v.purpose === "visitor").length, color: COLORS.purple },
    { name: "Employee", value: vehicles.filter((v) => v.purpose === "employee").length, color: COLORS.slate },
  ].filter((d) => d.value > 0);

  // Material status distribution
  const materialStatusData = [
    { name: "Verified", value: materials.filter((m) => m.status === "verified").length, color: COLORS.emerald },
    { name: "Pending", value: materials.filter((m) => m.status === "pending").length, color: COLORS.amber },
    { name: "Rejected", value: materials.filter((m) => m.status === "rejected").length, color: COLORS.red },
  ].filter((d) => d.value > 0);

  // Visitor department distribution
  const departmentCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    departmentCounts[v.hostDepartment] = (departmentCounts[v.hostDepartment] || 0) + 1;
  });
  const visitorDepartmentData = Object.entries(departmentCounts)
    .map(([name, value], index) => ({
      name,
      value,
      color: Object.values(COLORS)[index % Object.values(COLORS).length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Hourly distribution (for current day simulation)
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = 6 + i; // 6 AM to 6 PM
    return {
      hour: `${hour}:00`,
      vehicles: Math.floor(Math.random() * 5) + (hour >= 8 && hour <= 10 ? 3 : 0),
      visitors: Math.floor(Math.random() * 4) + (hour >= 9 && hour <= 11 ? 2 : 0),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Entry Trends</CardTitle>
          <CardDescription>Gate entries over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends}>
                <defs>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMaterials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="vehicles"
                  name="Vehicles"
                  stroke={COLORS.blue}
                  fillOpacity={1}
                  fill="url(#colorVehicles)"
                />
                <Area
                  type="monotone"
                  dataKey="materials"
                  name="Materials"
                  stroke={COLORS.emerald}
                  fillOpacity={1}
                  fill="url(#colorMaterials)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke={COLORS.purple}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Material Flow</CardTitle>
            <CardDescription>Inward vs Outward materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="inward" name="Inward" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outward" name="Outward" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
            <CardDescription>Peak entry hours pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="vehicles" name="Vehicles" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="visitors" name="Visitors" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicle Purpose */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vehicle Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehiclePurposeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {vehiclePurposeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Material Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Material Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={materialStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {materialStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Visitor Departments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Visitors by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visitorDepartmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {visitorDepartmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
