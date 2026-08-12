import { useState } from "react";
import { useCommittees } from "../hooks/useCommittees";
import { useAccounts } from "../hooks/useAccounts";
import CommitteeList from "../components/committees/CommitteeList";
import CommitteeForm from "../components/committees/CommitteeForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus } from "lucide-react";
import type { Committee } from "../types";
import { formatPKR } from "../utils/format";

export default function Committees() {
  const { committees, loading, totalPayout, create, update, remove } = useCommittees();
  const { accounts } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Committee | null>(null);
  const [deleting, setDeleting] = useState<Committee | null>(null);

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await remove(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 flex-1">
            <p className="text-sm text-gray-500 mb-1">Total Payout</p>
            <p className="text-2xl font-bold text-emerald-600">{formatPKR(totalPayout)}</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0 self-start"
          >
            <Plus size={16} /> Add Committee
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${committees.length} committee${committees.length !== 1 ? "s" : ""}`}
            </h3>
          </div>
          <CommitteeList
            committees={committees}
            onEdit={(c) => { setEditing(c); setShowForm(true); }}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Committee" : "Add Committee"}
      >
        <CommitteeForm
          committee={editing}
          accounts={accounts}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Committee"
        message={`Delete "${deleting?.name}"?`}
      />
    </>
  );
}
