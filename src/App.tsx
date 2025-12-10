import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GateEntryProvider } from "@/contexts/GateEntryContext";
import Index from "./pages/Index";
import Vendors from "./pages/Vendors";
import RFQManagement from "./pages/RFQManagement";
import PurchaseOrders from "./pages/PurchaseOrders";
import Inventory from "./pages/Inventory";
import ShipmentTracking from "./pages/ShipmentTracking";
import VendorFinance from "./pages/VendorFinance";
import PurchaseForecasting from "./pages/PurchaseForecasting";
import GateEntry from "./pages/GateEntry";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GateEntryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/rfq" element={<RFQManagement />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shipments" element={<ShipmentTracking />} />
            <Route path="/vendor-finance" element={<VendorFinance />} />
            <Route path="/forecasting" element={<PurchaseForecasting />} />
            <Route path="/gate-entry" element={<GateEntry />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GateEntryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
