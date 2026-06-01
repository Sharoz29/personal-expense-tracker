import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatPKR } from "../../utils/format";

interface MonthlyTrendChartProps {
  data: { month: number; income: number; expenses: number }[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return <div className="text-center text-gray-500 py-8">No data for this year</div>;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: MONTH_NAMES[d.month - 1],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => formatPKR(Number(value))} />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
