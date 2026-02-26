import { useState } from "react";
import Header from "../components/layout/Header";
import { useMonthYear } from "../context/MonthYearContext";
import { useIncomes } from "../hooks/useIncomes";
import { useIncomeSources } from "../hooks/useIncomeSources";
import IncomeList from "../components/income/IncomeList";
import IncomeForm from "../components/income/IncomeForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus } from "lucide-react";
import type { Income as IncomeType } from "../types";

export default function Income() {
  const { month, year } = useMonthYear();
  const { incomes, loading, total, create, update, remove } = useIncomes(month, year);
  const { incomeSources } = useIncomeSources();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IncomeType | null>(null);
  const [deleting, setDeleting] = useState<IncomeType | null>(null);

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
      <Header title="Income" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${incomes.length} income entr${incomes.length !== 1 ? "ies" : "y"}`}
            </h3>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Add Income
            </button>
          </div>
          <IncomeList
            incomes={incomes}
            total={total}
            onEdit={(i) => { setEditing(i); setShowForm(true); }}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Income" : "Add Income"}
      >
        <IncomeForm
          incomeSources={incomeSources}
          income={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Income"
        message={`Delete this $${deleting?.amount.toFixed(2)} income entry?`}
      />
    </>
  );
}
