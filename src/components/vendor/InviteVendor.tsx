import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, FileText, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  vendorName: z.string().min(2, "Vendor name is required"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const documentTypes = [
  { id: "pan", label: "PAN Card" },
  { id: "gst", label: "GST Certificate" },
  { id: "cancelled_cheque", label: "Cancelled Cheque" },
  { id: "incorporation_cert", label: "Certificate of Incorporation" },
  { id: "msme_cert", label: "MSME Certificate" },
  { id: "iso_cert", label: "ISO Certification" },
];

export function InviteVendor() {
  const { user } = useAuth();
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["pan", "gst", "cancelled_cheque"]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const toggleDocument = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(d => d !== docId)
        : [...prev, docId]
    );
  };

  const onSubmit = async (data: InviteFormData) => {
    if (selectedDocs.length === 0) {
      toast.error("Please select at least one required document");
      return;
    }

    setIsLoading(true);
    try {
      const token = crypto.randomUUID();
      
      const { error } = await supabase.from("vendor_invitations").insert({
        vendor_email: data.email,
        vendor_name: data.vendorName,
        required_documents: selectedDocs,
        invitation_token: token,
        created_by: user?.id,
      });

      if (error) throw error;

      toast.success("Invitation sent successfully!", {
        description: `Invitation sent to ${data.email}`,
      });
      reset();
      setSelectedDocs(["pan", "gst", "cancelled_cheque"]);
    } catch (error: any) {
      toast.error("Failed to send invitation", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Invite New Vendor</h2>
          <p className="text-sm text-slate-500">Send onboarding invitation to vendor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendorName">Vendor/Company Name</Label>
            <Input
              id="vendorName"
              placeholder="Enter vendor name"
              {...register("vendorName")}
              className="h-11"
            />
            {errors.vendorName && (
              <p className="text-sm text-red-500">{errors.vendorName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Vendor Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vendor@company.com"
              {...register("email")}
              className="h-11"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Required Documents
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {documentTypes.map((doc) => {
              const isSelected = selectedDocs.includes(doc.id);
              return (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => toggleDocument(doc.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <CheckSquare className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{doc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
        >
          <Send className="w-4 h-4 mr-2" />
          {isLoading ? "Sending..." : "Send Invitation"}
        </Button>
      </form>
    </div>
  );
}
