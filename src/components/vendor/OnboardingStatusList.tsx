import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock, CheckCircle, XCircle, FileSearch, MoreHorizontal, RefreshCw } from "lucide-react";
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

type InvitationStatus = "pending" | "documents_pending" | "approved" | "rejected";

interface Invitation {
  id: string;
  vendor_email: string;
  vendor_name: string | null;
  status: InvitationStatus;
  sent_at: string;
  expires_at: string;
  required_documents: string[];
}

const statusConfig: Record<InvitationStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  documents_pending: { label: "Docs Pending", color: "bg-blue-100 text-blue-700 border-blue-200", icon: FileSearch },
  approved: { label: "Approved", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export function OnboardingStatusList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("vendor_invitations")
        .select("*")
        .order("sent_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter as InvitationStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInvitations((data as Invitation[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch invitations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [filter]);

  const filteredInvitations = invitations.filter(inv =>
    inv.vendor_email.toLowerCase().includes(search.toLowerCase()) ||
    inv.vendor_name?.toLowerCase().includes(search.toLowerCase())
  );

  const resendInvitation = async (id: string) => {
    toast.success("Invitation resent successfully");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Onboarding Status</h2>
            <p className="text-sm text-slate-500">Track all vendor invitations</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="documents_pending">Docs Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchInvitations}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Vendor</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent Date</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No invitations found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvitations.map((inv) => {
                const status = statusConfig[inv.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <TableRow key={inv.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{inv.vendor_name || "—"}</TableCell>
                    <TableCell className="text-slate-600">{inv.vendor_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${status.color} border`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {format(new Date(inv.sent_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {format(new Date(inv.expires_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-xl z-50">
                          <DropdownMenuItem onClick={() => resendInvitation(inv.id)}>
                            Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel Invitation</DropdownMenuItem>
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
