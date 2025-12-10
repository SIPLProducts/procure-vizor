import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer } from "lucide-react";
import { VehicleGatePass } from "./VehicleGatePass";
import { VisitorGatePass } from "./VisitorGatePass";
import { VehicleEntry, VisitorEntry } from "@/contexts/GateEntryContext";

interface PrintGatePassProps {
  type: "vehicle" | "visitor";
  data: VehicleEntry | VisitorEntry;
}

export const PrintGatePass = ({ type, data }: PrintGatePassProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: type === "vehicle" 
      ? `Vehicle_Pass_${(data as VehicleEntry).vehicleNumber}` 
      : `Visitor_Pass_${(data as VisitorEntry).name}`,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-1" />
          Print Pass
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "vehicle" ? "Vehicle Gate Pass" : "Visitor Gate Pass"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="border rounded-lg overflow-hidden shadow-lg">
            {type === "vehicle" ? (
              <VehicleGatePass ref={printRef} vehicle={data as VehicleEntry} />
            ) : (
              <VisitorGatePass ref={printRef} visitor={data as VisitorEntry} />
            )}
          </div>
          <Button onClick={() => handlePrint()} className="w-full">
            <Printer className="h-4 w-4 mr-2" />
            Print Gate Pass
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
