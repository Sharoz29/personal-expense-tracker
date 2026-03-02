import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { useMonthYear } from "../context/MonthYearContext";
import { useExpenses } from "../hooks/useExpenses";
import { useExpenseTypes } from "../hooks/useExpenseTypes";
import { useAccounts } from "../hooks/useAccounts";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus, Filter } from "lucide-react";
import type { Expense } from "../types";
import { formatPKR } from "../utils/format";

export default function Expenses() {
  const { month, year } = useMonthYear();
  const { expenses, loading, total, create, update, remove } = useExpenses(month, year);
  const { expenseTypes } = useExpenseTypes();
  const { accounts } = useAccounts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [filterTypeId, setFilterTypeId] = useState<number | null>(null);

  // Sync filter from URL search param when expense types load
  useEffect(() => {
    const typeName = searchParams.get("type");
    if (typeName && expenseTypes.length > 0) {
      const match = expenseTypes.find((t) => t.name === typeName);
      if (match) setFilterTypeId(match.id);
      searchParams.delete("type");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, expenseTypes, setSearchParams]);

  const filteredExpenses = filterTypeId
    ? expenses.filter((e) => e.expense_type_id === filterTypeId)
    : expenses;
  const filteredTotal = filterTypeId
    ? filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    : total;

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
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${filteredExpenses.length} expense${filteredExpenses.length !== 1 ? "s" : ""}`}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Filter size={14} className="hidden sm:block" />
                <select
                  value={filterTypeId ?? ""}
                  onChange={(e) => setFilterTypeId(e.target.value ? Number(e.target.value) : null)}
                  className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {expenseTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <Plus size={16} /> Add Expense
              </button>
            </div>
          </div>
          <ExpenseList
            expenses={filteredExpenses}
            total={filteredTotal}
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
          accounts={accounts}
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
        message={`Delete this ${formatPKR(deleting?.amount ?? 0)} expense?`}
      />
    </>
  );
}
