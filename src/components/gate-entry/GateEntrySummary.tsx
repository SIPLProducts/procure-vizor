import { Truck, Package, Users, LogIn, LogOut, Clock, AlertTriangle, CheckCircle, LucideIcon } from "lucide-react";
import { VehicleEntry, MaterialEntry, VisitorEntry } from "@/contexts/GateEntryContext";
import { cn } from "@/lib/utils";

interface GateEntrySummaryProps {
  vehicles: VehicleEntry[];
  materials: MaterialEntry[];
  visitors: VisitorEntry[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconShadow: string;
  titleColor: string;
}

const StatCard = ({ title, value, icon: Icon, gradient, iconShadow, titleColor }: StatCardProps) => (
  <div className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300">
    <div className="flex flex-col items-center text-center gap-2">
      <div className={cn(
        "p-2.5 rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105",
        gradient,
        iconShadow
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
      <p className={cn("text-[10px] font-bold uppercase tracking-wider leading-tight", titleColor)}>
        {title}
      </p>
    </div>
  </div>
);

export const GateEntrySummary = ({ vehicles, materials, visitors }: GateEntrySummaryProps) => {
  const vehiclesIn = vehicles.filter((v) => v.status === "in").length;
  const vehiclesOut = vehicles.filter((v) => v.status === "out").length;
  const materialInward = materials.filter((m) => m.type === "inward").length;
  const materialOutward = materials.filter((m) => m.type === "outward").length;
  const pendingVerification = materials.filter((m) => m.status === "pending").length;
  const visitorsIn = visitors.filter((v) => v.status === "checked_in").length;
  const visitorsExpected = visitors.filter((v) => v.status === "expected").length;

  const cards = [
    {
      title: "Vehicles Inside",
      value: vehiclesIn,
      icon: Truck,
      gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
      iconShadow: "shadow-emerald-500/30",
      titleColor: "text-emerald-600",
    },
    {
      title: "Vehicles Exited",
      value: vehiclesOut,
      icon: LogOut,
      gradient: "bg-gradient-to-br from-slate-400 to-slate-500",
      iconShadow: "shadow-slate-500/30",
      titleColor: "text-slate-600",
    },
    {
      title: "Material Inward",
      value: materialInward,
      icon: LogIn,
      gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
      iconShadow: "shadow-green-500/30",
      titleColor: "text-green-600",
    },
    {
      title: "Material Outward",
      value: materialOutward,
      icon: Package,
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconShadow: "shadow-amber-500/30",
      titleColor: "text-amber-600",
    },
    {
      title: "Pending Verify",
      value: pendingVerification,
      icon: Clock,
      gradient: "bg-gradient-to-br from-yellow-400 to-amber-500",
      iconShadow: "shadow-yellow-500/30",
      titleColor: "text-yellow-600",
    },
    {
      title: "Visitors Inside",
      value: visitorsIn,
      icon: Users,
      gradient: "bg-gradient-to-br from-purple-400 to-violet-500",
      iconShadow: "shadow-purple-500/30",
      titleColor: "text-purple-600",
    },
    {
      title: "Expected Visitors",
      value: visitorsExpected,
      icon: AlertTriangle,
      gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
      iconShadow: "shadow-cyan-500/30",
      titleColor: "text-cyan-600",
    },
    {
      title: "Today's Entries",
      value: vehicles.length + visitors.length,
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
      iconShadow: "shadow-blue-500/30",
      titleColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};
