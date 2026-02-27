import { useState } from "react";
import type { Expense } from "../../types";

interface CarPaymentFormProps {
  payment?: Expense | null;
  onSubmit: (data: {
    amount: number;
    description: string;
    date: string;
    month: number;
    year: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function CarPaymentForm({ payment, onSubmit, onCancel }: CarPaymentFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState(payment?.amount?.toString() ?? "");
  const [description, setDescription] = useState(payment?.description ?? "");
  const [date, setDate] = useState(payment?.date ?? today);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 0) { setError("Amount must be >= 0"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const d = new Date(date);
      await onSubmit({
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
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
          {submitting ? "Saving..." : payment ? "Update" : "Add Payment"}
        </button>
      </div>
    </form>
  );
}
