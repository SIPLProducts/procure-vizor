import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Package, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreated?: (plan: any) => void;
}

const vendors = [
  "Steel Corp Ltd",
  "Wire Solutions",
  "Polymer Industries",
  "Metal Works Co",
  "Insulate Plus",
  "Global Materials",
];

const units = ["kg", "tons", "meters", "units", "rolls", "liters"];

export function CreatePlanDialog({ open, onOpenChange, onPlanCreated }: CreatePlanDialogProps) {
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    unit: "",
    vendor: "",
    priority: "",
    estimatedCost: "",
    notes: "",
  });
  const [plannedDate, setPlannedDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.quantity || !formData.unit || !plannedDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newPlan = {
      id: `PP-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
      item: formData.item,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      plannedDate: format(plannedDate, "yyyy-MM-dd"),
      status: "draft",
      priority: formData.priority || "medium",
      estimatedCost: parseInt(formData.estimatedCost) || 0,
      vendor: formData.vendor || "To be assigned",
      notes: formData.notes,
    };

    onPlanCreated?.(newPlan);
    toast.success("Purchase plan created successfully!");
    
    // Reset form
    setFormData({
      item: "",
      quantity: "",
      unit: "",
      vendor: "",
      priority: "",
      estimatedCost: "",
      notes: "",
    });
    setPlannedDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Create Purchase Plan
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="item" className="text-sm font-medium text-slate-700">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="item"
                placeholder="Enter item name"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">
                Unit <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">
                Planned Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1.5 justify-start text-left font-normal",
                      !plannedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {plannedDate ? format(plannedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={plannedDate}
                    onSelect={setPlannedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Vendor</Label>
              <Select value={formData.vendor} onValueChange={(value) => setFormData({ ...formData, vendor: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedCost" className="text-sm font-medium text-slate-700">
                Estimated Cost (₹)
              </Label>
              <Input
                id="estimatedCost"
                type="number"
                placeholder="Enter estimated cost"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes" className="text-sm font-medium text-slate-700">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1.5"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
