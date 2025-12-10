import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Ban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type VendorStatus = "pending" | "documents_pending" | "approved" | "rejected" | "active" | "inactive" | "blocked";
type RiskLevel = "low" | "medium" | "high";

interface Vendor {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  category: string | null;
  status: VendorStatus;
  risk_level: RiskLevel;
  performance_score: number;
  city: string | null;
  state: string | null;
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

const riskConfig: Record<RiskLevel, { label: string; color: string; icon: React.ElementType }> = {
  low: { label: "Low", color: "text-green-600", icon: CheckCircle },
  medium: { label: "Medium", color: "text-yellow-600", icon: AlertTriangle },
  high: { label: "High", color: "text-red-600", icon: XCircle },
};

export function VendorList() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as VendorStatus);
      }
      if (riskFilter !== "all") {
        query = query.eq("risk_level", riskFilter as RiskLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVendors((data as Vendor[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [statusFilter, riskFilter]);

  const filteredVendors = vendors.filter(v =>
    v.company_name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase()) ||
    v.contact_person.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(vendors.map(v => v.category).filter(Boolean))];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">All Vendors</h2>
            <p className="text-sm text-slate-500">{vendors.length} vendors registered</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => navigate("/vendors/onboarding")}
              className="bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Vendor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No vendors found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => {
                const status = statusConfig[vendor.status] || statusConfig.pending;
                const risk = riskConfig[vendor.risk_level] || riskConfig.medium;
                const RiskIcon = risk.icon;
                return (
                  <TableRow key={vendor.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{vendor.company_name}</p>
                          <p className="text-xs text-slate-500">{vendor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{vendor.contact_person}</TableCell>
                    <TableCell>
                      {vendor.category ? (
                        <Badge variant="outline" className="bg-slate-50">
                          {vendor.category}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${risk.color}`}>
                        <RiskIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{risk.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{vendor.performance_score.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-xl z-50">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/vendors/${vendor.id}`); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Vendor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                            <Ban className="w-4 h-4 mr-2" />
                            Block Vendor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
