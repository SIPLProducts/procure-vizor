import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Users, Search, Plus, Eye, LogIn, LogOut, Phone, Laptop, Car, Camera, ShieldCheck, ShieldAlert } from "lucide-react";
import { useGateEntry, VisitorEntry } from "@/contexts/GateEntryContext";
import { PrintGatePass } from "./PrintGatePass";
import { CameraCapture } from "./CameraCapture";
import { FaceVerification } from "./FaceVerification";
import { format } from "date-fns";
import { toast } from "sonner";

export const VisitorManagement = () => {
  const { visitors, addVisitor, updateVisitor } = useGateEntry();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewVisitorOpen, setIsNewVisitorOpen] = useState(false);
  const [verifyingVisitor, setVerifyingVisitor] = useState<VisitorEntry | null>(null);
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    idType: "aadhar" as const,
    idNumber: "",
    purpose: "",
    hostName: "",
    hostDepartment: "",
    vehicleNumber: "",
    laptop: false,
    laptopSerial: "",
    photo: "",
  });

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; label: string }> = {
      checked_in: { class: "bg-green-500/10 text-green-500 border-green-500/20", label: "Inside" },
      checked_out: { class: "bg-slate-500/10 text-slate-500 border-slate-500/20", label: "Checked Out" },
      expected: { class: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Expected" },
    };
    const style = styles[status] || styles.expected;
    return (
      <Badge variant="outline" className={style.class}>
        {style.label}
      </Badge>
    );
  };

  const handleCheckIn = (visitor: VisitorEntry) => {
    // Open face verification dialog
    setVerifyingVisitor(visitor);
  };

  const handleFaceVerified = (imageData: string, verified: boolean) => {
    if (verifyingVisitor) {
      const badgeNumber = `VB-${Math.floor(Math.random() * 100) + 1}`;
      updateVisitor(verifyingVisitor.id, { 
        status: "checked_in", 
        entryTime: new Date(),
        badge: badgeNumber,
        photo: verifyingVisitor.photo || imageData, // Keep original or use new
        verifiedAtCheckIn: verified,
      });
      toast.success(
        `${verifyingVisitor.name} checked in successfully. Badge: ${badgeNumber}${verified ? " (Face verified)" : " (Manual override)"}`
      );
      setVerifyingVisitor(null);
    }
  };

  const handleCheckOut = (visitor: VisitorEntry) => {
    updateVisitor(visitor.id, { status: "checked_out", exitTime: new Date() });
    toast.success(`${visitor.name} checked out successfully`);
  };

  const handlePreRegister = () => {
    if (!newVisitor.name || !newVisitor.phone || !newVisitor.idNumber || !newVisitor.purpose || !newVisitor.hostName || !newVisitor.hostDepartment) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!newVisitor.photo) {
      toast.error("Please capture visitor photo for security");
      return;
    }
    addVisitor({
      name: newVisitor.name,
      phone: newVisitor.phone,
      email: newVisitor.email || undefined,
      company: newVisitor.company || undefined,
      idType: newVisitor.idType,
      idNumber: newVisitor.idNumber,
      photo: newVisitor.photo,
      purpose: newVisitor.purpose,
      hostName: newVisitor.hostName,
      hostDepartment: newVisitor.hostDepartment,
      entryTime: new Date(),
      status: "expected",
      vehicleNumber: newVisitor.vehicleNumber || undefined,
      laptop: newVisitor.laptop,
      laptopSerial: newVisitor.laptopSerial || undefined,
    });
    toast.success(`Visitor ${newVisitor.name} pre-registered successfully`);
    setIsNewVisitorOpen(false);
    setNewVisitor({
      name: "",
      phone: "",
      email: "",
      company: "",
      idType: "aadhar",
      idNumber: "",
      purpose: "",
      hostName: "",
      hostDepartment: "",
      vehicleNumber: "",
      laptop: false,
      laptopSerial: "",
      photo: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Visitor Management
            </CardTitle>
            <CardDescription>Track visitor entries, badges, and assets</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked_in">Inside</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="expected">Expected</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isNewVisitorOpen} onOpenChange={setIsNewVisitorOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Pre-Register
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Pre-Register Visitor</DialogTitle>
                  <DialogDescription>Enter visitor details for pre-registration</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="Enter visitor name"
                      value={newVisitor.name}
                      onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      placeholder="9876543210"
                      value={newVisitor.phone}
                      onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="visitor@company.com"
                      value={newVisitor.email}
                      onChange={(e) => setNewVisitor({ ...newVisitor, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      placeholder="Company name"
                      value={newVisitor.company}
                      onChange={(e) => setNewVisitor({ ...newVisitor, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID Type *</Label>
                    <Select
                      value={newVisitor.idType}
                      onValueChange={(v) => setNewVisitor({ ...newVisitor, idType: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="driving_license">Driving License</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="employee_id">Employee ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ID Number *</Label>
                    <Input
                      placeholder="Enter ID number"
                      value={newVisitor.idNumber}
                      onChange={(e) => setNewVisitor({ ...newVisitor, idNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Purpose of Visit *</Label>
                    <Textarea
                      placeholder="Enter purpose of visit"
                      value={newVisitor.purpose}
                      onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Host Name *</Label>
                    <Input
                      placeholder="Enter host name"
                      value={newVisitor.hostName}
                      onChange={(e) => setNewVisitor({ ...newVisitor, hostName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Host Department *</Label>
                    <Select
                      value={newVisitor.hostDepartment}
                      onValueChange={(v) => setNewVisitor({ ...newVisitor, hostDepartment: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Number (if any)</Label>
                    <Input
                      placeholder="MH12AB1234"
                      value={newVisitor.vehicleNumber}
                      onChange={(e) => setNewVisitor({ ...newVisitor, vehicleNumber: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox
                        id="laptop"
                        checked={newVisitor.laptop}
                        onCheckedChange={(checked) => setNewVisitor({ ...newVisitor, laptop: checked as boolean })}
                      />
                      <Label htmlFor="laptop" className="cursor-pointer">Carrying Laptop</Label>
                    </div>
                  </div>
                  {newVisitor.laptop && (
                    <div className="space-y-2 col-span-2">
                      <Label>Laptop Serial Number</Label>
                      <Input
                        placeholder="Enter laptop serial number"
                        value={newVisitor.laptopSerial}
                        onChange={(e) => setNewVisitor({ ...newVisitor, laptopSerial: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="space-y-2 col-span-2">
                    <Label>Visitor Photo * (for face verification)</Label>
                    <div className="flex items-center gap-4">
                      <CameraCapture
                        label="Photo"
                        currentImage={newVisitor.photo}
                        onCapture={(imageData) => setNewVisitor({ ...newVisitor, photo: imageData })}
                      />
                      <div className="text-sm text-muted-foreground">
                        {newVisitor.photo ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4" />
                            Photo captured for security verification
                          </span>
                        ) : (
                          "Capture visitor photo for security verification at check-in"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewVisitorOpen(false)}>Cancel</Button>
                  <Button onClick={handlePreRegister}>Pre-Register Visitor</Button>
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
                <TableHead>Photo</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>
                    {visitor.photo ? (
                      <img
                        src={visitor.photo}
                        alt={visitor.name}
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{visitor.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {visitor.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{visitor.company || "-"}</TableCell>
                  <TableCell>
                    <p className="text-sm max-w-[150px] truncate" title={visitor.purpose}>
                      {visitor.purpose}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{visitor.hostName}</p>
                      <p className="text-xs text-muted-foreground">{visitor.hostDepartment}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {visitor.status !== "expected" ? (
                      <>
                        <p>{format(visitor.entryTime, "hh:mm a")}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(visitor.entryTime, "dd MMM")}
                        </p>
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {visitor.badge ? (
                      <Badge variant="secondary">{visitor.badge}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {visitor.status === "checked_in" || visitor.status === "checked_out" ? (
                      visitor.verifiedAtCheckIn ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          Manual
                        </Badge>
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <PrintGatePass type="visitor" data={visitor} />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Visitor Details</DialogTitle>
                            <DialogDescription>{visitor.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {visitor.photo && (
                              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                                <img
                                  src={visitor.photo}
                                  alt={visitor.name}
                                  className="w-20 h-20 object-cover rounded-lg border"
                                />
                                <div>
                                  <p className="font-medium">{visitor.name}</p>
                                  {visitor.verifiedAtCheckIn !== undefined && (
                                    <Badge className={visitor.verifiedAtCheckIn 
                                      ? "bg-green-500/10 text-green-500 border-green-500/20 mt-1" 
                                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 mt-1"
                                    }>
                                      {visitor.verifiedAtCheckIn ? (
                                        <><ShieldCheck className="h-3 w-3 mr-1" /> Face Verified</>
                                      ) : (
                                        <><ShieldAlert className="h-3 w-3 mr-1" /> Manual Override</>
                                      )}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Phone</Label>
                                <p className="font-medium">{visitor.phone}</p>
                              </div>
                              {visitor.email && (
                                <div>
                                  <Label className="text-muted-foreground">Email</Label>
                                  <p className="font-medium">{visitor.email}</p>
                                </div>
                              )}
                              <div>
                                <Label className="text-muted-foreground">ID Type</Label>
                                <p className="font-medium uppercase">{visitor.idType.replace("_", " ")}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">ID Number</Label>
                                <p className="font-medium">{visitor.idNumber}</p>
                              </div>
                              {visitor.vehicleNumber && (
                                <div>
                                  <Label className="text-muted-foreground">Vehicle</Label>
                                  <p className="font-medium">{visitor.vehicleNumber}</p>
                                </div>
                              )}
                              {visitor.laptopSerial && (
                                <div>
                                  <Label className="text-muted-foreground">Laptop Serial</Label>
                                  <p className="font-medium">{visitor.laptopSerial}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {visitor.status === "expected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckIn(visitor)}
                        >
                          <LogIn className="h-4 w-4 mr-1" />
                          Check In
                        </Button>
                      )}
                      {visitor.status === "checked_in" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckOut(visitor)}
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
      
      {/* Face Verification Dialog */}
      {verifyingVisitor && (
        <FaceVerification
          isOpen={!!verifyingVisitor}
          onClose={() => setVerifyingVisitor(null)}
          visitorName={verifyingVisitor.name}
          referencePhoto={verifyingVisitor.photo}
          onVerified={handleFaceVerified}
        />
      )}
    </Card>
  );
};
