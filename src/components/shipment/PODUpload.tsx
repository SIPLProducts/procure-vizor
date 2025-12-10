import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, Camera, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PODUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId: string;
}

export function PODUpload({ open, onOpenChange, shipmentId }: PODUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [receiverName, setReceiverName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one POD document or photo.",
        variant: "destructive",
      });
      return;
    }

    if (!receiverName.trim()) {
      toast({
        title: "Receiver name required",
        description: "Please enter the name of the person who received the delivery.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsUploading(false);
    toast({
      title: "POD Uploaded Successfully",
      description: `Proof of delivery for ${shipmentId} has been recorded.`,
    });

    // Reset and close
    setFiles([]);
    setReceiverName("");
    setRemarks("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Proof of Delivery</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div className="space-y-3">
            <Label>POD Documents / Photos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="pod-upload"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="pod-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-info/10">
                      <Camera className="w-6 h-6 text-info" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Signed delivery receipt, photos of goods received
                  </p>
                </div>
              </label>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Receiver Name */}
          <div className="space-y-2">
            <Label htmlFor="receiver">Received By *</Label>
            <Input
              id="receiver"
              placeholder="Name of the person who received the delivery"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Any additional notes about the delivery..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
            />
          </div>

          {/* Info */}
          <div className="bg-info/10 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What counts as valid POD?</p>
              <ul className="mt-1 space-y-0.5">
                <li>• Signed delivery receipt or challan</li>
                <li>• Photo of goods at destination</li>
                <li>• Screenshot of receiver acknowledgement</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload POD
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
