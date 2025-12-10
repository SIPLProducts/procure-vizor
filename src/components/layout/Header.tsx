import { Bell, Search, User, Moon, Sun, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ title, subtitle, sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="h-18 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-center gap-5">
          {/* Sidebar Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleSidebar}
                className="text-muted-foreground hover:text-foreground h-10 w-10"
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-sm">{sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
              <p className="text-xs text-muted-foreground">⌘B / Ctrl+B</p>
            </TooltipContent>
          </Tooltip>

        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-72 pl-10 h-11 text-sm bg-secondary/50 border-border/50 focus:bg-card focus:border-primary/30 transition-all duration-200"
          />
        </div>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground h-10 w-10"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground h-10 w-10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse-soft border-2 border-card" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0 h-10 w-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 transition-transform duration-200 hover:scale-105">
                <User className="w-5 h-5 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-3 py-2.5">
              <p className="text-base font-semibold">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate mt-0.5">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive py-2.5 text-sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </TooltipProvider>
  );
}
