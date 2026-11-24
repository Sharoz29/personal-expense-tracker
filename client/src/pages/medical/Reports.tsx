import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useHealthReports } from "../../hooks/useHealthReports";
import { useFamilyMembers } from "../../hooks/useFamilyMembers";
import { useHealthCategories } from "../../hooks/useHealthCategories";
import { healthReportsApi } from "../../api/health.api";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import HealthReportForm from "../../components/medical/HealthReportForm";
import { formatDate } from "../../utils/dateFormat";
import type { HealthReport } from "../../types";

export default function Reports() {
  const navigate = useNavigate();
  const [filterMember, setFilterMember] = useState<number | undefined>();
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const { reports, loading, error, create, remove, refetch } = useHealthReports(
    {
      family_member_id: filterMember,
      category_id: filterCategory,
    },
  );
  const { members } = useFamilyMembers();
  const { categories } = useHealthCategories();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HealthReport | null>(null);
  const [deleting, setDeleting] = useState<HealthReport | null>(null);

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    if (editing) {
      await healthReportsApi.update(editing.id, data);
      await refetch();
    } else {
      await create(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = async (report: HealthReport) => {
    // Fetch full report with results
    const full = await healthReportsApi.getById(report.id);
    setEditing(full);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleting) {
      await remove(deleting.id);
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Health Reports</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
        >
          <Plus size={16} />
          Add Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterMember ?? ""}
          onChange={(e) =>
            setFilterMember(e.target.value ? Number(e.target.value) : undefined)
          }
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="">All Members</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={filterCategory ?? ""}
          onChange={(e) =>
            setFilterCategory(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {reports.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No reports found. Create your first health report.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 font-medium text-gray-600">Person</th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">Lab</th>
                <th className="px-4 py-3 font-medium text-gray-600 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/medical/reports/${r.id}`)}
                >
                  <td className="px-4 py-3">
                    {formatDate(r.report_date)}
                  </td>
                  <td className="px-4 py-3">{r.family_member_name}</td>
                  <td className="px-4 py-3">{r.category_name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {r.lab_name || "—"}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(r)}
                        className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(r)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        title={editing ? "Edit Report" : "Add Health Report"}
      >
        <HealthReportForm
          members={members}
          categories={categories}
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Report"
        message={`Delete this ${deleting?.category_name} report from ${formatDate(deleting?.report_date)}?`}
      />
    </div>
  );
}
