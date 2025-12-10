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
import { Truck, Search, Plus, Eye, LogOut, Phone, Scale, Camera } from "lucide-react";
import { useGateEntry, VehicleEntry } from "@/contexts/GateEntryContext";
import { PrintGatePass } from "./PrintGatePass";
import { CameraCapture } from "./CameraCapture";
import { WeighbridgeInput } from "./WeighbridgeIntegration";
import { format } from "date-fns";
import { toast } from "sonner";

export const VehicleRegistry = () => {
  const { vehicles, addVehicle, updateVehicle } = useGateEntry();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [checkoutVehicle, setCheckoutVehicle] = useState<VehicleEntry | null>(null);
  const [exitWeight, setExitWeight] = useState("");
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
    entryWeight: "",
    driverPhoto: "",
    vehiclePhoto: "",
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

  const handleCheckOut = () => {
    if (!checkoutVehicle) return;
    
    const exitWeightNum = parseFloat(exitWeight);
    const entryWeightNum = checkoutVehicle.entryWeight || 0;
    const netWeight = exitWeightNum && entryWeightNum 
      ? Math.abs(entryWeightNum - exitWeightNum) 
      : undefined;

    updateVehicle(checkoutVehicle.id, { 
      status: "out", 
      exitTime: new Date(),
      exitWeight: exitWeightNum || undefined,
      netWeight,
    });
    toast.success(`Vehicle ${checkoutVehicle.vehicleNumber} checked out successfully`);
    setCheckoutVehicle(null);
    setExitWeight("");
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
      entryWeight: newVehicle.entryWeight ? parseFloat(newVehicle.entryWeight) : undefined,
      driverPhoto: newVehicle.driverPhoto || undefined,
      vehiclePhoto: newVehicle.vehiclePhoto || undefined,
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
      entryWeight: "",
      driverPhoto: "",
      vehiclePhoto: "",
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
            <CardDescription>Track all vehicle entries and exits with weighbridge & photo capture</CardDescription>
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
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Vehicle</DialogTitle>
                  <DialogDescription>Enter vehicle and driver details with photo capture</DialogDescription>
                </DialogHeader>
                
                {/* Photo Capture Section */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Camera className="h-4 w-4" />
                    Photo Capture (AI Camera)
                  </Label>
                  <div className="flex gap-4 justify-center">
                    <CameraCapture
                      label="Driver Photo"
                      currentImage={newVehicle.driverPhoto}
                      onCapture={(img) => setNewVehicle({ ...newVehicle, driverPhoto: img })}
                    />
                    <CameraCapture
                      label="Vehicle Photo"
                      currentImage={newVehicle.vehiclePhoto}
                      onCapture={(img) => setNewVehicle({ ...newVehicle, vehiclePhoto: img })}
                    />
                  </div>
                </div>

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
                  
                  {/* Weighbridge Section */}
                  <div className="col-span-2 border rounded-lg p-4 bg-muted/30">
                    <WeighbridgeInput
                      label="Entry Weight (Weighbridge)"
                      value={newVehicle.entryWeight}
                      onChange={(v) => setNewVehicle({ ...newVehicle, entryWeight: v })}
                    />
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
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {vehicle.vehiclePhoto ? (
                        <img 
                          src={vehicle.vehiclePhoto} 
                          alt="Vehicle" 
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <span className="text-lg">{getVehicleTypeIcon(vehicle.vehicleType)}</span>
                      )}
                      <div>
                        <p className="font-medium">{vehicle.vehicleNumber}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {vehicle.vehicleType}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {vehicle.driverPhoto && (
                        <img 
                          src={vehicle.driverPhoto} 
                          alt="Driver" 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{vehicle.driverName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {vehicle.driverPhone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPurposeBadge(vehicle.purpose)}</TableCell>
                  <TableCell>
                    {vehicle.entryWeight ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3 text-emerald-500" />
                          <span>In: {vehicle.entryWeight.toLocaleString()}</span>
                        </div>
                        {vehicle.exitWeight && (
                          <>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Scale className="h-3 w-3 text-orange-500" />
                              <span>Out: {vehicle.exitWeight.toLocaleString()}</span>
                            </div>
                            {vehicle.netWeight && (
                              <div className="font-medium text-blue-500">
                                Net: {vehicle.netWeight.toLocaleString()}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p>{format(vehicle.entryTime, "hh:mm a")}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(vehicle.entryTime, "dd MMM yyyy")}
                    </p>
                  </TableCell>
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
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Vehicle Details</DialogTitle>
                            <DialogDescription>
                              {vehicle.vehicleNumber} - {vehicle.driverName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Photos */}
                            {(vehicle.driverPhoto || vehicle.vehiclePhoto) && (
                              <div className="flex gap-4 justify-center">
                                {vehicle.driverPhoto && (
                                  <div className="text-center">
                                    <img 
                                      src={vehicle.driverPhoto} 
                                      alt="Driver" 
                                      className="h-24 w-24 rounded-lg object-cover mx-auto"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Driver</p>
                                  </div>
                                )}
                                {vehicle.vehiclePhoto && (
                                  <div className="text-center">
                                    <img 
                                      src={vehicle.vehiclePhoto} 
                                      alt="Vehicle" 
                                      className="h-24 w-24 rounded-lg object-cover mx-auto"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Vehicle</p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Vehicle Type</Label>
                                <p className="font-medium capitalize">{vehicle.vehicleType}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">License</Label>
                                <p className="font-medium">{vehicle.driverLicense || "-"}</p>
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

                            {/* Weighbridge Info */}
                            {vehicle.entryWeight && (
                              <div className="border rounded-lg p-3 bg-muted/30">
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                  <Scale className="h-4 w-4" />
                                  Weighbridge Data
                                </Label>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                  <div className="bg-emerald-500/10 rounded p-2">
                                    <p className="text-xs text-muted-foreground">Entry</p>
                                    <p className="font-bold">{vehicle.entryWeight.toLocaleString()} kg</p>
                                  </div>
                                  <div className="bg-orange-500/10 rounded p-2">
                                    <p className="text-xs text-muted-foreground">Exit</p>
                                    <p className="font-bold">
                                      {vehicle.exitWeight ? `${vehicle.exitWeight.toLocaleString()} kg` : "-"}
                                    </p>
                                  </div>
                                  <div className="bg-blue-500/10 rounded p-2">
                                    <p className="text-xs text-muted-foreground">Net</p>
                                    <p className="font-bold">
                                      {vehicle.netWeight ? `${vehicle.netWeight.toLocaleString()} kg` : "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

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
                        <Dialog open={checkoutVehicle?.id === vehicle.id} onOpenChange={(open) => !open && setCheckoutVehicle(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCheckoutVehicle(vehicle)}
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Check Out
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Vehicle Checkout</DialogTitle>
                              <DialogDescription>
                                {vehicle.vehicleNumber} - Capture exit weight
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              {vehicle.entryWeight && (
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <p className="text-sm text-muted-foreground">Entry Weight</p>
                                  <p className="text-xl font-bold">{vehicle.entryWeight.toLocaleString()} kg</p>
                                </div>
                              )}
                              <WeighbridgeInput
                                label="Exit Weight"
                                value={exitWeight}
                                onChange={setExitWeight}
                              />
                              {exitWeight && vehicle.entryWeight && (
                                <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                                  <p className="text-sm text-muted-foreground">Net Weight</p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    {Math.abs(vehicle.entryWeight - parseFloat(exitWeight)).toLocaleString()} kg
                                  </p>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setCheckoutVehicle(null)}>Cancel</Button>
                              <Button onClick={handleCheckOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Complete Checkout
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
