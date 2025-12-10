import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Users, LogIn, LogOut, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { VehicleEntry, MaterialEntry, VisitorEntry } from "@/contexts/GateEntryContext";
import { cn } from "@/lib/utils";

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
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: "from-primary/10",
    },
    {
      title: "Vehicles Exited",
      value: vehiclesOut,
      icon: LogOut,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      gradient: "from-muted/50",
    },
    {
      title: "Material Inward",
      value: materialInward,
      icon: LogIn,
      color: "text-success",
      bgColor: "bg-success/10",
      gradient: "from-success/10",
    },
    {
      title: "Material Outward",
      value: materialOutward,
      icon: Package,
      color: "text-warning",
      bgColor: "bg-warning/10",
      gradient: "from-warning/10",
    },
    {
      title: "Pending Verification",
      value: pendingVerification,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      gradient: "from-warning/10",
    },
    {
      title: "Visitors Inside",
      value: visitorsIn,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      gradient: "from-accent/10",
    },
    {
      title: "Expected Visitors",
      value: visitorsExpected,
      icon: AlertTriangle,
      color: "text-info",
      bgColor: "bg-info/10",
      gradient: "from-info/10",
    },
    {
      title: "Today's Entries",
      value: vehicles.length + visitors.length,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      gradient: "from-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 stagger-children">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="group overflow-hidden hover:shadow-lg hover:border-border/80 transition-all duration-300"
        >
          <CardContent className="p-4 relative">
            {/* Gradient overlay on hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              card.gradient
            )} />
            
            <div className="relative flex flex-col items-center text-center gap-2">
              <div className={cn(
                "p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110",
                card.bgColor
              )}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
