import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Users, LogIn, LogOut, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { VehicleEntry, MaterialEntry, VisitorEntry } from "@/contexts/GateEntryContext";

interface GateEntrySummaryProps {
  vehicles: VehicleEntry[];
  materials: MaterialEntry[];
  visitors: VisitorEntry[];
}

export const GateEntrySummary = ({ vehicles, materials, visitors }: GateEntrySummaryProps) => {
  const vehiclesIn = vehicles.filter((v) => v.status === "in").length;
  const vehiclesOut = vehicles.filter((v) => v.status === "out").length;
  const materialInward = materials.filter((m) => m.type === "inward").length;
  const materialOutward = materials.filter((m) => m.type === "outward").length;
  const pendingVerification = materials.filter((m) => m.status === "pending").length;
  const visitorsIn = visitors.filter((v) => v.status === "checked_in").length;
  const visitorsExpected = visitors.filter((v) => v.status === "expected").length;

  const cards = [
    {
      title: "Vehicles Inside",
      value: vehiclesIn,
      icon: Truck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Vehicles Exited",
      value: vehiclesOut,
      icon: LogOut,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
    },
    {
      title: "Material Inward",
      value: materialInward,
      icon: LogIn,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Material Outward",
      value: materialOutward,
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Pending Verification",
      value: pendingVerification,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Visitors Inside",
      value: visitorsIn,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Expected Visitors",
      value: visitorsExpected,
      icon: AlertTriangle,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Today's Entries",
      value: vehicles.length + visitors.length,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
