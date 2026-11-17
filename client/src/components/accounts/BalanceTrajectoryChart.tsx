import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPKR } from "../../utils/format";
import type { AccountSnapshotTrajectory } from "../../types";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface BalanceTrajectoryChartProps {
  trajectory: AccountSnapshotTrajectory;
}

export default function BalanceTrajectoryChart({ trajectory }: BalanceTrajectoryChartProps) {
  if (trajectory.snapshots.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 text-sm">
        No historical data available
      </div>
    );
  }

  const chartData = trajectory.snapshots.map((s) => ({
    ...s,
    label: `${MONTH_NAMES[s.month - 1]} ${s.year}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number | undefined) => [formatPKR(value ?? 0), "Balance"]}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
