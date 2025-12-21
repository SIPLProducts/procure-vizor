import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Send,
  Clock,
  CheckCircle,
  Package,
  Calendar,
  IndianRupee,
  LogOut,
  Building2,
  Eye,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import sharviLogo from "@/assets/sharvi-logo.png";

interface VendorRFQ {
  id: string;
  rfqNo: string;
  title: string;
  material: string;
  materialCode: string;
  quantity: number;
  unit: string;
  dueDate: string;
  receivedDate: string;
  specifications: string;
  status: "pending" | "submitted" | "expired";
  submittedQuotation?: {
    unitPrice: number;
    totalPrice: number;
    leadTime: number;
    validUntil: string;
    notes: string;
  };
}

const mockVendorRFQs: VendorRFQ[] = [
  {
    id: "1",
    rfqNo: "RFQ-2024-001",
    title: "Steel Plates 3mm - Q1 Requirement",
    material: "Steel Plates 3mm",
    materialCode: "MAT-001",
    quantity: 5000,
    unit: "kg",
    dueDate: "2024-12-25",
    receivedDate: "2024-12-10",
    specifications: "Grade: SS304, Thickness: 3mm ± 0.1mm, Width: 1000mm, Length: 2000mm",
    status: "pending",
  },
  {
    id: "2",
    rfqNo: "RFQ-2024-002",
    title: "Packaging Materials - Cartons",
    material: "Corrugated Cartons",
    materialCode: "MAT-045",
    quantity: 10000,
    unit: "pcs",
    dueDate: "2024-12-20",
    receivedDate: "2024-12-08",
    specifications: "Size: 400x300x250mm, 5-ply, Burst Factor: 180",
    status: "submitted",
    submittedQuotation: {
      unitPrice: 12,
      totalPrice: 120000,
      leadTime: 7,
      validUntil: "2024-12-30",
      notes: "Price includes delivery to your warehouse",
    },
  },
  {
    id: "3",
    rfqNo: "RFQ-2024-006",
    title: "Copper Wire - Electrical",
    material: "Copper Wire 2.5mm",
    materialCode: "MAT-067",
    quantity: 1000,
    unit: "meters",
    dueDate: "2024-12-15",
    receivedDate: "2024-12-01",
    specifications: "ISI marked, PVC insulated, 2.5 sq mm",
    status: "expired",
  },
];

export default function VendorPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [selectedRFQ, setSelectedRFQ] = useState<VendorRFQ | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [quotationForm, setQuotationForm] = useState({
    unitPrice: "",
    leadTime: "",
    validUntil: "",
    notes: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would validate against backend
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the Vendor Portal",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ email: "", password: "" });
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const handleSubmitQuotation = () => {
    if (!selectedRFQ) return;
    
    toast({
      title: "Quotation Submitted",
      description: `Your quotation for ${selectedRFQ.rfqNo} has been submitted successfully.`,
    });
    setSubmitDialogOpen(false);
    setQuotationForm({ unitPrice: "", leadTime: "", validUntil: "", notes: "" });
    setSelectedRFQ(null);
  };

  const formatDate = (dateStr: string) => format(new Date(dateStr), "dd MMM yyyy");

  const getDaysRemaining = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    return days;
  };

  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600" },
    submitted: { label: "Submitted", className: "bg-green-500/10 text-green-600" },
    expired: { label: "Expired", className: "bg-red-500/10 text-red-600" },
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center mb-8">
            <img src={sharviLogo} alt="Sharvi Infotech" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Vendor Portal</h1>
            <p className="text-muted-foreground mt-2">
              Login to view RFQs and submit quotations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vendor@company.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? Contact the procurement team.
          </p>
        </Card>
      </div>
    );
  }

  // Vendor Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={sharviLogo} alt="Sharvi Infotech" className="h-10" />
            <div>
              <h1 className="font-semibold text-foreground">Vendor Portal</h1>
              <p className="text-sm text-muted-foreground">ABC Metals Pvt Ltd</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockVendorRFQs.length}</p>
                <p className="text-sm text-muted-foreground">Total RFQs</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockVendorRFQs.filter((r) => r.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockVendorRFQs.filter((r) => r.status === "submitted").length}
                </p>
                <p className="text-sm text-muted-foreground">Submitted</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* RFQ Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All RFQs</TabsTrigger>
            <TabsTrigger value="pending">Pending ({mockVendorRFQs.filter((r) => r.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>RFQ No</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendorRFQs.map((rfq) => {
                    const daysLeft = getDaysRemaining(rfq.dueDate);
                    return (
                      <TableRow key={rfq.id} className="hover:bg-secondary/30">
                        <TableCell className="font-medium text-primary">{rfq.rfqNo}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rfq.material}</p>
                            <p className="text-xs text-muted-foreground">{rfq.materialCode}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {rfq.quantity.toLocaleString()} {rfq.unit}
                        </TableCell>
                        <TableCell>{formatDate(rfq.dueDate)}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              daysLeft < 0
                                ? "bg-red-500/10 text-red-600"
                                : daysLeft <= 3
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-green-500/10 text-green-600"
                            } border-0`}
                          >
                            {daysLeft < 0 ? "Overdue" : `${daysLeft} days`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[rfq.status].className} border-0`}>
                            {statusConfig[rfq.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRFQ(rfq)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {rfq.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRFQ(rfq);
                                  setSubmitDialogOpen(true);
                                }}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Quote
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="p-6">
              <div className="space-y-4">
                {mockVendorRFQs
                  .filter((r) => r.status === "pending")
                  .map((rfq) => (
                    <div
                      key={rfq.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-primary">{rfq.rfqNo}</span>
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-0">
                            {getDaysRemaining(rfq.dueDate)} days left
                          </Badge>
                        </div>
                        <p className="font-medium">{rfq.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {rfq.quantity.toLocaleString()} {rfq.unit} • Due: {formatDate(rfq.dueDate)}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedRFQ(rfq);
                          setSubmitDialogOpen(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Quotation
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="submitted">
            <Card className="p-6">
              <div className="space-y-4">
                {mockVendorRFQs
                  .filter((r) => r.status === "submitted")
                  .map((rfq) => (
                    <div
                      key={rfq.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium text-primary">{rfq.rfqNo}</span>
                          <Badge className="ml-2 bg-green-500/10 text-green-600 border-0">
                            Submitted
                          </Badge>
                        </div>
                      </div>
                      <p className="font-medium mb-2">{rfq.title}</p>
                      {rfq.submittedQuotation && (
                        <div className="grid grid-cols-4 gap-4 bg-secondary/50 p-3 rounded-lg text-sm">
                          <div>
                            <p className="text-muted-foreground">Unit Price</p>
                            <p className="font-semibold">
                              ₹{rfq.submittedQuotation.unitPrice}/{rfq.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="font-semibold">
                              ₹{rfq.submittedQuotation.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Lead Time</p>
                            <p className="font-semibold">{rfq.submittedQuotation.leadTime} days</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Valid Until</p>
                            <p className="font-semibold">{formatDate(rfq.submittedQuotation.validUntil)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Submit Quotation Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Quotation</DialogTitle>
          </DialogHeader>

          {selectedRFQ && (
            <div className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">RFQ Details</p>
                <p className="font-medium">{selectedRFQ.rfqNo} - {selectedRFQ.title}</p>
                <p className="text-sm mt-1">
                  {selectedRFQ.quantity.toLocaleString()} {selectedRFQ.unit} • Due: {formatDate(selectedRFQ.dueDate)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{selectedRFQ.specifications}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="unitPrice"
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={quotationForm.unitPrice}
                      onChange={(e) =>
                        setQuotationForm({ ...quotationForm, unitPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="leadTime"
                      type="number"
                      placeholder="0"
                      className="pl-9"
                      value={quotationForm.leadTime}
                      onChange={(e) =>
                        setQuotationForm({ ...quotationForm, leadTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Quotation Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={quotationForm.validUntil}
                  onChange={(e) =>
                    setQuotationForm({ ...quotationForm, validUntil: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Terms</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional terms or notes..."
                  value={quotationForm.notes}
                  onChange={(e) => setQuotationForm({ ...quotationForm, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {quotationForm.unitPrice && selectedRFQ && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Quotation Value</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{(parseFloat(quotationForm.unitPrice) * selectedRFQ.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitQuotation}>
              <Send className="w-4 h-4 mr-2" />
              Submit Quotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
