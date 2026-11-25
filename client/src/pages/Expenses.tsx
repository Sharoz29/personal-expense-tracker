import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { useMonthYear } from "../context/MonthYearContext";
import { useExpenses } from "../hooks/useExpenses";
import Loader from "../components/common/Loader";
import { useExpenseTypes } from "../hooks/useExpenseTypes";
import { useAccounts } from "../hooks/useAccounts";
import { usePayableTypes } from "../hooks/usePayableTypes";
import { usePayees } from "../hooks/usePayees";
import { useInstallmentPlans } from "../hooks/useInstallmentPlans";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus, Filter } from "lucide-react";
import type { Expense } from "../types";
import { formatPKR } from "../utils/format";
import { payablesApi } from "../api/payables.api";

export default function Expenses() {
  const { month, year } = useMonthYear();
  const { expenses, loading, total, create, update, remove } = useExpenses(month, year);
  const { expenseTypes } = useExpenseTypes();
  const { accounts } = useAccounts();
  const { payableTypes } = usePayableTypes();
  const { payees } = usePayees();
  const { plans: installmentPlans } = useInstallmentPlans();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [filterTypeId, setFilterTypeId] = useState<number | null>(null);
  const [filterAccountId, setFilterAccountId] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState("");

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

  const filteredExpenses = expenses.filter((e) => {
    if (filterTypeId && e.expense_type_id !== filterTypeId) return false;
    if (filterAccountId && e.account_id !== filterAccountId) return false;
    if (filterDate && e.date !== filterDate) return false;
    return true;
  });
  const hasFilter = filterTypeId || filterAccountId || filterDate;
  const filteredTotal = hasFilter
    ? filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    : total;

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
      if (data.create_payable) {
        await payablesApi.create({
          description: data.description,
          amount: data.amount,
          incurred_date: data.date,
          ...(data.payee_id ? { payee_id: data.payee_id } : {}),
          ...(data.payable_type_id ? { payable_type_id: data.payable_type_id } : {}),
        });
      }
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
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">
                {loading ? <Loader module="finance" size="inline" /> : `${filteredExpenses.length} expense${filteredExpenses.length !== 1 ? "s" : ""}`}
              </h3>
              {/* Mobile: icon-only */}
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="sm:hidden p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
              {/* Large screens (xl+): full button in top row */}
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="hidden xl:flex px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors items-center gap-1 whitespace-nowrap"
              >
                <Plus size={16} /> Add Expense
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-gray-500">
              <Filter size={14} className="hidden sm:block" />
              <select
                value={filterTypeId ?? ""}
                onChange={(e) => setFilterTypeId(e.target.value ? Number(e.target.value) : null)}
                className="min-w-0 flex-1 sm:flex-none px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {expenseTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <select
                value={filterAccountId ?? ""}
                onChange={(e) => setFilterAccountId(e.target.value ? Number(e.target.value) : null)}
                className="min-w-0 flex-1 sm:flex-none px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Accounts</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="min-w-0 flex-1 sm:flex-none px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Tablet/Laptop (sm to xl): button adjacent to pickers */}
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="hidden sm:flex xl:hidden px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors items-center gap-1 whitespace-nowrap"
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
          payableTypes={payableTypes}
          payees={payees}
          installmentPlans={installmentPlans}
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
