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
  Building2,
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
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Building2 className="w-8 h-8 text-sidebar-primary flex-shrink-0" />
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <h1 className="text-lg font-semibold text-sidebar-foreground">Sharvi</h1>
            <p className="text-xs text-sidebar-muted -mt-0.5">ProcureOne</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
