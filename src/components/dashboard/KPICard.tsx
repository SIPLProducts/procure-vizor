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
    icon: "bg-primary/10 text-primary",
    gradient: "from-primary/5 to-transparent",
  },
  success: {
    icon: "bg-success/10 text-success",
    gradient: "from-success/5 to-transparent",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    gradient: "from-warning/5 to-transparent",
  },
  destructive: {
    icon: "bg-destructive/10 text-destructive",
    gradient: "from-destructive/5 to-transparent",
  },
  info: {
    icon: "bg-info/10 text-info",
    gradient: "from-info/5 to-transparent",
  },
};

export function KPICard({ title, value, change, changeLabel, icon: Icon, variant = "default" }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const styles = variantStyles[variant];

  return (
    <div className="group relative bg-card rounded-xl p-5 shadow-card border border-border/40 hover:shadow-lg hover:border-border/60 transition-all duration-300 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300", styles.gradient)} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              {isPositive ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-success/10">
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-semibold text-success">+{change}%</span>
                </div>
              ) : isNegative ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-destructive/10">
                  <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">{change}%</span>
                </div>
              ) : (
                <span className="text-xs font-medium text-muted-foreground">{change}%</span>
              )}
              {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
          styles.icon
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
