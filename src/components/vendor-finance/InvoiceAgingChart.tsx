import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/pages/VendorFinance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { differenceInDays } from "date-fns";

interface InvoiceAgingChartProps {
  invoices: Invoice[];
}

export const InvoiceAgingChart = ({ invoices }: InvoiceAgingChartProps) => {
  const today = new Date();

  const getAgingBucket = (invoice: Invoice) => {
    if (invoice.status === "paid") return "paid";
    const overdueDays = differenceInDays(today, invoice.dueDate);
    if (overdueDays <= 0) return "current";
    if (overdueDays <= 30) return "0-30";
    if (overdueDays <= 60) return "31-60";
    if (overdueDays <= 90) return "61-90";
    return "90+";
  };

  const agingData = invoices.reduce(
    (acc, invoice) => {
      const bucket = getAgingBucket(invoice);
      const outstanding = invoice.amount - invoice.paidAmount;
      if (bucket !== "paid") {
        acc[bucket].amount += outstanding;
        acc[bucket].count += 1;
      }
      return acc;
    },
    {
      current: { amount: 0, count: 0 },
      "0-30": { amount: 0, count: 0 },
      "31-60": { amount: 0, count: 0 },
      "61-90": { amount: 0, count: 0 },
      "90+": { amount: 0, count: 0 },
    } as Record<string, { amount: number; count: number }>
  );

  const barChartData = [
    { name: "Current", amount: agingData.current.amount, count: agingData.current.count },
    { name: "0-30 Days", amount: agingData["0-30"].amount, count: agingData["0-30"].count },
    { name: "31-60 Days", amount: agingData["31-60"].amount, count: agingData["31-60"].count },
    { name: "61-90 Days", amount: agingData["61-90"].amount, count: agingData["61-90"].count },
    { name: "90+ Days", amount: agingData["90+"].amount, count: agingData["90+"].count },
  ];

  const pieChartData = barChartData.filter((d) => d.amount > 0);

  const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#dc2626"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalOutstanding = Object.values(agingData).reduce(
    (sum, bucket) => sum + bucket.amount,
    0
  );

  // Vendor-wise aging breakdown
  type VendorAgingEntry = {
    vendorName: string;
    vendorCode: string;
    total: number;
    current: number;
    "0-30": number;
    "31-60": number;
    "61-90": number;
    "90+": number;
  };

  const vendorAgingData = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((acc: VendorAgingEntry[], invoice) => {
      const existing = acc.find((v) => v.vendorName === invoice.vendorName);
      const outstanding = invoice.amount - invoice.paidAmount;
      const bucket = getAgingBucket(invoice) as keyof Omit<VendorAgingEntry, "vendorName" | "vendorCode">;

      if (existing) {
        existing.total += outstanding;
        existing[bucket] = (existing[bucket] || 0) + outstanding;
      } else {
        const newEntry: VendorAgingEntry = {
          vendorName: invoice.vendorName,
          vendorCode: invoice.vendorCode,
          total: outstanding,
          current: 0,
          "0-30": 0,
          "31-60": 0,
          "61-90": 0,
          "90+": 0,
        };
        newEntry[bucket] = outstanding;
        acc.push(newEntry);
      }
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aging by Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    className="text-xs"
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {barChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution by Aging Bucket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="amount"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[barChartData.findIndex((d) => d.name === entry.name)]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor-wise Aging Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">0-30 Days</TableHead>
                <TableHead className="text-right">31-60 Days</TableHead>
                <TableHead className="text-right">61-90 Days</TableHead>
                <TableHead className="text-right">90+ Days</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorAgingData.map((vendor) => (
                <TableRow key={vendor.vendorCode}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.vendorName}</div>
                      <div className="text-xs text-muted-foreground">
                        {vendor.vendorCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {vendor.current > 0 ? formatCurrency(vendor.current) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {vendor["0-30"] > 0 ? (
                      <span className="text-yellow-500">
                        {formatCurrency(vendor["0-30"])}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {vendor["31-60"] > 0 ? (
                      <span className="text-orange-500">
                        {formatCurrency(vendor["31-60"])}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {vendor["61-90"] > 0 ? (
                      <span className="text-red-500">
                        {formatCurrency(vendor["61-90"])}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {vendor["90+"] > 0 ? (
                      <span className="text-red-700 font-medium">
                        {formatCurrency(vendor["90+"])}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(vendor.total)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(agingData.current.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(agingData["0-30"].amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(agingData["31-60"].amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(agingData["61-90"].amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(agingData["90+"].amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalOutstanding)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
