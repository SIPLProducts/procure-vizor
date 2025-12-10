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
        "h-screen text-white flex flex-col transition-all duration-300 ease-in-out relative",
        collapsed ? "w-[72px]" : "w-72"
      )}
      style={{
        background: 'linear-gradient(180deg, hsl(160 35% 12%) 0%, hsl(170 40% 8%) 50%, hsl(180 35% 6%) 100%)'
      }}
    >
      {/* Subtle color accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-teal-500/5 to-transparent" />
      </div>
      
      {/* Logo */}
      <div className={cn(
        "py-5 flex items-center border-b border-white/10 relative",
        collapsed ? "px-3 justify-center" : "px-5"
      )}>
        <div className={cn(
          "bg-white rounded-xl shadow-lg transition-all duration-300",
          collapsed ? "p-2" : "px-4 py-3"
        )}>
          <img 
            src={dicabsLogo} 
            alt="DICABS Logo" 
            className={cn(
              "object-contain",
              collapsed ? "h-8 w-8" : "h-10"
            )}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 overflow-y-auto relative">
        <TooltipProvider delayDuration={0}>
          <ul className={cn("space-y-1.5", collapsed ? "px-2" : "px-4")}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const navLink = (
                <NavLink
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 relative overflow-hidden",
                    collapsed && "justify-center px-3",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "flex-shrink-0 relative z-10 transition-transform duration-200",
                    collapsed ? "w-5 h-5" : "w-[22px] h-[22px]",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="relative z-10 tracking-wide">{item.name}</span>}
                  
                  {/* Hover indicator */}
                  {!isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full transition-all duration-200 group-hover:h-8" />
                  )}
                </NavLink>
              );

              return (
                <li key={item.path} style={{ animationDelay: `${index * 30}ms` }} className="animate-fade-in">
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {navLink}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium text-sm">
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

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500" />
    </aside>
  );
}
