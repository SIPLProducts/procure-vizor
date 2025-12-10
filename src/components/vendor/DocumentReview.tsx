import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FileText, Eye, CheckCircle, XCircle, MessageSquare, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type DocumentStatus = "pending" | "approved" | "rejected" | "expired";

interface VendorDocument {
  id: string;
  vendor_id: string;
  document_type: string;
  document_name: string;
  file_url: string | null;
  status: DocumentStatus;
  uploaded_at: string;
  rejection_reason: string | null;
  vendor?: {
    company_name: string;
    email: string;
  };
}

const documentTypeLabels: Record<string, string> = {
  pan: "PAN Card",
  gst: "GST Certificate",
  cancelled_cheque: "Cancelled Cheque",
  incorporation_cert: "Certificate of Incorporation",
  msme_cert: "MSME Certificate",
  iso_cert: "ISO Certification",
};

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200" },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

export function DocumentReview() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [selectedDoc, setSelectedDoc] = useState<VendorDocument | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("vendor_documents")
        .select(`
          *,
          vendor:vendors(company_name, email)
        `)
        .order("uploaded_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter as DocumentStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDocuments((data as VendorDocument[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const approveDocument = async (doc: VendorDocument) => {
    try {
      const { error } = await supabase
        .from("vendor_documents")
        .update({
          status: "approved",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", doc.id);

      if (error) throw error;
      toast.success("Document approved");
      fetchDocuments();
    } catch (error: any) {
      toast.error("Failed to approve document");
    }
  };

  const rejectDocument = async () => {
    if (!selectedDoc || !rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const { error } = await supabase
        .from("vendor_documents")
        .update({
          status: "rejected",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectReason,
        })
        .eq("id", selectedDoc.id);

      if (error) throw error;
      toast.success("Document rejected");
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedDoc(null);
      fetchDocuments();
    } catch (error: any) {
      toast.error("Failed to reject document");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Document Review</h2>
            <p className="text-sm text-slate-500">Review and approve vendor documents</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6">
        {documents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No documents to review</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => {
              const status = statusConfig[doc.status] || statusConfig.pending;
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {documentTypeLabels[doc.document_type] || doc.document_type}
                      </p>
                      <p className="text-sm text-slate-500">
                        {doc.vendor?.company_name} • {format(new Date(doc.uploaded_at), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${status.color} border`}>
                      {status.label}
                    </Badge>

                    {doc.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file_url || "#", "_blank")}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => approveDocument(doc)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setShowRejectDialog(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {doc.status !== "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.file_url || "#", "_blank")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectDocument}>
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
