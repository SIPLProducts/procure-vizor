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
import { Users, Search, Plus, Eye, LogIn, LogOut, Phone, Mail, Laptop, Car } from "lucide-react";
import { VisitorEntry } from "@/pages/GateEntry";
import { format } from "date-fns";
import { toast } from "sonner";

interface VisitorManagementProps {
  visitors: VisitorEntry[];
}

export const VisitorManagement = ({ visitors }: VisitorManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    toast.success(`${visitor.name} checked in successfully. Badge: VB-${Math.floor(Math.random() * 100) + 1}`);
  };

  const handleCheckOut = (visitor: VisitorEntry) => {
    toast.success(`${visitor.name} checked out successfully`);
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
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Pre-Register
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
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
                    <div className="flex gap-1">
                      {visitor.laptop && (
                        <Badge variant="outline" className="text-xs">
                          <Laptop className="h-3 w-3 mr-1" />
                          Laptop
                        </Badge>
                      )}
                      {visitor.vehicleNumber && (
                        <Badge variant="outline" className="text-xs">
                          <Car className="h-3 w-3 mr-1" />
                          Vehicle
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(visitor.status)}</TableCell>
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
                            <DialogTitle>Visitor Details</DialogTitle>
                            <DialogDescription>{visitor.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
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
                            <div>
                              <Label className="text-muted-foreground">Purpose</Label>
                              <p className="text-sm">{visitor.purpose}</p>
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
    </Card>
  );
};
