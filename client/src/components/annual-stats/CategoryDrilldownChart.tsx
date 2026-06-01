import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";
import { formatPKR } from "../../utils/format";

interface CategoryDrilldownChartProps {
  data: { month: number; total: number }[];
  categoryName: string;
  type: "expense" | "income";
  onClose: () => void;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CategoryDrilldownChart({ data, categoryName, type, onClose }: CategoryDrilldownChartProps) {
  const color = type === "expense" ? "#ef4444" : "#22c55e";
  const total = data.reduce((sum, d) => sum + d.total, 0);

  const chartData = data.map((d) => ({
    ...d,
    label: MONTH_NAMES[d.month - 1],
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {categoryName} — Monthly Breakdown
          </h3>
          <p className="text-sm text-gray-500">
            Annual total: <span className="font-medium text-gray-700">{formatPKR(total)}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatPKR(Number(value))} />
          <Bar dataKey="total" name={categoryName} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
