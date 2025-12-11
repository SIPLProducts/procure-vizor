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
  Palette,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dicabsLogo from "@/assets/dicabs-logo.png";
import { useBannerTheme, colorSchemes, ColorSchemeKey } from "@/contexts/BannerThemeContext";

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
  const { selectedScheme, setSelectedScheme, currentScheme } = useBannerTheme();

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Clean white/light gray background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      
      {/* Decorative side accent - Ocean Blue */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-blue-500 to-sky-400" />
      
      {/* Logo Section */}
      <div className={cn(
        "relative py-6 border-b border-slate-200/80",
        collapsed ? "px-4 flex justify-center" : "px-6"
      )}>
        <div className={cn(
          "bg-white rounded-2xl shadow-md shadow-blue-100/50 border border-slate-100 transition-all duration-300",
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
            <div className="px-6 mb-5">
              <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-blue-600/80">
                Navigation
              </span>
              <div className="mt-2 h-0.5 w-8 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" />
            </div>
          )}
          <ul className={cn("space-y-1.5", collapsed ? "px-3" : "px-4")}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              const navLink = (
                <NavLink
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl font-medium transition-all duration-200 relative",
                    collapsed ? "justify-center p-3.5" : "px-4 py-3.5",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:bg-blue-50/50 hover:text-slate-900"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && !collapsed && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                  
                  <Icon className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    collapsed ? "w-6 h-6" : "w-[22px] h-[22px]",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600",
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

      {/* Theme Selector */}
      <div className={cn(
        "relative border-t border-slate-200/80",
        collapsed ? "px-3 py-4" : "px-4 py-4"
      )}>
        <TooltipProvider delayDuration={0}>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl font-medium transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      collapsed ? "justify-center p-3.5" : "px-4 py-3"
                    )}
                  >
                    <div className={cn(
                      "rounded-full bg-gradient-to-r",
                      currentScheme.gradient,
                      collapsed ? "w-6 h-6" : "w-5 h-5"
                    )} />
                    {!collapsed && (
                      <>
                        <span className="text-[15px] font-medium">Theme</span>
                        <Palette className="w-4 h-4 ml-auto text-slate-400" />
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent 
                  side="right" 
                  className="font-semibold text-sm bg-slate-900 text-white border-0"
                >
                  Theme
                </TooltipContent>
              )}
            </Tooltip>
            <DropdownMenuContent 
              align={collapsed ? "center" : "start"} 
              side="top"
              className="w-52 bg-white border border-slate-200 shadow-xl z-50"
            >
              {Object.entries(colorSchemes).map(([key, scheme]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSelectedScheme(key as ColorSchemeKey)}
                  className="flex items-center gap-3 cursor-pointer py-2.5 hover:bg-slate-100"
                >
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${scheme.gradient}`} />
                  <span className="text-slate-700">{scheme.name}</span>
                  {selectedScheme === key && <span className="ml-auto text-blue-600 font-bold">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>

      {/* Footer with brand accent - Ocean Blue */}
      <div className="relative px-4 py-5 border-t border-slate-200/80">
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
        </div>
        {!collapsed && (
          <p className="text-[11px] text-center text-slate-400 mt-2.5 font-semibold uppercase tracking-[0.15em]">
            Powering Progress
          </p>
        )}
      </div>
    </aside>
  );
}
