import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { VisitorEntry } from "@/contexts/GateEntryContext";
import { format } from "date-fns";

interface VisitorGatePassProps {
  visitor: VisitorEntry;
}

export const VisitorGatePass = forwardRef<HTMLDivElement, VisitorGatePassProps>(
  ({ visitor }, ref) => {
    const qrData = JSON.stringify({
      type: "visitor",
      id: visitor.id,
      name: visitor.name,
      phone: visitor.phone,
      badge: visitor.badge,
      entryTime: visitor.entryTime.toISOString(),
    });

    return (
      <div ref={ref} className="bg-white p-6 w-[400px] text-black print:block">
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-4 mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold uppercase tracking-wide text-blue-800">Visitor Pass</h1>
            <p className="text-sm text-gray-600">Authorized Entry Document</p>
          </div>
        </div>

        {/* Badge and QR Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {visitor.badge && (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block">
                <p className="text-xs opacity-80">Badge Number</p>
                <p className="text-2xl font-bold">{visitor.badge}</p>
              </div>
            )}
          </div>
          <div className="border-2 border-gray-300 p-2 rounded">
            <QRCodeSVG value={qrData} size={100} level="M" />
          </div>
        </div>

        {/* Visitor Details */}
        <div className="space-y-3 text-sm">
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-600 uppercase font-medium">Visitor Information</p>
            <p className="text-xl font-bold mt-1">{visitor.name}</p>
            {visitor.company && <p className="text-gray-600">{visitor.company}</p>}
          </div>

          <div className="border rounded p-3">
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{visitor.phone}</p>
              </div>
              {visitor.email && (
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-xs">{visitor.email}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">ID Type</p>
                <p className="font-medium uppercase">{visitor.idType.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ID Number</p>
                <p className="font-medium">{visitor.idNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border rounded p-3">
            <p className="text-xs text-gray-500 uppercase">Purpose of Visit</p>
            <p className="font-medium mt-1">{visitor.purpose}</p>
          </div>

          <div className="border rounded p-3">
            <p className="text-xs text-gray-500 uppercase mb-2">Host Details</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Host Name</p>
                <p className="font-medium">{visitor.hostName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium">{visitor.hostDepartment}</p>
              </div>
            </div>
          </div>

          {/* Assets Section */}
          {(visitor.vehicleNumber || visitor.laptop) && (
            <div className="border border-amber-200 bg-amber-50 rounded p-3">
              <p className="text-xs text-amber-700 uppercase font-medium mb-2">Registered Assets</p>
              <div className="flex gap-4">
                {visitor.vehicleNumber && (
                  <div>
                    <p className="text-xs text-gray-500">Vehicle</p>
                    <p className="font-medium">{visitor.vehicleNumber}</p>
                  </div>
                )}
                {visitor.laptop && (
                  <div>
                    <p className="text-xs text-gray-500">Laptop Serial</p>
                    <p className="font-medium">{visitor.laptopSerial || "Registered"}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 border border-green-200 p-2 rounded">
              <p className="text-xs text-gray-500">Check-In Time</p>
              <p className="font-bold text-green-700 text-sm">
                {visitor.status !== "expected"
                  ? format(visitor.entryTime, "dd MMM, hh:mm a")
                  : "Not checked in"}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-2 rounded">
              <p className="text-xs text-gray-500">Status</p>
              <p className={`font-bold text-sm ${
                visitor.status === "checked_in" ? "text-green-600" : 
                visitor.status === "expected" ? "text-blue-600" : "text-gray-600"
              }`}>
                {visitor.status === "checked_in" ? "INSIDE" : 
                 visitor.status === "expected" ? "EXPECTED" : "CHECKED OUT"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-blue-600">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500">Pass Issued On</p>
              <p className="text-xs">{format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
            </div>
            <div className="text-right">
              <div className="border-t border-black w-32 mb-1"></div>
              <p className="text-xs text-gray-500">Security Officer</p>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 mt-3">
            This pass must be worn visibly at all times
          </p>
        </div>
      </div>
    );
  }
);

VisitorGatePass.displayName = "VisitorGatePass";
