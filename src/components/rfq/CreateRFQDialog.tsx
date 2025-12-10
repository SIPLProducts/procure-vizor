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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface CreateRFQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableVendors = [
  { id: "1", name: "ABC Metals Pvt Ltd", code: "VND-001", category: "Metals" },
  { id: "2", name: "XYZ Polymers Ltd", code: "VND-002", category: "Polymers" },
  { id: "3", name: "Steel Corp India", code: "VND-003", category: "Metals" },
  { id: "4", name: "Pack Solutions", code: "VND-004", category: "Packaging" },
  { id: "5", name: "Chemical Industries", code: "VND-005", category: "Chemicals" },
  { id: "6", name: "Metal Works Co", code: "VND-008", category: "Metals" },
  { id: "7", name: "Prime Suppliers", code: "VND-012", category: "General" },
];

const materials = [
  { code: "MAT-001", name: "Steel Plates 3mm" },
  { code: "MAT-023", name: "PVC Sheets 5mm" },
  { code: "MAT-045", name: "Corrugated Cartons" },
  { code: "MAT-067", name: "Copper Wire 2.5mm" },
  { code: "MAT-089", name: "Industrial Adhesive" },
];

export function CreateRFQDialog({ open, onOpenChange }: CreateRFQDialogProps) {
  const [step, setStep] = useState(1);
  const [dueDate, setDueDate] = useState<Date>();
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    material: "",
    quantity: "",
    unit: "kg",
    specifications: "",
  });

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const handleSubmit = () => {
    toast({
      title: "RFQ Created Successfully",
      description: `RFQ has been created and sent to ${selectedVendors.length} vendors.`,
    });
    onOpenChange(false);
    setStep(1);
    setSelectedVendors([]);
    setFormData({ title: "", material: "", quantity: "", unit: "kg", specifications: "" });
    setDueDate(undefined);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New RFQ</DialogTitle>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {s}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    step >= s ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s === 1 ? "Details" : s === 2 ? "Vendors" : "Review"}
                </span>
                {s < 3 && <div className="w-8 h-px bg-border mx-2" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Step 1: RFQ Details */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">RFQ Title</Label>
              <Input
                id="title"
                placeholder="e.g., Steel Plates - Q1 Requirement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Material</Label>
                <Select
                  value={formData.material}
                  onValueChange={(value) => setFormData({ ...formData, material: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((mat) => (
                      <SelectItem key={mat.code} value={mat.code}>
                        {mat.name} ({mat.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications / Notes</Label>
              <Textarea
                id="specifications"
                placeholder="Enter detailed specifications..."
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Specifications, drawings, quality requirements
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Vendor Selection */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label>Select Vendors to Invite</Label>
              <span className="text-sm text-muted-foreground">
                {selectedVendors.length} selected
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedVendors.includes(vendor.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleVendorToggle(vendor.id)}
                >
                  <Checkbox checked={selectedVendors.includes(vendor.id)} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.code} • {vendor.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">RFQ Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Title</p>
                  <p className="font-medium">{formData.title || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Material</p>
                  <p className="font-medium">
                    {materials.find((m) => m.code === formData.material)?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">
                    {formData.quantity} {formData.unit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{dueDate ? format(dueDate, "PPP") : "-"}</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">
                Invited Vendors ({selectedVendors.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedVendors.map((id) => {
                  const vendor = availableVendors.find((v) => v.id === id);
                  return vendor ? (
                    <div
                      key={id}
                      className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 text-sm"
                    >
                      <span>{vendor.name}</span>
                      <button
                        onClick={() => handleVendorToggle(id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit}>Create & Send RFQ</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
