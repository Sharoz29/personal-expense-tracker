import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Loader from "../../components/common/Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useMarkerHistory } from "../../hooks/useMarkerHistory";
import { useFamilyMembers } from "../../hooks/useFamilyMembers";
import { useHealthCategories } from "../../hooks/useHealthCategories";
import { getResultColor, getReferenceDisplay, parseReferenceRanges } from "../../utils/referenceRanges";
import { formatDate } from "../../utils/dateFormat";

const rangeColorMap: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
};

export default function MarkerHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const familyMemberId = Number(searchParams.get("family_member_id") || 0);
  const markerId = Number(searchParams.get("marker_id") || 0);

  const { history, loading, error } = useMarkerHistory(familyMemberId, markerId);
  const { members } = useFamilyMembers();
  const { categories } = useHealthCategories();

  // Find the marker name and member name
  const member = members.find((m) => m.id === familyMemberId);
  let markerName = "";
  let markerUnit = "";
  for (const cat of categories) {
    const found = cat.markers?.find((m) => m.id === markerId);
    if (found) {
      markerName = found.name;
      markerUnit = found.unit;
      break;
    }
  }

  // Determine marker type from history data
  const markerType = history.length > 0 ? history[0].marker_type : "numeric";

  // Reference data (from marker, consistent across all entries)
  const minRef = history.length > 0 ? history[0].min_reference : null;
  const maxRef = history.length > 0 ? history[0].max_reference : null;
  const refRangesJson = history.length > 0 ? history[0].reference_ranges : null;
  const refRanges = parseReferenceRanges(refRangesJson);

  const chartData = history.map((h) => ({
    ...h,
    label: formatDate(h.report_date),
  }));

  // Build reference lines for the chart
  const referenceLines: { y: number; label: string; color: string }[] = [];
  if (markerType === "numeric") {
    if (refRanges.length > 0) {
      // Use tiered ranges: draw lines at each boundary
      for (const range of refRanges) {
        const stroke = rangeColorMap[range.color] ?? "#9ca3af";
        if (range.min != null) {
          referenceLines.push({ y: range.min, label: `${range.label} min: ${range.min}`, color: stroke });
        }
        if (range.max != null) {
          referenceLines.push({ y: range.max, label: `${range.label} max: ${range.max}`, color: stroke });
        }
      }
      // Deduplicate by y value (boundaries shared between ranges)
      const seen = new Set<number>();
      const deduped: typeof referenceLines = [];
      for (const rl of referenceLines) {
        if (!seen.has(rl.y)) {
          seen.add(rl.y);
          deduped.push(rl);
        }
      }
      referenceLines.length = 0;
      referenceLines.push(...deduped);
    } else {
      // Fallback to simple min/max
      if (minRef != null) {
        referenceLines.push({ y: minRef, label: `Min: ${minRef}`, color: "#22c55e" });
      }
      if (maxRef != null) {
        referenceLines.push({ y: maxRef, label: `Max: ${maxRef}`, color: "#ef4444" });
      }
    }
  }

  if (loading) {
    return <div className="p-4 md:p-6"><Loader module="medical" /></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4 sm:space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          {markerName || "Marker"} History
          {markerUnit && <span className="text-gray-400 text-sm sm:text-base font-normal ml-2">({markerUnit})</span>}
        </h1>
        {member && (
          <p className="text-sm text-gray-500">{member.name}</p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No historical data available for this marker.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6">
          {markerType === "numeric" && (
            <div className="-mx-2 sm:mx-0">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} width={40} />
                  <Tooltip
                    formatter={(value: number | undefined) => [value ?? 0, markerName]}
                  />
                  {referenceLines.map((rl, i) => (
                    <ReferenceLine
                      key={i}
                      y={rl.y}
                      stroke={rl.color}
                      strokeDasharray="5 5"
                      label={{ value: rl.label, position: "insideTopLeft", fontSize: 9, fill: rl.color }}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3b82f6" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Mobile card view */}
          <div className={`sm:hidden space-y-2 ${markerType === "numeric" ? "mt-4" : ""}`}>
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{formatDate(h.report_date)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-sm font-medium ${getResultColor({ ...h, marker_type: markerType })}`}>
                      {markerType === "text" ? h.text_value : h.value}
                    </span>
                    <span className="text-xs text-gray-400">{getReferenceDisplay({ ...h, marker_type: markerType })}</span>
                  </div>
                </div>
                {h.lab_name && <span className="text-xs text-gray-400 shrink-0">{h.lab_name}</span>}
              </div>
            ))}
          </div>

          {/* Desktop/tablet table view */}
          <table className={`hidden sm:table w-full text-sm ${markerType === "numeric" ? "mt-6" : ""}`}>
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium text-gray-600">Date</th>
                <th className="pb-2 font-medium text-gray-600">Value</th>
                <th className="pb-2 font-medium text-gray-600">Reference</th>
                <th className="pb-2 font-medium text-gray-600">Lab</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2">{formatDate(h.report_date)}</td>
                  <td className={`py-2 font-medium ${getResultColor({ ...h, marker_type: markerType })}`}>
                    {markerType === "text" ? h.text_value : h.value}
                  </td>
                  <td className="py-2 text-gray-500">
                    {getReferenceDisplay({ ...h, marker_type: markerType })}
                  </td>
                  <td className="py-2 text-gray-400">{h.lab_name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
