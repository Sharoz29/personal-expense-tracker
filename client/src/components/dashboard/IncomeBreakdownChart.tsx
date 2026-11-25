import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { formatPKR } from "../../utils/format";

interface IncomeBreakdownChartProps {
  data: { name: string; total: number }[];
  onItemClick?: (name: string) => void;
}

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f97316", "#eab308", "#ec4899", "#06b6d4", "#6b7280"];

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

export default function IncomeBreakdownChart({ data, onItemClick }: IncomeBreakdownChartProps) {
  const navigate = useNavigate();
  const { callbackRef, width } = useContainerWidth();

  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No income data</div>;
  }

  const handleClick = (entry: { name?: string }) => {
    if (!entry.name) return;
    if (onItemClick) {
      onItemClick(entry.name);
    } else {
      navigate(`/income?source=${encodeURIComponent(entry.name)}`);
    }
  };

  const isNarrow = width > 0 && width < 400;
  const legendRows = isNarrow ? Math.ceil(data.length / 2) : Math.ceil(data.length / 3);
  const chartHeight = isNarrow ? 200 + legendRows * 22 : 260 + legendRows * 22;

  const renderLegend = () => (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isNarrow ? "4px 10px" : "4px 14px", fontSize: isNarrow ? 11 : 12, lineHeight: isNarrow ? "20px" : "22px", paddingTop: 12 }}>
      {data.map((d, i) => (
        <span key={d.name} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: COLORS[i % COLORS.length], flexShrink: 0 }} />
          {d.name}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={callbackRef}>
      {width > 0 && (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} height={1} />
            <YAxis
              tick={{ fontSize: 10 }}
              width={40}
              tickFormatter={(v) => {
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
                if (v >= 1_000) return `${(v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1)}K`;
                return String(v);
              }}
            />
            <Tooltip formatter={(value) => formatPKR(Number(value))} />
            <Legend content={renderLegend} verticalAlign="bottom" />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} onClick={handleClick} style={{ cursor: "pointer" }}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
