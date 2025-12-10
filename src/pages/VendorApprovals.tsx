import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  UserCheck,
  Shield,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type WorkflowStage = "pending" | "documents_pending" | "documents_approved" | "pending_approval" | "approved" | "rejected" | "active";

interface VendorApproval {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  status: WorkflowStage;
  created_at: string;
  documents_status: "pending" | "approved" | "rejected" | "partial";
  total_documents: number;
  approved_documents: number;
}

const workflowStages: { key: WorkflowStage; label: string; icon: React.ElementType; color: string }[] = [
  { key: "pending", label: "Pending", icon: Clock, color: "bg-slate-100 text-slate-700 border-slate-200" },
  { key: "documents_pending", label: "Documents Pending", icon: Clock, color: "bg-amber-100 text-amber-700 border-amber-200" },
  { key: "documents_approved", label: "Documents Approved", icon: FileCheck, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { key: "pending_approval", label: "Pending Approval", icon: UserCheck, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { key: "approved", label: "Approved", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { key: "active", label: "Active", icon: Shield, color: "bg-green-100 text-green-700 border-green-200" },
  { key: "rejected", label: "Rejected", icon: XCircle, color: "bg-red-100 text-red-700 border-red-200" },
];

const getStageConfig = (stage: WorkflowStage) => {
  return workflowStages.find((s) => s.key === stage) || workflowStages[0];
};

export default function VendorApprovals() {
  const [vendors, setVendors] = useState<VendorApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | "activate";
    vendorIds: string[];
  }>({ open: false, type: "approve", vendorIds: [] });
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (vendorsError) throw vendorsError;

      // Fetch document counts for each vendor
      const vendorApprovals: VendorApproval[] = await Promise.all(
        (vendorsData || []).map(async (vendor) => {
          const { data: docs, error: docsError } = await supabase
            .from("vendor_documents")
            .select("status")
            .eq("vendor_id", vendor.id);

          if (docsError) {
            console.error("Error fetching documents:", docsError);
          }

          const totalDocs = docs?.length || 0;
          const approvedDocs = docs?.filter((d) => d.status === "approved").length || 0;
          const pendingDocs = docs?.filter((d) => d.status === "pending").length || 0;
          const rejectedDocs = docs?.filter((d) => d.status === "rejected").length || 0;

          let documentsStatus: "pending" | "approved" | "rejected" | "partial" = "pending";
          if (totalDocs > 0) {
            if (approvedDocs === totalDocs) documentsStatus = "approved";
            else if (rejectedDocs > 0) documentsStatus = "rejected";
            else if (approvedDocs > 0) documentsStatus = "partial";
          }

          return {
            id: vendor.id,
            company_name: vendor.company_name,
            contact_person: vendor.contact_person,
            email: vendor.email,
            phone: vendor.phone,
            status: vendor.status as WorkflowStage,
            created_at: vendor.created_at,
            documents_status: documentsStatus,
            total_documents: totalDocs,
            approved_documents: approvedDocs,
          };
        })
      );

      setVendors(vendorApprovals);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact_person.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || vendor.status === stageFilter;
    return matchesSearch && matchesStage;
  });

  const toggleSelectAll = () => {
    if (selectedVendors.length === filteredVendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(filteredVendors.map((v) => v.id));
    }
  };

  const toggleSelectVendor = (id: string) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const openActionDialog = (type: "approve" | "reject" | "activate", vendorIds: string[]) => {
    setActionDialog({ open: true, type, vendorIds });
    setRejectionReason("");
  };

  const handleBulkAction = async () => {
    if (actionDialog.vendorIds.length === 0) return;

    setProcessingAction(true);
    try {
      let newStatus: WorkflowStage;
      switch (actionDialog.type) {
        case "approve":
          newStatus = "approved";
          break;
        case "activate":
          newStatus = "active";
          break;
        case "reject":
          newStatus = "rejected";
          break;
      }

      const { error } = await supabase
        .from("vendors")
        .update({ 
          status: newStatus,
          ...(actionDialog.type === "reject" && { notes: rejectionReason })
        })
        .in("id", actionDialog.vendorIds);

      if (error) throw error;

      toast.success(
        `${actionDialog.vendorIds.length} vendor(s) ${actionDialog.type === "reject" ? "rejected" : actionDialog.type === "activate" ? "activated" : "approved"} successfully`
      );

      setSelectedVendors([]);
      setActionDialog({ open: false, type: "approve", vendorIds: [] });
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendors:", error);
      toast.error("Failed to update vendors");
    } finally {
      setProcessingAction(false);
    }
  };

  const getAvailableActions = (vendor: VendorApproval) => {
    const actions: { type: "approve" | "reject" | "activate"; label: string; disabled?: boolean; reason?: string }[] = [];

    switch (vendor.status) {
      case "documents_pending":
      case "pending":
        if (vendor.documents_status === "approved") {
          actions.push({ type: "approve", label: "Approve Vendor" });
        } else {
          actions.push({ 
            type: "approve", 
            label: "Approve Vendor", 
            disabled: true, 
            reason: "All documents must be approved first" 
          });
        }
        actions.push({ type: "reject", label: "Reject" });
        break;
      case "documents_approved":
      case "pending_approval":
        actions.push({ type: "approve", label: "Approve Vendor" });
        actions.push({ type: "reject", label: "Reject" });
        break;
      case "approved":
        actions.push({ type: "activate", label: "Activate Vendor" });
        actions.push({ type: "reject", label: "Reject" });
        break;
    }

    return actions;
  };

  const stageCounts = workflowStages.map((stage) => ({
    ...stage,
    count: vendors.filter((v) => v.status === stage.key).length,
  }));

  return (
    <MainLayout title="Vendor Approvals" subtitle="Review and approve vendors through the workflow">
      {/* Workflow Stage Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stageCounts.map((stage) => {
          const Icon = stage.icon;
          return (
            <Card
              key={stage.key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                stageFilter === stage.key ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setStageFilter(stageFilter === stage.key ? "all" : stage.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stage.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stage.count}</p>
                    <p className="text-xs text-muted-foreground truncate">{stage.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workflow Progress Indicator */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {workflowStages.slice(0, -1).map((stage, index) => {
              const Icon = stage.icon;
              const isLast = index === workflowStages.length - 2;
              return (
                <div key={stage.key} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${stage.color}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium whitespace-nowrap">{stage.label}</span>
                  </div>
                  {!isLast && (
                    <ChevronRight className="w-5 h-5 mx-2 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-4 items-center w-full md:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {workflowStages.map((stage) => (
                    <SelectItem key={stage.key} value={stage.key}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchVendors}>
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {selectedVendors.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedVendors.length} selected
                </Badge>
                <Button
                  size="sm"
                  onClick={() => openActionDialog("approve", selectedVendors)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Bulk Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openActionDialog("reject", selectedVendors)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Bulk Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openActionDialog("activate", selectedVendors)}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Bulk Activate
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Vendors ({filteredVendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No vendors found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => {
                  const stageConfig = getStageConfig(vendor.status);
                  const StageIcon = stageConfig.icon;
                  const actions = getAvailableActions(vendor);

                  return (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedVendors.includes(vendor.id)}
                          onCheckedChange={() => toggleSelectVendor(vendor.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vendor.company_name}</p>
                          <p className="text-sm text-muted-foreground">{vendor.contact_person}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {vendor.email}
                          </div>
                          {vendor.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {vendor.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              vendor.documents_status === "approved"
                                ? "bg-emerald-500"
                                : vendor.documents_status === "rejected"
                                ? "bg-red-500"
                                : vendor.documents_status === "partial"
                                ? "bg-amber-500"
                                : "bg-slate-300"
                            }`}
                          />
                          <span className="text-sm">
                            {vendor.approved_documents}/{vendor.total_documents} approved
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={stageConfig.color}>
                          <StageIcon className="w-3 h-3 mr-1" />
                          {stageConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(vendor.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {actions.map((action) => (
                            <Button
                              key={action.type}
                              size="sm"
                              variant={action.type === "reject" ? "destructive" : action.type === "activate" ? "outline" : "default"}
                              disabled={action.disabled}
                              onClick={() => openActionDialog(action.type, [vendor.id])}
                              className={action.type === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                              title={action.reason}
                            >
                              {action.type === "approve" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {action.type === "reject" && <XCircle className="w-3 h-3 mr-1" />}
                              {action.type === "activate" && <Shield className="w-3 h-3 mr-1" />}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !processingAction && setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.type === "approve" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {actionDialog.type === "reject" && <XCircle className="w-5 h-5 text-red-600" />}
              {actionDialog.type === "activate" && <Shield className="w-5 h-5 text-blue-600" />}
              {actionDialog.type === "approve" && "Approve Vendors"}
              {actionDialog.type === "reject" && "Reject Vendors"}
              {actionDialog.type === "activate" && "Activate Vendors"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve" && (
                <>Are you sure you want to approve {actionDialog.vendorIds.length} vendor(s)?</>
              )}
              {actionDialog.type === "reject" && (
                <>
                  Are you sure you want to reject {actionDialog.vendorIds.length} vendor(s)?
                  <div className="mt-4">
                    <label className="text-sm font-medium text-foreground">Rejection Reason</label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </>
              )}
              {actionDialog.type === "activate" && (
                <>
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-500" />
                  Activating will give these vendors full access to the system. Are you sure you want to activate {actionDialog.vendorIds.length} vendor(s)?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ ...actionDialog, open: false })} disabled={processingAction}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkAction}
              disabled={processingAction || (actionDialog.type === "reject" && !rejectionReason.trim())}
              variant={actionDialog.type === "reject" ? "destructive" : "default"}
              className={actionDialog.type === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {processingAction ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <>
                  {actionDialog.type === "approve" && "Approve"}
                  {actionDialog.type === "reject" && "Reject"}
                  {actionDialog.type === "activate" && "Activate"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
