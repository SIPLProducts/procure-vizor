import { CheckCircle, Circle, MapPin, Clock, Truck, Package, AlertTriangle } from "lucide-react";
import type { ShipmentEvent, ShipmentStatus } from "@/pages/ShipmentTracking";

interface ShipmentTimelineProps {
  events: ShipmentEvent[];
}

const getEventIcon = (status: ShipmentStatus) => {
  switch (status) {
    case "picked_up":
      return <Package className="w-4 h-4" />;
    case "in_transit":
      return <Truck className="w-4 h-4" />;
    case "out_for_delivery":
      return <MapPin className="w-4 h-4" />;
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "delayed":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Circle className="w-4 h-4" />;
  }
};

const getEventColor = (status: ShipmentStatus) => {
  switch (status) {
    case "delivered":
      return "bg-success text-success-foreground";
    case "delayed":
      return "bg-destructive text-destructive-foreground";
    case "out_for_delivery":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-primary text-primary-foreground";
  }
};

export function ShipmentTimeline({ events }: ShipmentTimelineProps) {
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Reverse events to show latest first
  const sortedEvents = [...events].reverse();

  return (
    <div className="bg-card rounded-xl p-5 shadow-card">
      <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Delivery Timeline
      </h3>

      <div className="relative">
        {sortedEvents.map((event, index) => {
          const { date, time } = formatDateTime(event.timestamp);
          const isLast = index === sortedEvents.length - 1;
          const isFirst = index === 0;

          return (
            <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isFirst ? getEventColor(event.status) : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {getEventIcon(event.status)}
                </div>
                {!isLast && <div className="w-px flex-1 bg-border mt-2" />}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-medium ${isFirst ? "text-foreground" : "text-muted-foreground"}`}>
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-medium text-foreground">{time}</p>
                    <p className="text-xs text-muted-foreground">{date}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
