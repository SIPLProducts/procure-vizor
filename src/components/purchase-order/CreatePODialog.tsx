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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface CreatePODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LineItem {
  id: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

const vendors = [
  { id: "VND-001", name: "ABC Metals Pvt Ltd", gst: "27AABCA9012C3Z7", address: "456, Metal Hub, Vashi" },
  { id: "VND-003", name: "Steel Corp India", gst: "27AABCS1234A1Z5", address: "Plot 45, Industrial Area, Pune" },
  { id: "VND-004", name: "Pack Solutions", gst: "27AABCP5678B2Z6", address: "123, Packaging Complex, Thane" },
  { id: "VND-005", name: "Chemical Industries", gst: "27AABCC3456D4Z8", address: "789, MIDC Industrial Estate" },
];

const materials = [
  { code: "MAT-001", name: "Steel Plates 3mm", unit: "kg", price: 238 },
  { code: "MAT-002", name: "Steel Rods 10mm", unit: "kg", price: 195 },
  { code: "MAT-023", name: "PVC Sheets 5mm", unit: "sqm", price: 320 },
  { code: "MAT-045", name: "Corrugated Cartons", unit: "pcs", price: 45 },
  { code: "MAT-067", name: "Copper Wire 2.5mm", unit: "meters", price: 125 },
  { code: "MAT-089", name: "Industrial Adhesive", unit: "liters", price: 320 },
];

const deliveryLocations = [
  "Warehouse A, Mumbai",
  "Warehouse B, Mumbai",
  "Factory Unit 1, Pune",
  "Factory Unit 2, Pune",
];

const paymentTerms = ["Advance", "Net 15", "Net 30", "Net 45", "Net 60"];

export function CreatePODialog({ open, onOpenChange }: CreatePODialogProps) {
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [selectedVendor, setSelectedVendor] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", materialCode: "", materialName: "", quantity: 0, unit: "", unitPrice: 0, discount: 0, taxRate: 18 },
  ]);

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString();
    setLineItems([
      ...lineItems,
      { id: newId, materialCode: "", materialName: "", quantity: 0, unit: "", unitPrice: 0, discount: 0, taxRate: 18 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          if (field === "materialCode") {
            const material = materials.find((m) => m.code === value);
            if (material) {
              return {
                ...item,
                materialCode: material.code,
                materialName: material.name,
                unit: material.unit,
                unitPrice: material.price,
              };
            }
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const calculateLineTotal = (item: LineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * (item.taxRate / 100);
    return afterDiscount + tax;
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalDiscount = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.discount / 100),
    0
  );
  const taxableAmount = subtotal - totalDiscount;
  const totalTax = lineItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemDiscount = itemSubtotal * (item.discount / 100);
    return sum + (itemSubtotal - itemDiscount) * (item.taxRate / 100);
  }, 0);
  const grandTotal = taxableAmount + totalTax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = () => {
    toast({
      title: "Purchase Order Created",
      description: "PO-2024-005 has been created successfully.",
    });
    onOpenChange(false);
    // Reset form
    setSelectedVendor("");
    setDeliveryLocation("");
    setPaymentTerm("");
    setDeliveryDate(undefined);
    setNotes("");
    setLineItems([
      { id: "1", materialCode: "", materialName: "", quantity: 0, unit: "", unitPrice: 0, discount: 0, taxRate: 18 },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vendor & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedVendor && (
                <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                  <p className="font-medium">
                    {vendors.find((v) => v.id === selectedVendor)?.name}
                  </p>
                  <p className="text-muted-foreground">
                    {vendors.find((v) => v.id === selectedVendor)?.address}
                  </p>
                  <p className="text-muted-foreground">
                    GST: {vendors.find((v) => v.id === selectedVendor)?.gst}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Location</Label>
                <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Delivery</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTerms.map((term) => (
                        <SelectItem key={term} value={term}>
                          {term}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Line Items</Label>
              <Button variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-48">Material</TableHead>
                    <TableHead className="w-24 text-right">Qty</TableHead>
                    <TableHead className="w-20">Unit</TableHead>
                    <TableHead className="w-28 text-right">Unit Price</TableHead>
                    <TableHead className="w-20 text-right">Disc %</TableHead>
                    <TableHead className="w-20 text-right">Tax %</TableHead>
                    <TableHead className="w-28 text-right">Total</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select
                          value={item.materialCode}
                          onValueChange={(value) => updateLineItem(item.id, "materialCode", value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {materials.map((mat) => (
                              <SelectItem key={mat.code} value={mat.code}>
                                {mat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.unit || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice || ""}
                          onChange={(e) =>
                            updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount || ""}
                          onChange={(e) =>
                            updateLineItem(item.id, "discount", parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) =>
                            updateLineItem(item.id, "taxRate", parseFloat(e.target.value) || 0)
                          }
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.quantity > 0 ? formatCurrency(calculateLineTotal(item)) : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 bg-secondary/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-success">-{formatCurrency(totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (GST)</span>
                <span className="font-medium">{formatCurrency(totalTax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Grand Total</span>
                <span className="font-bold text-primary">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes / Special Instructions</Label>
            <Textarea
              placeholder="Add any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="secondary">Save as Draft</Button>
          <Button onClick={handleSubmit}>Create PO</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
