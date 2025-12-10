import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SpendByCategoryChart } from "@/components/dashboard/SpendByCategoryChart";
import { VendorPerformanceChart } from "@/components/dashboard/VendorPerformanceChart";
import { RFQSpotlight } from "@/components/dashboard/RFQSpotlight";
import { ShipmentSummary } from "@/components/dashboard/ShipmentSummary";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  ShieldCheck,
  FileText,
  MessageSquare,
  IndianRupee,
  TrendingDown,
  Clock,
  AlertCircle,
  Sparkles,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const colorSchemes = {
  brand: {
    name: "DICABS Brand",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    shadow: "shadow-emerald-500/20",
  },
  ocean: {
    name: "Deep Blue",
    gradient: "from-blue-600 via-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
  sunset: {
    name: "Warm Sunset",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    shadow: "shadow-orange-500/20",
  },
  elegant: {
    name: "Dark Elegant",
    gradient: "from-slate-700 via-slate-600 to-zinc-600",
    shadow: "shadow-slate-500/20",
  },
  purple: {
    name: "Royal Purple",
    gradient: "from-purple-600 via-violet-500 to-fuchsia-500",
    shadow: "shadow-purple-500/20",
  },
  forest: {
    name: "Forest Green",
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    shadow: "shadow-green-500/20",
  },
  rose: {
    name: "Rose Gold",
    gradient: "from-rose-500 via-pink-500 to-red-400",
    shadow: "shadow-rose-500/20",
  },
  midnight: {
    name: "Midnight",
    gradient: "from-indigo-900 via-purple-900 to-slate-900",
    shadow: "shadow-indigo-500/20",
  },
};

type ColorSchemeKey = keyof typeof colorSchemes;

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeKey>("brand");

  const currentScheme = colorSchemes[selectedScheme];

  return (
    <MainLayout title="Executive Dashboard" subtitle="Real-time procurement insights">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentScheme.gradient} p-8 text-white shadow-xl ${currentScheme.shadow} transition-all duration-500`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNCAwLTQgMiAwIDIgMiA0IDIgNCA0IDIgNCAwIDQtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Welcome back</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/20">
                    <Palette className="w-4 h-4 mr-2" />
                    Theme
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {Object.entries(colorSchemes).map(([key, scheme]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => setSelectedScheme(key as ColorSchemeKey)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${scheme.gradient}`} />
                      <span>{scheme.name}</span>
                      {selectedScheme === key && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h2 className="text-3xl font-bold mb-2">Good {getGreeting()}, {userName}!</h2>
            <p className="text-lg text-white/80 max-w-xl">
              Your procurement operations are running smoothly. Here's what's happening today.
            </p>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" />
              <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" />
              <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI Grid - Row 1 */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KPICard
              title="Active Vendors"
              value="247"
              change={5.2}
              changeLabel="vs last month"
              icon={Users}
              variant="default"
            />
            <KPICard
              title="KYC Verified"
              value="94.2%"
              change={2.1}
              changeLabel="vs last month"
              icon={ShieldCheck}
              variant="success"
            />
            <KPICard
              title="Open RFQs"
              value="18"
              icon={FileText}
              variant="info"
            />
            <KPICard
              title="Quotes Received"
              value="42"
              change={12}
              changeLabel="this week"
              icon={MessageSquare}
              variant="default"
            />
          </div>
        </div>

        {/* KPI Grid - Row 2 */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Financial Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KPICard
              title="Spend YTD"
              value="₹4.2 Cr"
              change={8.5}
              changeLabel="vs last year"
              icon={IndianRupee}
              variant="default"
            />
            <KPICard
              title="Savings YTD"
              value="₹32.5 L"
              change={15.2}
              changeLabel="vs target"
              icon={TrendingDown}
              variant="success"
            />
            <KPICard
              title="Avg Lead Time"
              value="12.5 days"
              change={-8}
              changeLabel="improvement"
              icon={Clock}
              variant="success"
            />
            <KPICard
              title="Stockout Risk"
              value="3 items"
              icon={AlertCircle}
              variant="warning"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendByCategoryChart />
            <VendorPerformanceChart />
          </div>
        </div>

        {/* Cards Row */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RFQSpotlight />
            <ShipmentSummary />
            <StockAlerts />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
