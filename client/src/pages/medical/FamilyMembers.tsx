import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useFamilyMembers } from "../../hooks/useFamilyMembers";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import FamilyMemberForm from "../../components/medical/FamilyMemberForm";
import { formatDate } from "../../utils/dateFormat";
import type { FamilyMember } from "../../types";

export default function FamilyMembers() {
  const { members, loading, error, create, update, remove } = useFamilyMembers();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [deleting, setDeleting] = useState<FamilyMember | null>(null);

  const handleSubmit = async (data: { name: string; relationship: string; date_of_birth?: string }) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (deleting) {
      await remove(deleting.id);
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="p-4 md:p-6"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Family Members</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {members.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No family members yet. Add yourself to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{m.name}</h3>
                  <p className="text-sm text-gray-500">{m.relationship}</p>
                  {m.date_of_birth && (
                    <p className="text-xs text-gray-400 mt-1">DOB: {formatDate(m.date_of_birth)}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(m); setShowForm(true); }}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => setDeleting(m)}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Member" : "Add Family Member"}
      >
        <FamilyMemberForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Family Member"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
