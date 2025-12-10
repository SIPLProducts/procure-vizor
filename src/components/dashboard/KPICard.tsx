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
    icon: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconShadow: "shadow-emerald-500/30",
    title: "text-emerald-600",
  },
  success: {
    icon: "bg-gradient-to-br from-green-400 to-emerald-500",
    iconShadow: "shadow-green-500/30",
    title: "text-green-600",
  },
  warning: {
    icon: "bg-gradient-to-br from-amber-400 to-orange-500",
    iconShadow: "shadow-amber-500/30",
    title: "text-amber-600",
  },
  destructive: {
    icon: "bg-gradient-to-br from-red-400 to-rose-500",
    iconShadow: "shadow-red-500/30",
    title: "text-red-600",
  },
  info: {
    icon: "bg-gradient-to-br from-blue-400 to-cyan-500",
    iconShadow: "shadow-blue-500/30",
    title: "text-blue-600",
  },
};

export function KPICard({ title, value, change, changeLabel, icon: Icon, variant = "default" }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const styles = variantStyles[variant];

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn("text-xs font-bold uppercase tracking-wider", styles.title)}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              {isPositive ? (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">+{change}%</span>
                </div>
              ) : isNegative ? (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{change}%</span>
                </div>
              ) : null}
              {changeLabel && <span className="text-xs text-slate-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn(
          "p-3.5 rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105",
          styles.icon,
          styles.iconShadow
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
