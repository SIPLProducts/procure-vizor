import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { VehicleEntry } from "@/contexts/GateEntryContext";
import { format } from "date-fns";

interface VehicleGatePassProps {
  vehicle: VehicleEntry;
}

export const VehicleGatePass = forwardRef<HTMLDivElement, VehicleGatePassProps>(
  ({ vehicle }, ref) => {
    const qrData = JSON.stringify({
      type: "vehicle",
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      driverName: vehicle.driverName,
      entryTime: vehicle.entryTime.toISOString(),
    });

    return (
      <div ref={ref} className="bg-white p-6 w-[400px] text-black print:block">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold uppercase tracking-wide">Vehicle Gate Pass</h1>
            <p className="text-sm text-gray-600">Authorized Entry Document</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center mb-4">
          <div className="border-2 border-gray-300 p-2 rounded">
            <QRCodeSVG value={qrData} size={120} level="M" />
          </div>
        </div>

        {/* Pass Details */}
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-xs text-gray-500 uppercase">Pass ID</p>
              <p className="font-bold">{vehicle.id}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-xs text-gray-500 uppercase">Gate</p>
              <p className="font-bold">{vehicle.gateNumber}</p>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <p className="text-xs text-gray-500">Vehicle Number</p>
                <p className="font-bold text-lg">{vehicle.vehicleNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Vehicle Type</p>
                <p className="font-medium capitalize">{vehicle.vehicleType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Driver Name</p>
                <p className="font-medium">{vehicle.driverName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Driver Phone</p>
                <p className="font-medium">{vehicle.driverPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">License Number</p>
                <p className="font-medium">{vehicle.driverLicense || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Purpose</p>
                <p className="font-medium capitalize">{vehicle.purpose}</p>
              </div>
            </div>
          </div>

          {vehicle.vendor && (
            <div className="border rounded p-3">
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Vendor/Company</p>
                  <p className="font-medium">{vehicle.vendor}</p>
                </div>
                {vehicle.poNumber && (
                  <div>
                    <p className="text-xs text-gray-500">PO/Reference</p>
                    <p className="font-medium">{vehicle.poNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 border border-green-200 p-2 rounded">
              <p className="text-xs text-gray-500">Entry Time</p>
              <p className="font-bold text-green-700">
                {format(vehicle.entryTime, "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-2 rounded">
              <p className="text-xs text-gray-500">Status</p>
              <p className={`font-bold ${vehicle.status === "in" ? "text-green-600" : "text-gray-600"}`}>
                {vehicle.status === "in" ? "INSIDE PREMISES" : "EXITED"}
              </p>
            </div>
          </div>

          {vehicle.remarks && (
            <div className="border-t pt-2">
              <p className="text-xs text-gray-500">Remarks</p>
              <p className="text-sm">{vehicle.remarks}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-black">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500">Printed on</p>
              <p className="text-xs">{format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
            </div>
            <div className="text-right">
              <div className="border-t border-black w-32 mb-1"></div>
              <p className="text-xs text-gray-500">Security Officer</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VehicleGatePass.displayName = "VehicleGatePass";
