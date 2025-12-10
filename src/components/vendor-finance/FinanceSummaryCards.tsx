import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/pages/VendorFinance";
import { DollarSign, AlertTriangle, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { differenceInDays } from "date-fns";

interface FinanceSummaryCardsProps {
  invoices: Invoice[];
}

export const FinanceSummaryCards = ({ invoices }: FinanceSummaryCardsProps) => {
  const today = new Date();

  const totalOutstanding = invoices.reduce(
    (sum, inv) => sum + (inv.amount - inv.paidAmount),
    0
  );

  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "overdue" || (inv.dueDate < today && inv.status !== "paid")
  );

  const totalOverdue = overdueInvoices.reduce(
    (sum, inv) => sum + (inv.amount - inv.paidAmount),
    0
  );

  const calculateInterest = (invoice: Invoice) => {
    if (invoice.status === "paid" || invoice.dueDate >= today) return 0;
    const daysOverdue = differenceInDays(today, invoice.dueDate);
    const outstanding = invoice.amount - invoice.paidAmount;
    return (outstanding * invoice.interestRate * daysOverdue) / 100 / 30;
  };

  const totalInterest = invoices.reduce(
    (sum, inv) => sum + calculateInterest(inv),
    0
  );

  const pendingPayments = invoices.filter(
    (inv) => inv.status === "pending" || inv.status === "partial"
  ).length;

  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      title: "Total Outstanding",
      value: formatCurrency(totalOutstanding),
      icon: DollarSign,
      description: `${invoices.length - paidInvoices} unpaid invoices`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Overdue Amount",
      value: formatCurrency(totalOverdue),
      icon: AlertTriangle,
      description: `${overdueInvoices.length} overdue invoices`,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Accrued Interest",
      value: formatCurrency(totalInterest),
      icon: TrendingUp,
      description: "Based on payment delays",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Pending Payments",
      value: pendingPayments.toString(),
      icon: Clock,
      description: "Awaiting processing",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Paid This Month",
      value: paidInvoices.toString(),
      icon: CheckCircle,
      description: "Successfully cleared",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
