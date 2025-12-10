import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

const variantStyles = {
  default: {
    icon: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
    border: "hover:border-emerald-200",
  },
  success: {
    icon: "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
    border: "hover:border-green-200",
  },
  warning: {
    icon: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    border: "hover:border-amber-200",
  },
  destructive: {
    icon: "bg-gradient-to-br from-red-500 to-rose-500 text-white",
    border: "hover:border-red-200",
  },
  info: {
    icon: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
    border: "hover:border-blue-200",
  },
};

export function KPICard({ title, value, change, changeLabel, icon: Icon, variant = "default" }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "group relative bg-card rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden",
      styles.border
    )}>
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] opacity-50" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              {isPositive ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">+{change}%</span>
                </div>
              ) : isNegative ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">{change}%</span>
                </div>
              ) : (
                <span className="text-sm font-medium text-slate-400">{change}%</span>
              )}
              {changeLabel && <span className="text-sm text-slate-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
          styles.icon
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
