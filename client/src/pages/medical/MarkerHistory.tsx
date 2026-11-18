import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

  // Reference ranges (from marker, consistent across all entries)
  const minRef = history.length > 0 ? history[0].min_reference : null;
  const maxRef = history.length > 0 ? history[0].max_reference : null;
  const normalValue = history.length > 0 ? history[0].normal_value : null;

  const chartData = history.map((h) => ({
    ...h,
    label: h.report_date,
  }));

  if (loading) {
    return <div className="p-4 md:p-6"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">
          {markerName || "Marker"} History
          {markerUnit && <span className="text-gray-400 text-base font-normal ml-2">({markerUnit})</span>}
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
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          {markerType === "numeric" && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number | undefined) => [value ?? 0, markerName]}
                />
                {minRef != null && (
                  <ReferenceLine
                    y={minRef}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: `Min: ${minRef}`, position: "insideBottomLeft", fontSize: 10, fill: "#22c55e" }}
                  />
                )}
                {maxRef != null && (
                  <ReferenceLine
                    y={maxRef}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: `Max: ${maxRef}`, position: "insideTopLeft", fontSize: 10, fill: "#ef4444" }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Data table */}
          <table className={`w-full text-sm ${markerType === "numeric" ? "mt-6" : ""}`}>
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium text-gray-600">Date</th>
                <th className="pb-2 font-medium text-gray-600">Value</th>
                <th className="pb-2 font-medium text-gray-600">
                  {markerType === "text" ? "Normal Value" : "Reference Range"}
                </th>
                <th className="pb-2 font-medium text-gray-600">Lab</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => {
                const isAbnormal = markerType === "text"
                  ? (h.normal_value != null && h.text_value !== h.normal_value)
                  : ((h.min_reference !== null && (h.value ?? 0) < h.min_reference) ||
                     (h.max_reference !== null && (h.value ?? 0) > h.max_reference));
                return (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2">{h.report_date}</td>
                    <td className={`py-2 font-medium ${isAbnormal ? "text-red-600" : "text-green-600"}`}>
                      {markerType === "text" ? h.text_value : h.value}
                    </td>
                    <td className="py-2 text-gray-500">
                      {markerType === "text"
                        ? (normalValue ?? "—")
                        : (h.min_reference !== null || h.max_reference !== null
                            ? `${h.min_reference ?? "—"} – ${h.max_reference ?? "—"}`
                            : "—")}
                    </td>
                    <td className="py-2 text-gray-400">{h.lab_name || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
