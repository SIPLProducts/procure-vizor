import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out relative",
        collapsed ? "w-[72px]" : "w-64"
      )}
      style={{
        background: 'linear-gradient(180deg, hsl(226 50% 14%) 0%, hsl(226 50% 10%) 100%)'
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border/50 relative",
        collapsed ? "px-4 justify-center" : "px-5"
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">Sharvi</h1>
            <p className="text-[11px] text-sidebar-muted font-medium -mt-0.5 tracking-wide uppercase">ProcureOne</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto relative">
        <ul className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} style={{ animationDelay: `${index * 30}ms` }} className="animate-fade-in">
                <NavLink
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/30"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100" />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 relative z-10 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="relative z-10">{item.name}</span>}
                  
                  {/* Hover indicator */}
                  {!isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full transition-all duration-200 group-hover:h-6" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "h-12 flex items-center justify-center border-t border-sidebar-border/50 text-sidebar-muted hover:text-sidebar-foreground transition-all duration-200 relative group",
          "hover:bg-sidebar-accent/50"
        )}
      >
        <div className={cn(
          "w-7 h-7 rounded-lg bg-sidebar-accent/50 flex items-center justify-center transition-all duration-200",
          "group-hover:bg-sidebar-accent group-hover:scale-110"
        )}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </div>
      </button>
    </aside>
  );
}
