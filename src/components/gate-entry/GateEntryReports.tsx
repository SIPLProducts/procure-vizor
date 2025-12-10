import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileSpreadsheet, 
  FileText, 
  CalendarIcon, 
  Truck, 
  Package, 
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { useGateEntry } from "@/contexts/GateEntryContext";
import { format, startOfDay, endOfDay, isWithinInterval, subDays } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export const GateEntryReports = () => {
  const { vehicles, materials, visitors } = useGateEntry();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState<"daily" | "weekly">("daily");

  const getDateRange = () => {
    if (reportType === "daily") {
      return {
        start: startOfDay(selectedDate),
        end: endOfDay(selectedDate),
      };
    }
    return {
      start: startOfDay(subDays(selectedDate, 6)),
      end: endOfDay(selectedDate),
    };
  };

  const dateRange = getDateRange();

  const filteredVehicles = vehicles.filter((v) =>
    isWithinInterval(v.entryTime, dateRange)
  );

  const filteredMaterials = materials.filter((m) =>
    isWithinInterval(m.timestamp, dateRange)
  );

  const filteredVisitors = visitors.filter((v) =>
    isWithinInterval(v.entryTime, dateRange)
  );

  // Statistics
  const stats = {
    totalVehicles: filteredVehicles.length,
    vehiclesIn: filteredVehicles.filter((v) => v.status === "in").length,
    vehiclesOut: filteredVehicles.filter((v) => v.status === "out").length,
    totalMaterials: filteredMaterials.length,
    materialInward: filteredMaterials.filter((m) => m.type === "inward").length,
    materialOutward: filteredMaterials.filter((m) => m.type === "outward").length,
    pendingVerification: filteredMaterials.filter((m) => m.status === "pending").length,
    totalVisitors: filteredVisitors.length,
    visitorsCheckedIn: filteredVisitors.filter((v) => v.status === "checked_in").length,
    visitorsCheckedOut: filteredVisitors.filter((v) => v.status === "checked_out").length,
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Vehicles Sheet
    const vehicleData = filteredVehicles.map((v) => ({
      "Vehicle No": v.vehicleNumber,
      "Vehicle Type": v.vehicleType,
      "Driver Name": v.driverName,
      "Driver Phone": v.driverPhone,
      "Purpose": v.purpose,
      "Vendor": v.vendor || "-",
      "Entry Time": format(v.entryTime, "dd/MM/yyyy HH:mm"),
      "Exit Time": v.exitTime ? format(v.exitTime, "dd/MM/yyyy HH:mm") : "-",
      "Status": v.status === "in" ? "Inside" : "Exited",
      "Gate": v.gateNumber,
    }));
    const vehicleSheet = XLSX.utils.json_to_sheet(vehicleData);
    XLSX.utils.book_append_sheet(workbook, vehicleSheet, "Vehicles");

    // Materials Sheet
    const materialData = filteredMaterials.map((m) => ({
      "ID": m.id,
      "Type": m.type,
      "Material": m.materialDescription,
      "Quantity": m.quantity,
      "Unit": m.unit,
      "Vehicle No": m.vehicleNumber,
      "PO Number": m.poNumber || "-",
      "Invoice": m.invoiceNumber || "-",
      "Vendor": m.vendor || "-",
      "Department": m.department,
      "Time": format(m.timestamp, "dd/MM/yyyy HH:mm"),
      "Status": m.status,
      "GRN": m.grnNumber || "-",
    }));
    const materialSheet = XLSX.utils.json_to_sheet(materialData);
    XLSX.utils.book_append_sheet(workbook, materialSheet, "Materials");

    // Visitors Sheet
    const visitorData = filteredVisitors.map((v) => ({
      "Name": v.name,
      "Company": v.company || "-",
      "Phone": v.phone,
      "Purpose": v.purpose,
      "Host": v.hostName,
      "Department": v.hostDepartment,
      "Badge": v.badge || "-",
      "Check-In": v.status !== "expected" ? format(v.entryTime, "dd/MM/yyyy HH:mm") : "-",
      "Check-Out": v.exitTime ? format(v.exitTime, "dd/MM/yyyy HH:mm") : "-",
      "Status": v.status,
    }));
    const visitorSheet = XLSX.utils.json_to_sheet(visitorData);
    XLSX.utils.book_append_sheet(workbook, visitorSheet, "Visitors");

    // Summary Sheet
    const summaryData = [
      { "Category": "Total Vehicles", "Count": stats.totalVehicles },
      { "Category": "Vehicles Inside", "Count": stats.vehiclesIn },
      { "Category": "Vehicles Exited", "Count": stats.vehiclesOut },
      { "Category": "Total Materials", "Count": stats.totalMaterials },
      { "Category": "Material Inward", "Count": stats.materialInward },
      { "Category": "Material Outward", "Count": stats.materialOutward },
      { "Category": "Pending Verification", "Count": stats.pendingVerification },
      { "Category": "Total Visitors", "Count": stats.totalVisitors },
      { "Category": "Visitors Inside", "Count": stats.visitorsCheckedIn },
      { "Category": "Visitors Checked Out", "Count": stats.visitorsCheckedOut },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    const fileName = `Gate_Entry_Report_${format(selectedDate, "dd-MM-yyyy")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success("Excel report downloaded successfully");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Gate Entry Report", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateText = reportType === "daily" 
      ? format(selectedDate, "dd MMMM yyyy")
      : `${format(dateRange.start, "dd MMM")} - ${format(dateRange.end, "dd MMM yyyy")}`;
    doc.text(dateText, pageWidth / 2, 28, { align: "center" });

    // Summary Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 40);

    autoTable(doc, {
      startY: 45,
      head: [["Category", "Count"]],
      body: [
        ["Total Vehicles", stats.totalVehicles.toString()],
        ["Vehicles Inside", stats.vehiclesIn.toString()],
        ["Vehicles Exited", stats.vehiclesOut.toString()],
        ["Total Materials", stats.totalMaterials.toString()],
        ["Material Inward", stats.materialInward.toString()],
        ["Material Outward", stats.materialOutward.toString()],
        ["Pending Verification", stats.pendingVerification.toString()],
        ["Total Visitors", stats.totalVisitors.toString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Vehicles Table
    let yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Entries", 14, yPos);

    autoTable(doc, {
      startY: yPos + 5,
      head: [["Vehicle No", "Driver", "Purpose", "Entry Time", "Status"]],
      body: filteredVehicles.map((v) => [
        v.vehicleNumber,
        v.driverName,
        v.purpose,
        format(v.entryTime, "HH:mm"),
        v.status === "in" ? "Inside" : "Exited",
      ]),
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    });

    // Materials Table
    yPos = (doc as any).lastAutoTable.finalY + 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Material Entries", 14, yPos);

    autoTable(doc, {
      startY: yPos + 5,
      head: [["Type", "Material", "Qty", "Vehicle", "Status"]],
      body: filteredMaterials.map((m) => [
        m.type,
        m.materialDescription.substring(0, 20),
        `${m.quantity} ${m.unit}`,
        m.vehicleNumber,
        m.status,
      ]),
      theme: "grid",
      headStyles: { fillColor: [249, 115, 22] },
    });

    // Visitors Table
    yPos = (doc as any).lastAutoTable.finalY + 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Visitor Entries", 14, yPos);

    autoTable(doc, {
      startY: yPos + 5,
      head: [["Name", "Company", "Host", "Badge", "Status"]],
      body: filteredVisitors.map((v) => [
        v.name,
        v.company || "-",
        v.hostName,
        v.badge || "-",
        v.status,
      ]),
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on ${format(new Date(), "dd MMM yyyy, HH:mm")} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    const fileName = `Gate_Entry_Report_${format(selectedDate, "dd-MM-yyyy")}.pdf`;
    doc.save(fileName);
    toast.success("PDF report downloaded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Gate Entry Reports
            </CardTitle>
            <CardDescription>View and export gate entry data</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={reportType} onValueChange={(v: "daily" | "weekly") => setReportType(v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "dd MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" onClick={exportToExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                  <p className="text-xs text-muted-foreground">Total Vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Package className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalMaterials}</p>
                  <p className="text-xs text-muted-foreground">Material Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalVisitors}</p>
                  <p className="text-xs text-muted-foreground">Total Visitors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingVerification}</p>
                  <p className="text-xs text-muted-foreground">Pending Verification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail Tables */}
        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles ({filteredVehicles.length})</TabsTrigger>
            <TabsTrigger value="materials">Materials ({filteredMaterials.length})</TabsTrigger>
            <TabsTrigger value="visitors">Visitors ({filteredVisitors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle No</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No vehicle entries for selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.vehicleNumber}</TableCell>
                        <TableCell>{v.driverName}</TableCell>
                        <TableCell className="capitalize">{v.purpose}</TableCell>
                        <TableCell>{v.vendor || "-"}</TableCell>
                        <TableCell>{format(v.entryTime, "HH:mm")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            v.status === "in" 
                              ? "bg-green-500/10 text-green-500" 
                              : "bg-slate-500/10 text-slate-500"
                          }>
                            {v.status === "in" ? "Inside" : "Exited"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No material entries for selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMaterials.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <Badge variant="outline" className={
                            m.type === "inward" 
                              ? "bg-emerald-500/10 text-emerald-500" 
                              : "bg-orange-500/10 text-orange-500"
                          }>
                            {m.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{m.materialDescription}</TableCell>
                        <TableCell>{m.quantity} {m.unit}</TableCell>
                        <TableCell>{m.vehicleNumber}</TableCell>
                        <TableCell>{format(m.timestamp, "HH:mm")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            m.status === "verified" ? "bg-green-500/10 text-green-500" :
                            m.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                            "bg-red-500/10 text-red-500"
                          }>
                            {m.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="visitors">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No visitor entries for selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVisitors.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>{v.company || "-"}</TableCell>
                        <TableCell>{v.hostName}</TableCell>
                        <TableCell>{v.badge || "-"}</TableCell>
                        <TableCell>
                          {v.status !== "expected" ? format(v.entryTime, "HH:mm") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            v.status === "checked_in" ? "bg-green-500/10 text-green-500" :
                            v.status === "expected" ? "bg-blue-500/10 text-blue-500" :
                            "bg-slate-500/10 text-slate-500"
                          }>
                            {v.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
