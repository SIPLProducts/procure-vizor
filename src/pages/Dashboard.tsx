import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SpendByCategoryChart } from "@/components/dashboard/SpendByCategoryChart";
import { VendorPerformanceChart } from "@/components/dashboard/VendorPerformanceChart";
import { RFQSpotlight } from "@/components/dashboard/RFQSpotlight";
import { ShipmentSummary } from "@/components/dashboard/ShipmentSummary";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { useAuth } from "@/contexts/AuthContext";
import { useBannerTheme } from "@/contexts/BannerThemeContext";
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
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const { currentScheme } = useBannerTheme();

  return (
    <MainLayout title="Executive Dashboard" subtitle="Real-time procurement insights">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentScheme.gradient} p-8 text-white shadow-xl ${currentScheme.shadow} transition-all duration-500`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNCAwLTQgMiAwIDIgMiA0IDIgNCA0IDIgNCAwIDQtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Welcome back</span>
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
