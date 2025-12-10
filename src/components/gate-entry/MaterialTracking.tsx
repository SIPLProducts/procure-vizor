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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Package, Search, Plus, Eye, CheckCircle, XCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MaterialEntry } from "@/pages/GateEntry";
import { format } from "date-fns";
import { toast } from "sonner";

interface MaterialTrackingProps {
  materials: MaterialEntry[];
}

export const MaterialTracking = ({ materials }: MaterialTrackingProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.materialDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || material.type === typeFilter;
    const matchesStatus = statusFilter === "all" || material.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      verified: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
      <Badge variant="outline" className={styles[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleVerify = (material: MaterialEntry) => {
    toast.success(`Material ${material.id} verified and GRN generated`);
  };

  const handleReject = (material: MaterialEntry) => {
    toast.error(`Material ${material.id} rejected`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Material Inward/Outward
            </CardTitle>
            <CardDescription>Track material movement with verification</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[180px]"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inward">Inward</SelectItem>
                <SelectItem value="outward">Outward</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Entry
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>PO/Invoice</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        material.type === "inward"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      }
                    >
                      {material.type === "inward" ? (
                        <ArrowDownLeft className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      )}
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{material.materialDescription}</p>
                      {material.grnNumber && (
                        <p className="text-xs text-muted-foreground">{material.grnNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{material.quantity}</span>{" "}
                    <span className="text-muted-foreground">{material.unit}</span>
                  </TableCell>
                  <TableCell>{material.vehicleNumber}</TableCell>
                  <TableCell>
                    {material.poNumber && <p className="text-sm">{material.poNumber}</p>}
                    {material.invoiceNumber && (
                      <p className="text-xs text-muted-foreground">{material.invoiceNumber}</p>
                    )}
                  </TableCell>
                  <TableCell>{material.department}</TableCell>
                  <TableCell>
                    <p>{format(material.timestamp, "hh:mm a")}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(material.timestamp, "dd MMM")}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(material.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Material Details</DialogTitle>
                            <DialogDescription>{material.materialDescription}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Type</Label>
                                <p className="font-medium capitalize">{material.type}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Quantity</Label>
                                <p className="font-medium">
                                  {material.quantity} {material.unit}
                                </p>
                              </div>
                              {material.vendor && (
                                <div>
                                  <Label className="text-muted-foreground">Vendor</Label>
                                  <p className="font-medium">{material.vendor}</p>
                                </div>
                              )}
                              <div>
                                <Label className="text-muted-foreground">
                                  {material.type === "inward" ? "Received By" : "Dispatched By"}
                                </Label>
                                <p className="font-medium">
                                  {material.receivedBy || material.dispatchedBy || "-"}
                                </p>
                              </div>
                            </div>
                            {material.remarks && (
                              <div>
                                <Label className="text-muted-foreground">Remarks</Label>
                                <p className="text-sm">{material.remarks}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {material.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-500"
                            onClick={() => handleVerify(material)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleReject(material)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
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
