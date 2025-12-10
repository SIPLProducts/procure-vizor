import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Package,
  TrendingUp,
  Calendar,
  Truck,
  DoorOpen,
  Wallet,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dicabsLogo from "@/assets/dicabs-logo.png";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Vendors", path: "/vendors", icon: Users },
  { name: "RFQ Management", path: "/rfq", icon: FileText },
  { name: "Purchase Orders", path: "/purchase-orders", icon: ShoppingCart },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Forecasting", path: "/forecasting", icon: TrendingUp },
  { name: "Purchase Plan", path: "/purchase-plan", icon: Calendar },
  { name: "Shipment Tracking", path: "/shipments", icon: Truck },
  { name: "Gate Entry", path: "/gate-entry", icon: DoorOpen },
  { name: "Vendor Finance", path: "/vendor-finance", icon: Wallet },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Clean white/light gray background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      
      {/* Decorative side accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500" />
      
      {/* Logo Section */}
      <div className={cn(
        "relative py-6 border-b border-slate-200/80",
        collapsed ? "px-4 flex justify-center" : "px-6"
      )}>
        <div className={cn(
          "bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 transition-all duration-300",
          collapsed ? "p-3" : "px-5 py-4"
        )}>
          <img 
            src={dicabsLogo} 
            alt="DICABS Logo" 
            className={cn(
              "object-contain transition-all duration-300",
              collapsed ? "h-9 w-9" : "h-12"
            )}
          />
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-6 overflow-y-auto relative">
        <TooltipProvider delayDuration={0}>
          {!collapsed && (
            <div className="px-6 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Main Menu
              </span>
            </div>
          )}
          <ul className={cn("space-y-1", collapsed ? "px-3" : "px-4")}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              const navLink = (
                <NavLink
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl font-medium transition-all duration-200 relative",
                    collapsed ? "justify-center p-3" : "px-4 py-3.5",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && !collapsed && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />
                  )}
                  
                  <Icon className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    collapsed ? "w-6 h-6" : "w-5 h-5",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-600",
                    !isActive && "group-hover:scale-110"
                  )} />
                  
                  {!collapsed && (
                    <span className={cn(
                      "text-[15px] transition-colors duration-200",
                      isActive ? "text-white font-semibold" : "font-medium"
                    )}>
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );

              return (
                <li 
                  key={item.path} 
                  style={{ animationDelay: `${index * 40}ms` }} 
                  className="animate-fade-in"
                >
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {navLink}
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right" 
                        className="font-semibold text-sm bg-slate-900 text-white border-0"
                      >
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    navLink
                  )}
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Footer with brand accent */}
      <div className="relative px-4 py-4 border-t border-slate-200/80">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>
        {!collapsed && (
          <p className="text-[10px] text-center text-slate-400 mt-2 font-medium uppercase tracking-wider">
            Powering Progress
          </p>
        )}
      </div>
    </aside>
  );
}
