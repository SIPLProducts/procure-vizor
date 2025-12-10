import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GateEntryProvider } from "@/contexts/GateEntryContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BannerThemeProvider } from "@/contexts/BannerThemeContext";
import Index from "./pages/Index";
import Vendors from "./pages/Vendors";
import RFQManagement from "./pages/RFQManagement";
import PurchaseOrders from "./pages/PurchaseOrders";
import Inventory from "./pages/Inventory";
import ShipmentTracking from "./pages/ShipmentTracking";
import VendorFinance from "./pages/VendorFinance";
import PurchaseForecasting from "./pages/PurchaseForecasting";
import GateEntry from "./pages/GateEntry";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
      <Route path="/rfq" element={<ProtectedRoute><RFQManagement /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/shipments" element={<ProtectedRoute><ShipmentTracking /></ProtectedRoute>} />
      <Route path="/vendor-finance" element={<ProtectedRoute><VendorFinance /></ProtectedRoute>} />
      <Route path="/forecasting" element={<ProtectedRoute><PurchaseForecasting /></ProtectedRoute>} />
      <Route path="/gate-entry" element={<ProtectedRoute><GateEntry /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BannerThemeProvider>
          <GateEntryProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </GateEntryProvider>
        </BannerThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
