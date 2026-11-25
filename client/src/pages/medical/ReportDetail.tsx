import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { healthReportsApi } from "../../api/health.api";
import { getResultColor, getReferenceDisplay } from "../../utils/referenceRanges";
import { formatDate } from "../../utils/dateFormat";
import type { HealthReport } from "../../types";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await healthReportsApi.getById(Number(id));
        setReport(data);
      } catch {
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="p-4 md:p-6"><p className="text-gray-500">Loading...</p></div>;
  }

  if (!report) {
    return <div className="p-4 md:p-6"><p className="text-red-600">Report not found</p></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4 sm:space-y-6">
      <button
        onClick={() => navigate("/medical/reports")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Reports
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">{report.category_name}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {report.family_member_name} &middot; {formatDate(report.report_date)}
            {report.lab_name && ` &middot; ${report.lab_name}`}
          </p>
          {report.notes && (
            <p className="text-xs sm:text-sm text-gray-400 mt-1">{report.notes}</p>
          )}
        </div>

        {report.results && report.results.length > 0 ? (
          <>
            {/* Mobile card view */}
            <div className="sm:hidden space-y-2">
              {report.results.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 truncate">
                      {r.marker_name}
                      {r.marker_unit && <span className="text-gray-400 text-xs ml-1">({r.marker_unit})</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm font-medium ${getResultColor(r)}`}>
                        {r.marker_type === "text" ? r.text_value : r.value}
                      </span>
                      <span className="text-xs text-gray-400">{getReferenceDisplay(r)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/medical/history?family_member_id=${report.family_member_id}&marker_id=${r.marker_id}`
                      )
                    }
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors shrink-0"
                    title="View history"
                  >
                    <TrendingUp size={14} className="text-blue-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop/tablet table view */}
            <table className="hidden sm:table w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 font-medium text-gray-600">Marker</th>
                  <th className="pb-2 font-medium text-gray-600">Value</th>
                  <th className="pb-2 font-medium text-gray-600">Reference</th>
                  <th className="pb-2 font-medium text-gray-600 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {report.results.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="py-2.5 text-gray-800">
                      {r.marker_name}
                      {r.marker_unit && <span className="text-gray-400 text-xs ml-1">({r.marker_unit})</span>}
                    </td>
                    <td className={`py-2.5 font-medium ${getResultColor(r)}`}>
                      {r.marker_type === "text" ? r.text_value : r.value}
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {getReferenceDisplay(r)}
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() =>
                          navigate(
                            `/medical/history?family_member_id=${report.family_member_id}&marker_id=${r.marker_id}`
                          )
                        }
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        title="View history"
                      >
                        <TrendingUp size={14} className="text-blue-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-gray-500 text-sm">No results recorded.</p>
        )}
      </div>
    </div>
  );
}
