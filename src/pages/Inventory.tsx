import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { StockAlertCards } from "@/components/inventory/StockAlertCards";
import { AgeingBucketsChart } from "@/components/inventory/AgeingBucketsChart";
import { ReorderSuggestions } from "@/components/inventory/ReorderSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface InventoryItem {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  unit: string;
  onHandQty: number;
  reservedQty: number;
  availableQty: number;
  minStock: number;
  maxStock: number;
  safetyStock: number;
  reorderPoint: number;
  avgDailyConsumption: number;
  lastReceiptDate: string;
  unitCost: number;
  ageing: {
    "0-30": number;
    "31-60": number;
    "61-90": number;
    "90+": number;
  };
}

export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    materialCode: "MAT-001",
    materialName: "Steel Plates 3mm",
    category: "Raw Materials",
    unit: "kg",
    onHandQty: 2500,
    reservedQty: 800,
    availableQty: 1700,
    minStock: 2000,
    maxStock: 8000,
    safetyStock: 1500,
    reorderPoint: 3000,
    avgDailyConsumption: 150,
    lastReceiptDate: "2024-12-01",
    unitCost: 238,
    ageing: { "0-30": 1200, "31-60": 800, "61-90": 400, "90+": 100 },
  },
  {
    id: "2",
    materialCode: "MAT-002",
    materialName: "Steel Rods 10mm",
    category: "Raw Materials",
    unit: "kg",
    onHandQty: 4200,
    reservedQty: 1000,
    availableQty: 3200,
    minStock: 1500,
    maxStock: 6000,
    safetyStock: 1000,
    reorderPoint: 2500,
    avgDailyConsumption: 80,
    lastReceiptDate: "2024-11-28",
    unitCost: 195,
    ageing: { "0-30": 2000, "31-60": 1500, "61-90": 500, "90+": 200 },
  },
  {
    id: "3",
    materialCode: "MAT-023",
    materialName: "PVC Sheets 5mm",
    category: "Raw Materials",
    unit: "sqm",
    onHandQty: 180,
    reservedQty: 50,
    availableQty: 130,
    minStock: 200,
    maxStock: 800,
    safetyStock: 150,
    reorderPoint: 300,
    avgDailyConsumption: 25,
    lastReceiptDate: "2024-11-15",
    unitCost: 320,
    ageing: { "0-30": 80, "31-60": 60, "61-90": 30, "90+": 10 },
  },
  {
    id: "4",
    materialCode: "MAT-045",
    materialName: "Corrugated Cartons",
    category: "Packaging",
    unit: "pcs",
    onHandQty: 12000,
    reservedQty: 3000,
    availableQty: 9000,
    minStock: 5000,
    maxStock: 20000,
    safetyStock: 4000,
    reorderPoint: 8000,
    avgDailyConsumption: 500,
    lastReceiptDate: "2024-12-05",
    unitCost: 45,
    ageing: { "0-30": 8000, "31-60": 3000, "61-90": 800, "90+": 200 },
  },
  {
    id: "5",
    materialCode: "MAT-067",
    materialName: "Copper Wire 2.5mm",
    category: "Electrical",
    unit: "meters",
    onHandQty: 350,
    reservedQty: 100,
    availableQty: 250,
    minStock: 500,
    maxStock: 2000,
    safetyStock: 300,
    reorderPoint: 600,
    avgDailyConsumption: 40,
    lastReceiptDate: "2024-11-20",
    unitCost: 125,
    ageing: { "0-30": 150, "31-60": 100, "61-90": 70, "90+": 30 },
  },
  {
    id: "6",
    materialCode: "MAT-089",
    materialName: "Industrial Adhesive",
    category: "Chemicals",
    unit: "liters",
    onHandQty: 45,
    reservedQty: 20,
    availableQty: 25,
    minStock: 50,
    maxStock: 200,
    safetyStock: 30,
    reorderPoint: 60,
    avgDailyConsumption: 5,
    lastReceiptDate: "2024-11-10",
    unitCost: 320,
    ageing: { "0-30": 20, "31-60": 15, "61-90": 8, "90+": 2 },
  },
  {
    id: "7",
    materialCode: "MAT-102",
    materialName: "Aluminum Sheets 2mm",
    category: "Raw Materials",
    unit: "kg",
    onHandQty: 1800,
    reservedQty: 400,
    availableQty: 1400,
    minStock: 1000,
    maxStock: 4000,
    safetyStock: 800,
    reorderPoint: 1500,
    avgDailyConsumption: 60,
    lastReceiptDate: "2024-12-03",
    unitCost: 285,
    ageing: { "0-30": 1000, "31-60": 500, "61-90": 200, "90+": 100 },
  },
  {
    id: "8",
    materialCode: "MAT-115",
    materialName: "Rubber Gaskets",
    category: "Components",
    unit: "pcs",
    onHandQty: 5500,
    reservedQty: 1500,
    availableQty: 4000,
    minStock: 3000,
    maxStock: 10000,
    safetyStock: 2000,
    reorderPoint: 4000,
    avgDailyConsumption: 200,
    lastReceiptDate: "2024-11-25",
    unitCost: 12,
    ageing: { "0-30": 3000, "31-60": 1500, "61-90": 700, "90+": 300 },
  },
];

export default function Inventory() {
  const [inventory] = useState<InventoryItem[]>(mockInventory);

  const criticalItems = inventory.filter((item) => item.availableQty < item.safetyStock);
  const lowStockItems = inventory.filter(
    (item) => item.availableQty >= item.safetyStock && item.availableQty < item.minStock
  );
  const reorderItems = inventory.filter((item) => item.availableQty <= item.reorderPoint);

  const totalValue = inventory.reduce((sum, item) => sum + item.onHandQty * item.unitCost, 0);

  return (
    <MainLayout title="Inventory Stock Analyzer" subtitle="Monitor stock levels and optimize reorder points">
      <div className="space-y-6 animate-fade-in">
        <StockAlertCards
          totalItems={inventory.length}
          criticalCount={criticalItems.length}
          lowStockCount={lowStockItems.length}
          reorderCount={reorderItems.length}
          totalValue={totalValue}
        />

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Stock Overview</TabsTrigger>
            <TabsTrigger value="ageing">Stock Ageing</TabsTrigger>
            <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryTable inventory={inventory} />
          </TabsContent>

          <TabsContent value="ageing">
            <AgeingBucketsChart inventory={inventory} />
          </TabsContent>

          <TabsContent value="reorder">
            <ReorderSuggestions inventory={inventory} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
