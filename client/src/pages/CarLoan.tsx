import { useState } from "react";
import { useCarPayments } from "../hooks/useCarPayments";
import { useAccounts } from "../hooks/useAccounts";
import CarPaymentList from "../components/car-loan/CarPaymentList";
import CarPaymentForm from "../components/car-loan/CarPaymentForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus } from "lucide-react";
import type { Expense } from "../types";
import { formatPKR } from "../utils/format";

export default function CarLoan() {
  const { payments, loading, total, create, update, remove } = useCarPayments();
  const { accounts } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);

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
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Car Loan</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add Payment
        </button>
      </header>
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${payments.length} payment${payments.length !== 1 ? "s" : ""}`}
            </h3>
          </div>
          <CarPaymentList
            payments={payments}
            total={total}
            onEdit={(p) => { setEditing(p); setShowForm(true); }}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Payment" : "Add Payment"}
      >
        <CarPaymentForm
          accounts={accounts}
          payment={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Payment"
        message={`Delete this ${formatPKR(deleting?.amount ?? 0)} payment?`}
      />
    </>
  );
}
