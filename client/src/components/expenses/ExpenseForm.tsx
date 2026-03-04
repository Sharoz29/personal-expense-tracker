import { useState, useEffect } from "react";
import type { Expense, ExpenseType, Account, ExpenseBreakdown } from "../../types";
import { useMonthYear } from "../../context/MonthYearContext";
import { formatPKR, todayISO } from "../../utils/format";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface ExpenseFormProps {
  expenseTypes: ExpenseType[];
  accounts: Account[];
  expense?: Expense | null;
  onSubmit: (data: {
    expense_type_id: number;
    account_id: number;
    amount: number;
    description: string;
    date: string;
    month: number;
    year: number;
    breakdowns?: ExpenseBreakdown[] | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ExpenseForm({ expenseTypes, accounts, expense, onSubmit, onCancel }: ExpenseFormProps) {
  const { month, year } = useMonthYear();
  const [expenseTypeId, setExpenseTypeId] = useState(expense?.expense_type_id ?? (expenseTypes[0]?.id ?? 0));
  const [accountId, setAccountId] = useState(expense?.account_id ?? (accounts[0]?.id ?? 0));
  const [amount, setAmount] = useState(expense?.amount?.toString() ?? "");
  const [description, setDescription] = useState(expense?.description ?? "");
  const [date, setDate] = useState(expense?.date ?? todayISO());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasExistingBreakdowns = expense?.breakdowns && expense.breakdowns.length > 0;
  const [showBreakdown, setShowBreakdown] = useState(!!hasExistingBreakdowns);
  const [breakdowns, setBreakdowns] = useState<ExpenseBreakdown[]>(
    expense?.breakdowns ?? []
  );

  const breakdownTotal = breakdowns.reduce((sum, b) => sum + (b.amount || 0), 0);

  useEffect(() => {
    if (showBreakdown && breakdowns.length > 0) {
      setAmount(breakdownTotal.toString());
    }
  }, [breakdownTotal, showBreakdown, breakdowns.length]);

  useEffect(() => {
    if (!expense && accounts.length > 0 && !accounts.some(a => a.id === accountId)) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, expense, accountId]);

  useEffect(() => {
    if (!expense && expenseTypes.length > 0 && !expenseTypes.some(t => t.id === expenseTypeId)) {
      setExpenseTypeId(expenseTypes[0].id);
    }
  }, [expenseTypes, expense, expenseTypeId]);

  useEffect(() => {
    if (!expense) {
      setDate(todayISO());
    }
  }, [month, year, expense]);

  const addBreakdownRow = () => {
    setBreakdowns([...breakdowns, { label: "", amount: 0 }]);
  };

  const updateBreakdown = (index: number, field: keyof ExpenseBreakdown, value: string | number) => {
    setBreakdowns(prev => prev.map((b, i) =>
      i === index ? { ...b, [field]: value } : b
    ));
  };

  const removeBreakdown = (index: number) => {
    setBreakdowns(prev => prev.filter((_, i) => i !== index));
  };

  const toggleBreakdown = () => {
    if (!showBreakdown) {
      if (breakdowns.length === 0) {
        setBreakdowns([{ label: "", amount: 0 }, { label: "", amount: 0 }]);
      }
      setShowBreakdown(true);
    } else {
      setShowBreakdown(false);
      setBreakdowns([]);
      setAmount("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 0) { setError("Amount must be >= 0"); return; }

    if (showBreakdown) {
      const validBreakdowns = breakdowns.filter(b => b.label.trim());
      if (validBreakdowns.length === 0) {
        setError("Add at least one breakdown item with a label");
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      const d = new Date(date);
      const validBreakdowns = showBreakdown
        ? breakdowns.filter(b => b.label.trim()).map(b => ({ label: b.label.trim(), amount: Number(b.amount) || 0 }))
        : null;
      await onSubmit({
        expense_type_id: expenseTypeId,
        account_id: accountId,
        amount: Number(amount),
        description,
        date,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        breakdowns: validBreakdowns,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm p-2 bg-red-50 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={expenseTypeId}
          onChange={(e) => setExpenseTypeId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {expenseTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <button
            type="button"
            onClick={toggleBreakdown}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            {showBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showBreakdown ? "Remove breakdown" : "Add breakdown"}
          </button>
        </div>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          readOnly={showBreakdown && breakdowns.length > 0}
        />
        {showBreakdown && breakdowns.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">Auto-calculated from breakdown items</p>
        )}
      </div>

      {showBreakdown && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Breakdown</span>
            <button
              type="button"
              onClick={addBreakdownRow}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <Plus size={12} /> Add item
            </button>
          </div>

          {breakdowns.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={b.label}
                onChange={(e) => updateBreakdown(i, "label", e.target.value)}
                placeholder="e.g. Base, Tax, FED..."
                className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={b.amount || ""}
                onChange={(e) => updateBreakdown(i, "amount", Number(e.target.value) || 0)}
                placeholder="0.00"
                className="w-28 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-right"
              />
              <button
                type="button"
                onClick={() => removeBreakdown(i)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {breakdowns.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-600">Total</span>
              <span className="text-sm font-semibold text-gray-900">{formatPKR(breakdownTotal)}</span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Saving..." : expense ? "Update" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
