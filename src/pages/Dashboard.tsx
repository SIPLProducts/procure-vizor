import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SpendByCategoryChart } from "@/components/dashboard/SpendByCategoryChart";
import { VendorPerformanceChart } from "@/components/dashboard/VendorPerformanceChart";
import { RFQSpotlight } from "@/components/dashboard/RFQSpotlight";
import { ShipmentSummary } from "@/components/dashboard/ShipmentSummary";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import {
  Users,
  ShieldCheck,
  FileText,
  MessageSquare,
  IndianRupee,
  TrendingDown,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout title="Executive Dashboard" subtitle="Real-time procurement insights">
      <div className="space-y-6 animate-fade-in">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendByCategoryChart />
          <VendorPerformanceChart />
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RFQSpotlight />
          <ShipmentSummary />
          <StockAlerts />
        </div>
      </div>
    </MainLayout>
  );
}
