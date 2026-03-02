import { useState } from "react";
import { usePayables } from "../hooks/usePayables";
import { useAccounts } from "../hooks/useAccounts";
import PayableList from "../components/payables/PayableList";
import PayableForm from "../components/payables/PayableForm";
import MarkPaidDialog from "../components/payables/MarkPaidDialog";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus } from "lucide-react";
import type { Payable } from "../types";
import { formatPKR } from "../utils/format";

export default function Payables() {
  const { payables, loading, totalPending, create, update, markPaid, remove } = usePayables();
  const { accounts } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Payable | null>(null);
  const [deleting, setDeleting] = useState<Payable | null>(null);
  const [markingPaid, setMarkingPaid] = useState<Payable | null>(null);

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

  const handleMarkPaid = async (payableId: number, accountId: number) => {
    await markPaid(payableId, accountId);
    setMarkingPaid(null);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Payable to Me</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add Payable
        </button>
      </header>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Pending Total Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <p className="text-sm text-gray-500 mb-1">Total Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatPKR(totalPending)}
          </p>
        </div>

        {/* Payables List */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${payables.length} payable${payables.length !== 1 ? "s" : ""}`}
            </h3>
          </div>
          <PayableList
            payables={payables}
            totalPending={totalPending}
            onEdit={(p) => { setEditing(p); setShowForm(true); }}
            onDelete={setDeleting}
            onMarkPaid={setMarkingPaid}
          />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Payable" : "Add Payable"}
      >
        <PayableForm
          payable={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <MarkPaidDialog
        open={markingPaid !== null}
        payable={markingPaid}
        accounts={accounts}
        onClose={() => setMarkingPaid(null)}
        onConfirm={handleMarkPaid}
      />

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Payable"
        message={`Delete this ${formatPKR(deleting?.amount ?? 0)} payable?`}
      />
    </>
  );
}
