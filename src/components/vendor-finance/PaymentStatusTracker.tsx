import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/pages/VendorFinance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Send,
  CreditCard,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface PaymentStatusTrackerProps {
  invoices: Invoice[];
}

export const PaymentStatusTracker = ({ invoices }: PaymentStatusTrackerProps) => {
  const today = new Date();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "partial":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "disputed":
        return <XCircle className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "border-green-500 bg-green-500/5";
      case "pending":
        return "border-yellow-500 bg-yellow-500/5";
      case "partial":
        return "border-blue-500 bg-blue-500/5";
      case "overdue":
        return "border-destructive bg-destructive/5";
      case "disputed":
        return "border-purple-500 bg-purple-500/5";
    }
  };

  const groupedInvoices = {
    overdue: invoices.filter((inv) => inv.status === "overdue"),
    pending: invoices.filter((inv) => inv.status === "pending"),
    partial: invoices.filter((inv) => inv.status === "partial"),
    disputed: invoices.filter((inv) => inv.status === "disputed"),
    paid: invoices.filter((inv) => inv.status === "paid"),
  };

  const statusLabels = {
    overdue: "Overdue",
    pending: "Pending",
    partial: "Partial Payment",
    disputed: "Disputed",
    paid: "Paid",
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        {(Object.keys(groupedInvoices) as Array<keyof typeof groupedInvoices>).map(
          (status) => {
            const count = groupedInvoices[status].length;
            const total = groupedInvoices[status].reduce(
              (sum, inv) => sum + (inv.amount - inv.paidAmount),
              0
            );
            return (
              <Card key={status} className={`border-l-4 ${getStatusColor(status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(status)}
                    <span className="font-medium">{statusLabels[status]}</span>
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(total)}
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Overdue Invoices - Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedInvoices.overdue.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No overdue invoices
              </p>
            ) : (
              groupedInvoices.overdue.map((invoice) => {
                const overdueDays = differenceInDays(today, invoice.dueDate);
                const outstanding = invoice.amount - invoice.paidAmount;
                const interest =
                  (outstanding * invoice.interestRate * overdueDays) / 100 / 30;

                return (
                  <div
                    key={invoice.id}
                    className="p-4 border rounded-lg space-y-3 bg-destructive/5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.vendorName}
                        </p>
                      </div>
                      <Badge variant="destructive">{overdueDays} days overdue</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Outstanding</p>
                        <p className="font-medium">{formatCurrency(outstanding)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interest</p>
                        <p className="font-medium text-orange-500">
                          {formatCurrency(interest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Due</p>
                        <p className="font-bold text-destructive">
                          {formatCurrency(outstanding + interest)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Partial Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedInvoices.partial.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No partial payments
              </p>
            ) : (
              groupedInvoices.partial.map((invoice) => {
                const outstanding = invoice.amount - invoice.paidAmount;
                const progress = (invoice.paidAmount / invoice.amount) * 100;

                return (
                  <div
                    key={invoice.id}
                    className="p-4 border rounded-lg space-y-3 bg-blue-500/5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.vendorName}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500"
                      >
                        {progress.toFixed(0)}% Paid
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Paid: {formatCurrency(invoice.paidAmount)}
                        </span>
                        <span className="font-medium">
                          Remaining: {formatCurrency(outstanding)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Due: {format(invoice.dueDate, "dd MMM yyyy")}</span>
                      <span>Total: {formatCurrency(invoice.amount)}</span>
                    </div>
                    <Button size="sm" className="w-full">
                      Complete Payment
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Upcoming Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groupedInvoices.pending
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .map((invoice) => {
                const daysUntilDue = differenceInDays(invoice.dueDate, today);
                const isUrgent = daysUntilDue <= 7;

                return (
                  <div
                    key={invoice.id}
                    className={`p-4 border rounded-lg flex justify-between items-center ${
                      isUrgent ? "bg-yellow-500/5 border-yellow-500/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon("pending")}
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.vendorName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(invoice.amount)}</p>
                      <p
                        className={`text-sm ${
                          isUrgent ? "text-yellow-500 font-medium" : "text-muted-foreground"
                        }`}
                      >
                        Due in {daysUntilDue} days
                      </p>
                    </div>
                    <Button size="sm" variant={isUrgent ? "default" : "outline"}>
                      Schedule Payment
                    </Button>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
