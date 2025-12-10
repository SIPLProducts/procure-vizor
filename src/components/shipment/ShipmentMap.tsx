import { MapPin, Navigation, Truck } from "lucide-react";
import type { Shipment } from "@/pages/ShipmentTracking";

interface ShipmentMapProps {
  shipment: Shipment;
}

export function ShipmentMap({ shipment }: ShipmentMapProps) {
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          Live Tracking
        </h3>
      </div>

      {/* Map Visualization */}
      <div className="relative h-80 bg-gradient-to-br from-secondary to-muted">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Grid lines to simulate map */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 30}
                x2="400"
                y2={i * 30}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 30}
                y1="0"
                x2={i * 30}
                y2="300"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            ))}
            {/* Route line */}
            <path
              d="M 80 220 Q 150 180 200 150 T 320 80"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
            {/* Origin marker */}
            <circle cx="80" cy="220" r="8" fill="hsl(var(--success))" />
            <circle cx="80" cy="220" r="4" fill="white" />
            {/* Destination marker */}
            <circle cx="320" cy="80" r="8" fill="hsl(var(--primary))" />
            <circle cx="320" cy="80" r="4" fill="white" />
          </svg>
        </div>

        {/* Current Location Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: "55%", top: "50%" }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
            <div className="relative bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Origin Label */}
        <div className="absolute left-4 bottom-12 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-medium">{shipment.origin}</span>
          </div>
        </div>

        {/* Destination Label */}
        <div className="absolute right-4 top-12 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium">{shipment.destination}</span>
          </div>
        </div>

        {/* Map Placeholder Notice */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
            <p className="text-xs text-muted-foreground">
              Connect Mapbox for live GPS tracking
            </p>
          </div>
        </div>
      </div>

      {/* Current Location Info */}
      <div className="p-4 bg-primary/5 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{shipment.currentLocation.address}</p>
              <p className="text-xs text-muted-foreground">
                Last updated: {formatTime(shipment.currentLocation.lastUpdated)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Coordinates</p>
            <p className="text-sm font-mono text-foreground">
              {shipment.currentLocation.lat.toFixed(4)}, {shipment.currentLocation.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
