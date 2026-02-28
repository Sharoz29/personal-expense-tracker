import { useState, useEffect } from "react";
import type { Expense, ExpenseType, Account } from "../../types";
import { useMonthYear } from "../../context/MonthYearContext";

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
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ExpenseForm({ expenseTypes, accounts, expense, onSubmit, onCancel }: ExpenseFormProps) {
  const { month, year } = useMonthYear();
  const [expenseTypeId, setExpenseTypeId] = useState(expense?.expense_type_id ?? (expenseTypes[0]?.id ?? 0));
  const [accountId, setAccountId] = useState(expense?.account_id ?? (accounts[0]?.id ?? 0));
  const [amount, setAmount] = useState(expense?.amount?.toString() ?? "");
  const [description, setDescription] = useState(expense?.description ?? "");
  const [date, setDate] = useState(expense?.date ?? `${year}-${String(month).padStart(2, "0")}-01`);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setDate(`${year}-${String(month).padStart(2, "0")}-01`);
    }
  }, [month, year, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 0) { setError("Amount must be >= 0"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const d = new Date(date);
      await onSubmit({
        expense_type_id: expenseTypeId,
        account_id: accountId,
        amount: Number(amount),
        description,
        date,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

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
