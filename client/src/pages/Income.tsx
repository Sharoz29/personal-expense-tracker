import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { useMonthYear } from "../context/MonthYearContext";
import { useIncomes } from "../hooks/useIncomes";
import Loader from "../components/common/Loader";
import { useIncomeSources } from "../hooks/useIncomeSources";
import { useAccounts } from "../hooks/useAccounts";
import IncomeList from "../components/income/IncomeList";
import IncomeForm from "../components/income/IncomeForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus, Filter } from "lucide-react";
import type { Income as IncomeType } from "../types";
import { formatPKR } from "../utils/format";

export default function Income() {
  const { month, year } = useMonthYear();
  const { incomes, loading, total, create, update, remove } = useIncomes(month, year);
  const { incomeSources } = useIncomeSources();
  const { accounts } = useAccounts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IncomeType | null>(null);
  const [deleting, setDeleting] = useState<IncomeType | null>(null);
  const [filterSourceId, setFilterSourceId] = useState<number | null>(null);

  // Sync filter from URL search param when income sources load
  useEffect(() => {
    const sourceName = searchParams.get("source");
    if (sourceName && incomeSources.length > 0) {
      const match = incomeSources.find((s) => s.name === sourceName);
      if (match) setFilterSourceId(match.id);
      searchParams.delete("source");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, incomeSources, setSearchParams]);

  const filteredIncomes = filterSourceId
    ? incomes.filter((i) => i.income_source_id === filterSourceId)
    : incomes;
  const filteredTotal = filterSourceId
    ? filteredIncomes.reduce((sum, i) => sum + i.amount, 0)
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
      <Header title="Income" />
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">
                {loading ? <Loader module="finance" size="inline" /> : `${filteredIncomes.length} income entr${filteredIncomes.length !== 1 ? "ies" : "y"}`}
              </h3>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="sm:hidden p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="hidden sm:flex px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors items-center gap-1 whitespace-nowrap"
              >
                <Plus size={16} /> Add Income
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-gray-500">
              <Filter size={14} className="hidden sm:block" />
              <select
                value={filterSourceId ?? ""}
                onChange={(e) => setFilterSourceId(e.target.value ? Number(e.target.value) : null)}
                className="min-w-0 flex-1 sm:flex-none px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sources</option>
                {incomeSources.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <IncomeList
            incomes={filteredIncomes}
            total={filteredTotal}
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
          accounts={accounts}
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
        message={`Delete this ${formatPKR(deleting?.amount ?? 0)} income entry?`}
      />
    </>
  );
}
