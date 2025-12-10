import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GateEntrySummary } from "@/components/gate-entry/GateEntrySummary";
import { VehicleRegistry } from "@/components/gate-entry/VehicleRegistry";
import { MaterialTracking } from "@/components/gate-entry/MaterialTracking";
import { VisitorManagement } from "@/components/gate-entry/VisitorManagement";
import { useGateEntry } from "@/contexts/GateEntryContext";

// Re-export types from context for backward compatibility
export type { VehicleEntry, MaterialEntry, VisitorEntry } from "@/contexts/GateEntryContext";

const GateEntry = () => {
  const { vehicles, materials, visitors } = useGateEntry();

  return (
    <MainLayout
      title="Gate Entry Management"
      subtitle="Vehicle registration, material tracking, and visitor management"
    >
      <div className="space-y-6">
        <GateEntrySummary
          vehicles={vehicles}
          materials={materials}
          visitors={visitors}
        />

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="vehicles">Vehicle Registry</TabsTrigger>
            <TabsTrigger value="materials">Material Tracking</TabsTrigger>
            <TabsTrigger value="visitors">Visitor Management</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <VehicleRegistry />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialTracking />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GateEntry;
