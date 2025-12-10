import { Invoice } from "@/pages/VendorFinance";
import { DollarSign, AlertTriangle, Clock, CheckCircle, TrendingUp, LucideIcon } from "lucide-react";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface FinanceSummaryCardsProps {
  invoices: Invoice[];
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconShadow: string;
  titleColor: string;
}

const StatCard = ({ title, value, description, icon: Icon, gradient, iconShadow, titleColor }: StatCardProps) => (
  <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className={cn("text-xs font-bold uppercase tracking-wider", titleColor)}>
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <div className={cn(
        "p-3 rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105",
        gradient,
        iconShadow
      )}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

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
      gradient: "bg-gradient-to-br from-blue-400 to-cyan-500",
      iconShadow: "shadow-blue-500/30",
      titleColor: "text-blue-600",
    },
    {
      title: "Overdue Amount",
      value: formatCurrency(totalOverdue),
      icon: AlertTriangle,
      description: `${overdueInvoices.length} overdue invoices`,
      gradient: "bg-gradient-to-br from-red-400 to-rose-500",
      iconShadow: "shadow-red-500/30",
      titleColor: "text-red-600",
    },
    {
      title: "Accrued Interest",
      value: formatCurrency(totalInterest),
      icon: TrendingUp,
      description: "Based on payment delays",
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconShadow: "shadow-amber-500/30",
      titleColor: "text-amber-600",
    },
    {
      title: "Pending Payments",
      value: pendingPayments.toString(),
      icon: Clock,
      description: "Awaiting processing",
      gradient: "bg-gradient-to-br from-yellow-400 to-amber-500",
      iconShadow: "shadow-yellow-500/30",
      titleColor: "text-yellow-600",
    },
    {
      title: "Paid This Month",
      value: paidInvoices.toString(),
      icon: CheckCircle,
      description: "Successfully cleared",
      gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
      iconShadow: "shadow-green-500/30",
      titleColor: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};
