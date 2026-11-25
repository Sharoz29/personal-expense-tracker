import { useState, useEffect, useCallback } from "react";
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

const formatAxis = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1)}K`;
  return String(v);
};

export default function CumulativeSavingsChart({ data }: CumulativeSavingsChartProps) {
  const { callbackRef, width } = useContainerWidth();

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

  const isNarrow = width > 0 && width < 400;

  const renderLegend = () => (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 14px", fontSize: isNarrow ? 11 : 12, lineHeight: "22px", paddingTop: 8 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#3b82f6", flexShrink: 0 }} />
        Cumulative Savings
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#22c55e", flexShrink: 0 }} />
        Monthly Savings
      </span>
    </div>
  );

  return (
    <div ref={callbackRef}>
      {width > 0 && (
        <ResponsiveContainer width="100%" height={isNarrow ? 260 : 300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: isNarrow ? 9 : 11 }}
              interval={isNarrow ? Math.max(1, Math.floor(chartData.length / 4)) : 0}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              width={40}
              tickFormatter={formatAxis}
            />
            {!isNarrow && (
              <Tooltip
                formatter={(value, name) => [
                  formatPKR(Number(value)),
                  name === "cumulativeSavings" ? "Cumulative Savings" : "Monthly Savings",
                ]}
              />
            )}
            <Legend content={renderLegend} verticalAlign="bottom" />
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
      )}
    </div>
  );
}
