import { useNavigate } from "react-router-dom";
import { Users, FileText, ClipboardList, Plus, AlertTriangle, Clock } from "lucide-react";
import { useFamilyMembers } from "../../hooks/useFamilyMembers";
import { useHealthReports } from "../../hooks/useHealthReports";
import { useFollowUps } from "../../hooks/useFollowUps";
import { formatDate } from "../../utils/dateFormat";

export default function MedicalDashboard() {
  const navigate = useNavigate();
  const { members } = useFamilyMembers();
  const { reports } = useHealthReports();
  const { followUps } = useFollowUps();

  const recentReports = reports.slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800">Medical Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => navigate("/medical/family-members")}
          className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Users size={20} className="text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{members.length}</span>
          </div>
          <p className="text-sm text-gray-600">Family Members</p>
        </div>

        <div
          onClick={() => navigate("/medical/reports")}
          className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{reports.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total Reports</p>
        </div>

        <div
          onClick={() => navigate("/medical/categories")}
          className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <ClipboardList size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Categories & Markers</p>
        </div>
      </div>

      {/* Follow-up Due Section */}
      {followUps.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">Follow-ups Due</h2>
          </div>
          <div className="space-y-2">
            {followUps.map((f) => (
              <div
                key={`${f.category_id}-${f.family_member_id}`}
                onClick={() => navigate(`/medical/reports?category_id=${f.category_id}&family_member_id=${f.family_member_id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 p-3 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {f.category_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {f.family_member_name} &middot; Last: {formatDate(f.last_report_date)}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    f.is_overdue
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    <Clock size={12} />
                    {f.is_overdue ? "Overdue" : `Due ${formatDate(f.next_due_date)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Reports</h2>
          <button
            onClick={() => navigate("/medical/reports")}
            className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 sm:bg-rose-600 sm:text-white text-rose-600 rounded-lg text-sm sm:hover:bg-rose-700 hover:bg-rose-50 transition-colors shrink-0"
          >
            <Plus size={20} className="sm:hidden" />
            <Plus size={16} className="hidden sm:block" />
            <span className="hidden sm:inline">Add Report</span>
          </button>
        </div>

        {recentReports.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No reports yet. Add a family member, set up categories, then add your first report.
          </p>
        ) : (
          <div className="space-y-2">
            {recentReports.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/medical/reports/${r.id}`)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {r.category_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.family_member_name} &middot; {formatDate(r.report_date)}
                  </p>
                </div>
                {r.lab_name && (
                  <span className="text-xs text-gray-400">{r.lab_name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
