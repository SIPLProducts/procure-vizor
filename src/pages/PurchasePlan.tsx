import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  Target,
} from "lucide-react";

// Mock data for purchase plans
const mockPlans = [
  {
    id: "PP-2024-001",
    item: "Steel Bars - Grade A",
    quantity: 500,
    unit: "tons",
    plannedDate: "2024-02-15",
    status: "approved",
    priority: "high",
    estimatedCost: 1250000,
    vendor: "Steel Corp Ltd",
  },
  {
    id: "PP-2024-002",
    item: "Copper Wire - 2.5mm",
    quantity: 1000,
    unit: "meters",
    plannedDate: "2024-02-20",
    status: "pending",
    priority: "medium",
    estimatedCost: 450000,
    vendor: "Wire Solutions",
  },
  {
    id: "PP-2024-003",
    item: "PVC Compound",
    quantity: 200,
    unit: "kg",
    plannedDate: "2024-02-25",
    status: "draft",
    priority: "low",
    estimatedCost: 180000,
    vendor: "Polymer Industries",
  },
  {
    id: "PP-2024-004",
    item: "Aluminum Sheets",
    quantity: 300,
    unit: "units",
    plannedDate: "2024-03-01",
    status: "approved",
    priority: "high",
    estimatedCost: 890000,
    vendor: "Metal Works Co",
  },
  {
    id: "PP-2024-005",
    item: "Insulation Material",
    quantity: 750,
    unit: "rolls",
    plannedDate: "2024-03-05",
    status: "pending",
    priority: "medium",
    estimatedCost: 320000,
    vendor: "Insulate Plus",
  },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return styles[status] || styles.draft;
};

const getPriorityBadge = (priority: string) => {
  const styles: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    low: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return styles[priority] || styles.low;
};

export default function PurchasePlan() {
  const [activeTab, setActiveTab] = useState("all");

  const stats = [
    {
      title: "Total Plans",
      value: "24",
      icon: FileText,
      gradient: "from-blue-500 to-sky-400",
    },
    {
      title: "Approved",
      value: "12",
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      title: "Pending Review",
      value: "8",
      icon: Clock,
      gradient: "from-amber-500 to-yellow-400",
    },
    {
      title: "This Month Budget",
      value: "₹32.5L",
      icon: Target,
      gradient: "from-blue-600 to-blue-400",
    },
  ];

  const filteredPlans = activeTab === "all" 
    ? mockPlans 
    : mockPlans.filter(plan => plan.status === activeTab);

  return (
    <MainLayout title="Purchase Plan" subtitle="Plan and manage upcoming material purchases">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600/80">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Purchase Plans
            </CardTitle>
            <Button className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-100/80 p-1 mb-6">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-500 data-[state=active]:text-white"
              >
                All Plans
              </TabsTrigger>
              <TabsTrigger 
                value="approved"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-500 data-[state=active]:text-white"
              >
                Approved
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-500 data-[state=active]:text-white"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="draft"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-500 data-[state=active]:text-white"
              >
                Draft
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead className="font-semibold text-slate-700">Plan ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Item</TableHead>
                      <TableHead className="font-semibold text-slate-700">Quantity</TableHead>
                      <TableHead className="font-semibold text-slate-700">Planned Date</TableHead>
                      <TableHead className="font-semibold text-slate-700">Vendor</TableHead>
                      <TableHead className="font-semibold text-slate-700">Est. Cost</TableHead>
                      <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                        <TableCell className="font-medium text-blue-600">{plan.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            {plan.item}
                          </div>
                        </TableCell>
                        <TableCell>{plan.quantity} {plan.unit}</TableCell>
                        <TableCell>{new Date(plan.plannedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                        <TableCell>{plan.vendor}</TableCell>
                        <TableCell className="font-medium">₹{(plan.estimatedCost / 100000).toFixed(2)}L</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityBadge(plan.priority)}>
                            {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(plan.status)}>
                            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
