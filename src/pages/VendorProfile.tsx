import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  FileText,
  CreditCard,
  Shield,
  FileCheck,
  History,
  TrendingUp,
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { DocumentUpload } from "@/components/vendor/DocumentUpload";

type DocumentStatus = "pending" | "approved" | "rejected" | "expired";

interface VendorDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_url: string | null;
  status: DocumentStatus;
  uploaded_at: string;
}

const documentStatusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-700" },
};

const documentTypeLabels: Record<string, string> = {
  pan: "PAN Card",
  gst: "GST Certificate",
  cancelled_cheque: "Cancelled Cheque",
  incorporation_cert: "Certificate of Incorporation",
  msme_cert: "MSME Certificate",
  iso_cert: "ISO Certification",
  other: "Other Document",
};

type VendorStatus = "pending" | "documents_pending" | "approved" | "rejected" | "active" | "inactive" | "blocked";
type RiskLevel = "low" | "medium" | "high";

interface VendorData {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  pan_number: string | null;
  category: string | null;
  status: VendorStatus;
  risk_level: RiskLevel;
  performance_score: number;
  quality_score: number;
  delivery_score: number;
  sla_score: number;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<VendorStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  documents_pending: { label: "Docs Pending", color: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  inactive: { label: "Inactive", color: "bg-slate-100 text-slate-700" },
  blocked: { label: "Blocked", color: "bg-red-100 text-red-700" },
};

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendor = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setVendor(data as VendorData);
    } catch (error: any) {
      toast.error("Failed to fetch vendor");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("vendor_documents")
        .select("*")
        .eq("vendor_id", id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments((data as VendorDocument[]) || []);
    } catch (error: any) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    fetchVendor();
    fetchDocuments();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout title="Vendor Profile" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!vendor) {
    return (
      <MainLayout title="Vendor Profile" subtitle="Vendor not found">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Vendor not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/vendors")}>
            Back to Vendors
          </Button>
        </div>
      </MainLayout>
    );
  }

  const status = statusConfig[vendor.status] || statusConfig.pending;

  return (
    <MainLayout title="Vendor Profile" subtitle={vendor.company_name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/vendors")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vendors
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
              {vendor.company_name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{vendor.company_name}</h1>
                  <p className="text-slate-500">{vendor.contact_person}</p>
                </div>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {vendor.email}
                </div>
                {vendor.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {vendor.phone}
                  </div>
                )}
                {vendor.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {vendor.city}, {vendor.state}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Since {format(new Date(vendor.created_at), "MMM yyyy")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
            <TabsTrigger value="bank" className="rounded-lg">Bank Details</TabsTrigger>
            <TabsTrigger value="compliance" className="rounded-lg">Compliance</TabsTrigger>
            <TabsTrigger value="rfqs" className="rounded-lg">RFQs</TabsTrigger>
            <TabsTrigger value="quotations" className="rounded-lg">Quotations</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-lg">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Info */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">GST Number</p>
                    <p className="font-medium text-slate-800">{vendor.gst_number || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">PAN Number</p>
                    <p className="font-medium text-slate-800">{vendor.pan_number || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Category</p>
                    <p className="font-medium text-slate-800">{vendor.category || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Risk Level</p>
                    <Badge variant="outline" className="capitalize">{vendor.risk_level}</Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Address</p>
                    <p className="font-medium text-slate-800">
                      {vendor.address ? `${vendor.address}, ${vendor.city}, ${vendor.state} - ${vendor.pincode}` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Score</h3>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100">
                    <span className="text-3xl font-bold text-indigo-600">{vendor.performance_score.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Quality</span>
                      <span className="font-medium">{vendor.quality_score.toFixed(1)}</span>
                    </div>
                    <Progress value={vendor.quality_score * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Delivery</span>
                      <span className="font-medium">{vendor.delivery_score.toFixed(1)}</span>
                    </div>
                    <Progress value={vendor.delivery_score * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">SLA Compliance</span>
                      <span className="font-medium">{vendor.sla_score.toFixed(1)}</span>
                    </div>
                    <Progress value={vendor.sla_score * 10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Uploaded Documents</h3>
                {documents.length === 0 ? (
                  <p className="text-slate-500">No documents uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => {
                      const docStatus = documentStatusConfig[doc.status] || documentStatusConfig.pending;
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100">
                              <FileText className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {documentTypeLabels[doc.document_type] || doc.document_type}
                              </p>
                              <p className="text-sm text-slate-500">
                                {doc.document_name} • {format(new Date(doc.uploaded_at), "dd MMM yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={docStatus.color}>{docStatus.label}</Badge>
                            {doc.file_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(doc.file_url!, "_blank")}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <DocumentUpload vendorId={id!} onUploadComplete={fetchDocuments} />
            </div>
          </TabsContent>

          <TabsContent value="bank">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Bank Details</h3>
              <p className="text-slate-500">No bank details added yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Compliance & Certifications</h3>
              <p className="text-slate-500">No certifications added yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="rfqs">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">RFQ Participation</h3>
              <p className="text-slate-500">No RFQ participation yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="quotations">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quotation History</h3>
              <p className="text-slate-500">No quotations submitted yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Analytics</h3>
              <p className="text-slate-500">Performance analytics coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
