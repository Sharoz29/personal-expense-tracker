import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPKR } from "../../utils/format";

interface IncomeBreakdownChartProps {
  data: { name: string; total: number }[];
}

export default function IncomeBreakdownChart({ data }: IncomeBreakdownChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No income data for this month</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => formatPKR(Number(value))} />
        <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
