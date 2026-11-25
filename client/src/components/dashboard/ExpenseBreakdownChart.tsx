import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { formatPKR } from "../../utils/format";

interface ExpenseBreakdownChartProps {
  data: { name: string; total: number }[];
  onItemClick?: (name: string) => void;
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"];

function useContainerWidth() {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  const callbackRef = useCallback((node: HTMLDivElement | null) => {
    setRef(node);
    if (node) setWidth(node.offsetWidth);
  }, []);

  useEffect(() => {
    if (!ref) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return { callbackRef, width };
}

export default function ExpenseBreakdownChart({ data, onItemClick }: ExpenseBreakdownChartProps) {
  const navigate = useNavigate();
  const { callbackRef, width } = useContainerWidth();

  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No expense data</div>;
  }

  const handleClick = (entry: { name?: string }) => {
    if (!entry.name) return;
    if (onItemClick) {
      onItemClick(entry.name);
    } else {
      navigate(`/expenses?type=${encodeURIComponent(entry.name)}`);
    }
  };

  // Responsive chart settings based on actual container width
  const isNarrow = width > 0 && width < 400;
  const outerRadius = isNarrow ? Math.max(60, width * 0.22) : Math.min(100, width * 0.18);
  // Narrow containers need more height for the legend rows that wrap
  const legendRows = isNarrow ? Math.ceil(data.length / 2) : Math.ceil(data.length / 3);
  const pieSection = isNarrow ? outerRadius * 2 + 40 : 220;
  const chartHeight = pieSection + legendRows * 22 + 20;

  return (
    <div ref={callbackRef}>
      {width > 0 && (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy={pieSection / 2}
              outerRadius={outerRadius}
              label={false}
              labelLine={false}
              onClick={handleClick}
              style={{ cursor: "pointer" }}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const total = data.reduce((sum, d) => sum + d.total, 0);
                const pct = total > 0 ? ((Number(value) / total) * 100).toFixed(0) : "0";
                return [`${formatPKR(Number(value))} (${pct}%)`, name];
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={isNarrow ? { fontSize: 11, lineHeight: "20px" } : { fontSize: 12, lineHeight: "22px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
