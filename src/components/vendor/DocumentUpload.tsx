import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentUploadProps {
  vendorId: string;
  onUploadComplete?: () => void;
}

const documentTypes = [
  { value: "pan", label: "PAN Card" },
  { value: "gst", label: "GST Certificate" },
  { value: "cancelled_cheque", label: "Cancelled Cheque" },
  { value: "incorporation_cert", label: "Certificate of Incorporation" },
  { value: "msme_cert", label: "MSME Certificate" },
  { value: "iso_cert", label: "ISO Certification" },
  { value: "other", label: "Other Document" },
];

export function DocumentUpload({ vendorId, onUploadComplete }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or image file (JPG, PNG)");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Please select a document type and file");
      return;
    }

    setIsUploading(true);
    try {
      // Generate unique file name
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${vendorId}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vendor-documents")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("vendor-documents")
        .getPublicUrl(fileName);

      // Save document record to database
      const { error: dbError } = await supabase.from("vendor_documents").insert({
        vendor_id: vendorId,
        document_type: documentType,
        document_name: selectedFile.name,
        file_url: urlData.publicUrl,
        status: "pending",
      });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      setDocumentType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadComplete?.();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Document</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Document Type</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Upload File</Label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              selectedFile ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-slate-800">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelection}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-medium">Click to upload</p>
                <p className="text-sm text-slate-400 mt-1">
                  PDF, JPG, or PNG (max 10MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={!selectedFile || !documentType || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
