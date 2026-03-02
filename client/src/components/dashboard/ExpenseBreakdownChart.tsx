import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { formatPKR } from "../../utils/format";

interface ExpenseBreakdownChartProps {
  data: { name: string; total: number }[];
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"];

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const navigate = useNavigate();

  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No expense data for this month</div>;
  }

  const handleClick = (entry: { name?: string }) => {
    if (entry.name) navigate(`/expenses?type=${encodeURIComponent(entry.name)}`);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(props: any) => `${props.name} (${((props.percent ?? 0) * 100).toFixed(0)}%)`}
          labelLine={false}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatPKR(Number(value))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
