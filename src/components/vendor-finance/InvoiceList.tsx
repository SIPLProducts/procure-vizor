import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from "@/pages/VendorFinance";
import { Search, Download, Filter, Eye } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InvoiceListProps {
  invoices: Invoice[];
}

export const InvoiceList = ({ invoices }: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const today = new Date();

  const calculateOverdueDays = (invoice: Invoice) => {
    if (invoice.status === "paid") return 0;
    const days = differenceInDays(today, invoice.dueDate);
    return days > 0 ? days : 0;
  };

  const calculateInterest = (invoice: Invoice) => {
    const overdueDays = calculateOverdueDays(invoice);
    if (overdueDays === 0) return 0;
    const outstanding = invoice.amount - invoice.paidAmount;
    return (outstanding * invoice.interestRate * overdueDays) / 100 / 30;
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const styles = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      partial: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      paid: "bg-green-500/10 text-green-500 border-green-500/20",
      overdue: "bg-destructive/10 text-destructive border-destructive/20",
      disputed: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAgingBucket = (invoice: Invoice) => {
    const overdueDays = calculateOverdueDays(invoice);
    if (overdueDays === 0) return "Current";
    if (overdueDays <= 30) return "0-30 Days";
    if (overdueDays <= 60) return "31-60 Days";
    if (overdueDays <= 90) return "61-90 Days";
    return "90+ Days";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Outstanding Invoices</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>Overdue</TableHead>
              <TableHead className="text-right">Interest</TableHead>
              <TableHead>Aging</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => {
              const overdueDays = calculateOverdueDays(invoice);
              const interest = calculateInterest(invoice);
              const outstanding = invoice.amount - invoice.paidAmount;

              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.vendorName}</div>
                      <div className="text-xs text-muted-foreground">
                        {invoice.vendorCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.poNumber}</TableCell>
                  <TableCell>{format(invoice.invoiceDate, "dd MMM yyyy")}</TableCell>
                  <TableCell>{format(invoice.dueDate, "dd MMM yyyy")}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(outstanding)}
                  </TableCell>
                  <TableCell>
                    {overdueDays > 0 ? (
                      <span className="text-destructive font-medium">
                        {overdueDays} days
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {interest > 0 ? (
                      <span className="text-orange-500 font-medium">
                        {formatCurrency(interest)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        getAgingBucket(invoice) === "Current"
                          ? "bg-green-500/10 text-green-500"
                          : getAgingBucket(invoice) === "0-30 Days"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : getAgingBucket(invoice) === "31-60 Days"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {getAgingBucket(invoice)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Invoice Details</DialogTitle>
                        </DialogHeader>
                        {selectedInvoice && (
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Invoice Number
                                </p>
                                <p className="font-medium">
                                  {selectedInvoice.invoiceNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  PO Number
                                </p>
                                <p className="font-medium">
                                  {selectedInvoice.poNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Vendor
                                </p>
                                <p className="font-medium">
                                  {selectedInvoice.vendorName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Payment Terms
                                </p>
                                <p className="font-medium">
                                  {selectedInvoice.paymentTerms}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Invoice Date
                                </p>
                                <p className="font-medium">
                                  {format(selectedInvoice.invoiceDate, "dd MMM yyyy")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Due Date
                                </p>
                                <p className="font-medium">
                                  {format(selectedInvoice.dueDate, "dd MMM yyyy")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Invoice Amount
                                </p>
                                <p className="font-medium">
                                  {formatCurrency(selectedInvoice.amount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Amount Paid
                                </p>
                                <p className="font-medium">
                                  {formatCurrency(selectedInvoice.paidAmount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Outstanding
                                </p>
                                <p className="font-medium text-destructive">
                                  {formatCurrency(
                                    selectedInvoice.amount - selectedInvoice.paidAmount
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Accrued Interest
                                </p>
                                <p className="font-medium text-orange-500">
                                  {formatCurrency(calculateInterest(selectedInvoice))}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Description
                              </p>
                              <p className="font-medium">
                                {selectedInvoice.description}
                              </p>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button className="flex-1">Record Payment</Button>
                              <Button variant="outline" className="flex-1">
                                Send Reminder
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
