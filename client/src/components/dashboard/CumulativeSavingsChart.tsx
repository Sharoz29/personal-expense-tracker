import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatPKR } from "../../utils/format";
import type { MonthlySavingsRecord } from "../../types";

interface CumulativeSavingsChartProps {
  data: MonthlySavingsRecord[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function CumulativeSavingsChart({ data }: CumulativeSavingsChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No savings data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: `${MONTH_NAMES[d.month - 1]} ${d.year}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatPKR(value),
            name === "cumulativeSavings" ? "Cumulative Savings" : "Monthly Savings",
          ]}
        />
        <Legend
          formatter={(value: string) =>
            value === "cumulativeSavings" ? "Cumulative Savings" : "Monthly Savings"
          }
        />
        <Area
          type="monotone"
          dataKey="cumulativeSavings"
          stroke="#3b82f6"
          fill="#93c5fd"
          fillOpacity={0.3}
        />
        <Area
          type="monotone"
          dataKey="monthlySavings"
          stroke="#22c55e"
          fill="#86efac"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
