import { useState } from "react";
import Header from "../components/layout/Header";
import { useMonthYear } from "../context/MonthYearContext";
import { useExpenses } from "../hooks/useExpenses";
import { useExpenseTypes } from "../hooks/useExpenseTypes";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus } from "lucide-react";
import type { Expense } from "../types";

export default function Expenses() {
  const { month, year } = useMonthYear();
  const { expenses, loading, total, create, update, remove } = useExpenses(month, year);
  const { expenseTypes } = useExpenseTypes();
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
      <Header title="Expenses" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`}
            </h3>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Add Expense
            </button>
          </div>
          <ExpenseList
            expenses={expenses}
            total={total}
            onEdit={(e) => { setEditing(e); setShowForm(true); }}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Expense" : "Add Expense"}
      >
        <ExpenseForm
          expenseTypes={expenseTypes}
          expense={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Delete this PKR ${deleting?.amount.toFixed(2)} expense?`}
      />
    </>
  );
}
