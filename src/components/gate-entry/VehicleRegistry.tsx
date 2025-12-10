import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Search, Plus, Eye, LogOut, Phone } from "lucide-react";
import { useGateEntry, VehicleEntry } from "@/contexts/GateEntryContext";
import { PrintGatePass } from "./PrintGatePass";
import { format } from "date-fns";
import { toast } from "sonner";

export const VehicleRegistry = () => {
  const { vehicles, addVehicle, updateVehicle } = useGateEntry();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "truck" as const,
    driverName: "",
    driverPhone: "",
    driverLicense: "",
    purpose: "delivery" as const,
    vendor: "",
    poNumber: "",
    gateNumber: "Gate 1",
    remarks: "",
  });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleEntry | null>(null);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVehicleTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      truck: "🚛",
      van: "🚐",
      car: "🚗",
      bike: "🏍️",
      other: "🚜",
    };
    return icons[type] || "🚗";
  };

  const getPurposeBadge = (purpose: string) => {
    const styles: Record<string, string> = {
      delivery: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      pickup: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      service: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      visitor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      employee: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };
    return (
      <Badge variant="outline" className={styles[purpose] || ""}>
        {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
      </Badge>
    );
  };

  const handleCheckOut = (vehicle: VehicleEntry) => {
    updateVehicle(vehicle.id, { status: "out", exitTime: new Date() });
    toast.success(`Vehicle ${vehicle.vehicleNumber} checked out successfully`);
  };

  const handleCreateEntry = () => {
    if (!newVehicle.vehicleNumber || !newVehicle.driverName || !newVehicle.driverPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    addVehicle({
      ...newVehicle,
      entryTime: new Date(),
      status: "in",
    });
    toast.success(`Vehicle ${newVehicle.vehicleNumber} registered successfully`);
    setIsNewEntryOpen(false);
    setNewVehicle({
      vehicleNumber: "",
      vehicleType: "truck",
      driverName: "",
      driverPhone: "",
      driverLicense: "",
      purpose: "delivery",
      vendor: "",
      poNumber: "",
      gateNumber: "Gate 1",
      remarks: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Vehicle Registry
            </CardTitle>
            <CardDescription>Track all vehicle entries and exits</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in">Inside</SelectItem>
                <SelectItem value="out">Exited</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Register New Vehicle</DialogTitle>
                  <DialogDescription>Enter vehicle and driver details</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                    <Input
                      id="vehicleNumber"
                      placeholder="MH12AB1234"
                      value={newVehicle.vehicleNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={newVehicle.vehicleType}
                      onValueChange={(v) => setNewVehicle({ ...newVehicle, vehicleType: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name *</Label>
                    <Input
                      id="driverName"
                      placeholder="Enter driver name"
                      value={newVehicle.driverName}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverPhone">Driver Phone *</Label>
                    <Input
                      id="driverPhone"
                      placeholder="9876543210"
                      value={newVehicle.driverPhone}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverLicense">License Number</Label>
                    <Input
                      id="driverLicense"
                      placeholder="MH1220200012345"
                      value={newVehicle.driverLicense}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driverLicense: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select
                      value={newVehicle.purpose}
                      onValueChange={(v) => setNewVehicle({ ...newVehicle, purpose: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Company</Label>
                    <Input
                      id="vendor"
                      placeholder="Enter vendor name"
                      value={newVehicle.vendor}
                      onChange={(e) => setNewVehicle({ ...newVehicle, vendor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poNumber">PO/Reference Number</Label>
                    <Input
                      id="poNumber"
                      placeholder="PO-2024-0001"
                      value={newVehicle.poNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, poNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gateNumber">Entry Gate</Label>
                    <Select
                      value={newVehicle.gateNumber}
                      onValueChange={(v) => setNewVehicle({ ...newVehicle, gateNumber: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gate 1">Gate 1</SelectItem>
                        <SelectItem value="Gate 2">Gate 2</SelectItem>
                        <SelectItem value="Gate 3">Gate 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea
                      id="remarks"
                      placeholder="Any additional notes..."
                      value={newVehicle.remarks}
                      onChange={(e) => setNewVehicle({ ...newVehicle, remarks: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateEntry}>Register Vehicle</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Vendor/PO</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Gate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getVehicleTypeIcon(vehicle.vehicleType)}</span>
                      <div>
                        <p className="font-medium">{vehicle.vehicleNumber}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {vehicle.vehicleType}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vehicle.driverName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {vehicle.driverPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getPurposeBadge(vehicle.purpose)}</TableCell>
                  <TableCell>
                    {vehicle.vendor && <p className="text-sm">{vehicle.vendor}</p>}
                    {vehicle.poNumber && (
                      <p className="text-xs text-muted-foreground">{vehicle.poNumber}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p>{format(vehicle.entryTime, "hh:mm a")}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(vehicle.entryTime, "dd MMM yyyy")}
                    </p>
                  </TableCell>
                  <TableCell>{vehicle.gateNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        vehicle.status === "in"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      }
                    >
                      {vehicle.status === "in" ? "Inside" : "Exited"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <PrintGatePass type="vehicle" data={vehicle} />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedVehicle(vehicle)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Vehicle Details</DialogTitle>
                            <DialogDescription>
                              {vehicle.vehicleNumber} - {vehicle.driverName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Vehicle Type</Label>
                                <p className="font-medium capitalize">{vehicle.vehicleType}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">License</Label>
                                <p className="font-medium">{vehicle.driverLicense}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Entry Time</Label>
                                <p className="font-medium">
                                  {format(vehicle.entryTime, "dd MMM yyyy, hh:mm a")}
                                </p>
                              </div>
                              {vehicle.exitTime && (
                                <div>
                                  <Label className="text-muted-foreground">Exit Time</Label>
                                  <p className="font-medium">
                                    {format(vehicle.exitTime, "dd MMM yyyy, hh:mm a")}
                                  </p>
                                </div>
                              )}
                            </div>
                            {vehicle.remarks && (
                              <div>
                                <Label className="text-muted-foreground">Remarks</Label>
                                <p className="text-sm">{vehicle.remarks}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {vehicle.status === "in" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckOut(vehicle)}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
