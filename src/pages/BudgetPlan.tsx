import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  IndianRupee,
  TrendingUp,
  Calendar,
  Package,
  FileSpreadsheet,
  Download,
  Filter,
  ChevronRight,
} from "lucide-react";

// Mock data for material types and materials
const materialTypes = [
  { id: "raw", name: "Raw Materials" },
  { id: "packaging", name: "Packaging Materials" },
  { id: "consumables", name: "Consumables" },
  { id: "spares", name: "Spare Parts" },
  { id: "chemicals", name: "Chemicals" },
];

const materials = [
  { id: "1", name: "Steel Sheets", type: "raw", unit: "Ton" },
  { id: "2", name: "Aluminum Rods", type: "raw", unit: "Kg" },
  { id: "3", name: "Copper Wire", type: "raw", unit: "Meter" },
  { id: "4", name: "Cardboard Boxes", type: "packaging", unit: "Pcs" },
  { id: "5", name: "Plastic Wrap", type: "packaging", unit: "Roll" },
  { id: "6", name: "Lubricants", type: "consumables", unit: "Liter" },
  { id: "7", name: "Safety Gloves", type: "consumables", unit: "Pair" },
  { id: "8", name: "Motor Bearings", type: "spares", unit: "Pcs" },
  { id: "9", name: "Conveyor Belts", type: "spares", unit: "Meter" },
  { id: "10", name: "Cleaning Agents", type: "chemicals", unit: "Liter" },
];

// Mock budget data
const mockBudgetData = [
  {
    id: "1",
    materialType: "Raw Materials",
    material: "Steel Sheets",
    unit: "Ton",
    year: "2024-25",
    q1Budget: 5000000,
    q2Budget: 5500000,
    q3Budget: 6000000,
    q4Budget: 6500000,
    totalBudget: 23000000,
    status: "approved",
  },
  {
    id: "2",
    materialType: "Raw Materials",
    material: "Aluminum Rods",
    unit: "Kg",
    year: "2024-25",
    q1Budget: 1200000,
    q2Budget: 1300000,
    q3Budget: 1400000,
    q4Budget: 1500000,
    totalBudget: 5400000,
    status: "approved",
  },
  {
    id: "3",
    materialType: "Packaging Materials",
    material: "Cardboard Boxes",
    unit: "Pcs",
    year: "2024-25",
    q1Budget: 800000,
    q2Budget: 850000,
    q3Budget: 900000,
    q4Budget: 950000,
    totalBudget: 3500000,
    status: "pending",
  },
  {
    id: "4",
    materialType: "Consumables",
    material: "Lubricants",
    unit: "Liter",
    year: "2024-25",
    q1Budget: 300000,
    q2Budget: 320000,
    q3Budget: 340000,
    q4Budget: 360000,
    totalBudget: 1320000,
    status: "draft",
  },
  {
    id: "5",
    materialType: "Spare Parts",
    material: "Motor Bearings",
    unit: "Pcs",
    year: "2024-25",
    q1Budget: 450000,
    q2Budget: 480000,
    q3Budget: 510000,
    q4Budget: 540000,
    totalBudget: 1980000,
    status: "approved",
  },
];

const months = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March"
];

const quarters = ["Q1 (Apr-Jun)", "Q2 (Jul-Sep)", "Q3 (Oct-Dec)", "Q4 (Jan-Mar)"];
const halfYearly = ["H1 (Apr-Sep)", "H2 (Oct-Mar)"];

export default function BudgetPlan() {
  const [activeTab, setActiveTab] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [selectedMaterialType, setSelectedMaterialType] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [budgetData, setBudgetData] = useState(mockBudgetData);

  // Form state for creating budget
  const [formData, setFormData] = useState({
    materialType: "",
    material: "",
    planType: "yearly",
    year: "2024-25",
    monthlyBudgets: Array(12).fill(""),
    quarterlyBudgets: Array(4).fill(""),
    halfYearlyBudgets: Array(2).fill(""),
    yearlyBudget: "",
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "draft":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.totalBudget, 0);
  const approvedBudget = budgetData
    .filter((item) => item.status === "approved")
    .reduce((sum, item) => sum + item.totalBudget, 0);
  const pendingBudget = budgetData
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.totalBudget, 0);

  const filteredData = selectedMaterialType === "all"
    ? budgetData
    : budgetData.filter(
        (item) =>
          item.materialType.toLowerCase().replace(" ", "") ===
          selectedMaterialType.toLowerCase()
      );

  const handleCreateBudget = () => {
    const selectedMat = materials.find((m) => m.id === formData.material);
    const selectedType = materialTypes.find((t) => t.id === formData.materialType);

    if (!selectedMat || !selectedType) {
      toast.error("Please select material type and material");
      return;
    }

    let totalBudget = 0;
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;

    if (formData.planType === "yearly") {
      totalBudget = parseFloat(formData.yearlyBudget) || 0;
      q1 = q2 = q3 = q4 = totalBudget / 4;
    } else if (formData.planType === "half-yearly") {
      const h1 = parseFloat(formData.halfYearlyBudgets[0]) || 0;
      const h2 = parseFloat(formData.halfYearlyBudgets[1]) || 0;
      totalBudget = h1 + h2;
      q1 = q2 = h1 / 2;
      q3 = q4 = h2 / 2;
    } else if (formData.planType === "quarterly") {
      q1 = parseFloat(formData.quarterlyBudgets[0]) || 0;
      q2 = parseFloat(formData.quarterlyBudgets[1]) || 0;
      q3 = parseFloat(formData.quarterlyBudgets[2]) || 0;
      q4 = parseFloat(formData.quarterlyBudgets[3]) || 0;
      totalBudget = q1 + q2 + q3 + q4;
    } else if (formData.planType === "monthly") {
      const monthlyValues = formData.monthlyBudgets.map((v) => parseFloat(v) || 0);
      totalBudget = monthlyValues.reduce((sum, v) => sum + v, 0);
      q1 = monthlyValues.slice(0, 3).reduce((sum, v) => sum + v, 0);
      q2 = monthlyValues.slice(3, 6).reduce((sum, v) => sum + v, 0);
      q3 = monthlyValues.slice(6, 9).reduce((sum, v) => sum + v, 0);
      q4 = monthlyValues.slice(9, 12).reduce((sum, v) => sum + v, 0);
    }

    const newBudget = {
      id: (budgetData.length + 1).toString(),
      materialType: selectedType.name,
      material: selectedMat.name,
      unit: selectedMat.unit,
      year: formData.year,
      q1Budget: q1,
      q2Budget: q2,
      q3Budget: q3,
      q4Budget: q4,
      totalBudget: totalBudget,
      status: "draft",
    };

    setBudgetData([...budgetData, newBudget]);
    setCreateDialogOpen(false);
    setFormData({
      materialType: "",
      material: "",
      planType: "yearly",
      year: "2024-25",
      monthlyBudgets: Array(12).fill(""),
      quarterlyBudgets: Array(4).fill(""),
      halfYearlyBudgets: Array(2).fill(""),
      yearlyBudget: "",
    });
    toast.success("Budget plan created successfully!");
  };

  const stats = [
    {
      title: "Total Budget",
      value: formatCurrency(totalBudget),
      icon: IndianRupee,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Approved Budget",
      value: formatCurrency(approvedBudget),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Pending Approval",
      value: formatCurrency(pendingBudget),
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Material Types",
      value: materialTypes.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
  ];

  return (
    <MainLayout title="Budget Plan" subtitle="Material Type & Material wise Budget Planning">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Budget Plan</h1>
            <p className="text-muted-foreground">
              Material Type & Material wise Budget Planning
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Budget Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Budget Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Material Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Material Type</Label>
                      <Select
                        value={formData.materialType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, materialType: value, material: "" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Select
                        value={formData.material}
                        onValueChange={(value) =>
                          setFormData({ ...formData, material: value })
                        }
                        disabled={!formData.materialType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials
                            .filter((m) => m.type === formData.materialType)
                            .map((material) => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.name} ({material.unit})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Year and Plan Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Financial Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) =>
                          setFormData({ ...formData, year: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                          <SelectItem value="2025-26">2025-26</SelectItem>
                          <SelectItem value="2026-27">2026-27</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Plan Type</Label>
                      <Select
                        value={formData.planType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, planType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="half-yearly">Half Yearly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Budget Input based on Plan Type */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Budget Amount (₹)</Label>

                    {formData.planType === "yearly" && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Annual Budget
                        </Label>
                        <Input
                          type="number"
                          placeholder="Enter yearly budget"
                          value={formData.yearlyBudget}
                          onChange={(e) =>
                            setFormData({ ...formData, yearlyBudget: e.target.value })
                          }
                        />
                      </div>
                    )}

                    {formData.planType === "half-yearly" && (
                      <div className="grid grid-cols-2 gap-4">
                        {halfYearly.map((period, index) => (
                          <div key={period} className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              {period}
                            </Label>
                            <Input
                              type="number"
                              placeholder="Enter budget"
                              value={formData.halfYearlyBudgets[index]}
                              onChange={(e) => {
                                const newBudgets = [...formData.halfYearlyBudgets];
                                newBudgets[index] = e.target.value;
                                setFormData({ ...formData, halfYearlyBudgets: newBudgets });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.planType === "quarterly" && (
                      <div className="grid grid-cols-2 gap-4">
                        {quarters.map((quarter, index) => (
                          <div key={quarter} className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              {quarter}
                            </Label>
                            <Input
                              type="number"
                              placeholder="Enter budget"
                              value={formData.quarterlyBudgets[index]}
                              onChange={(e) => {
                                const newBudgets = [...formData.quarterlyBudgets];
                                newBudgets[index] = e.target.value;
                                setFormData({ ...formData, quarterlyBudgets: newBudgets });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.planType === "monthly" && (
                      <div className="grid grid-cols-3 gap-3">
                        {months.map((month, index) => (
                          <div key={month} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              {month}
                            </Label>
                            <Input
                              type="number"
                              placeholder="₹"
                              className="h-9"
                              value={formData.monthlyBudgets[index]}
                              onChange={(e) => {
                                const newBudgets = [...formData.monthlyBudgets];
                                newBudgets[index] = e.target.value;
                                setFormData({ ...formData, monthlyBudgets: newBudgets });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBudget}>Create Budget Plan</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedMaterialType}
                onValueChange={setSelectedMaterialType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Material Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {materialTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budget Table with Tabs */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Budget Plan Overview - FY {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="half-yearly">Half Yearly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>

              <TabsContent value="yearly">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Material Type</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Annual Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {item.materialType}
                          </TableCell>
                          <TableCell>{item.material}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.totalBudget)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="half-yearly">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Material Type</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">H1 (Apr-Sep)</TableHead>
                        <TableHead className="text-right">H2 (Oct-Mar)</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {item.materialType}
                          </TableCell>
                          <TableCell>{item.material}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.q1Budget + item.q2Budget)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.q3Budget + item.q4Budget)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.totalBudget)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="quarterly">
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Material Type</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Q1</TableHead>
                        <TableHead className="text-right">Q2</TableHead>
                        <TableHead className="text-right">Q3</TableHead>
                        <TableHead className="text-right">Q4</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {item.materialType}
                          </TableCell>
                          <TableCell>{item.material}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.q1Budget)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.q2Budget)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.q3Budget)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.q4Budget)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.totalBudget)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="monthly">
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="sticky left-0 bg-muted/50">Material</TableHead>
                        {months.map((month) => (
                          <TableHead key={month} className="text-right text-xs">
                            {month.substring(0, 3)}
                          </TableHead>
                        ))}
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => {
                        const monthlyBudget = item.totalBudget / 12;
                        return (
                          <TableRow key={item.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium sticky left-0 bg-card">
                              {item.material}
                            </TableCell>
                            {months.map((month, idx) => (
                              <TableCell key={month} className="text-right text-sm">
                                {formatCurrency(monthlyBudget)}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(item.totalBudget)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
