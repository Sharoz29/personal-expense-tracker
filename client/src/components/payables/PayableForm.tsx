import { useState } from "react";
import type { Payable, PayableType } from "../../types";

interface PayableFormProps {
  payable?: Payable | null;
  payableTypes: PayableType[];
  onSubmit: (data: {
    description: string;
    amount: number;
    from_person: string;
    due_date?: string;
    payable_type_id?: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function PayableForm({ payable, payableTypes, onSubmit, onCancel }: PayableFormProps) {
  const [description, setDescription] = useState(payable?.description ?? "");
  const [amount, setAmount] = useState(payable?.amount?.toString() ?? "");
  const [fromPerson, setFromPerson] = useState(payable?.from_person ?? "");
  const [dueDate, setDueDate] = useState(payable?.due_date ?? "");
  const [payableTypeId, setPayableTypeId] = useState<number | "">(payable?.payable_type_id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { setError("Description is required"); return; }
    if (!amount || Number(amount) <= 0) { setError("Amount must be positive"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        description: description.trim(),
        amount: Number(amount),
        from_person: fromPerson.trim(),
        ...(dueDate ? { due_date: dueDate } : {}),
        ...(payableTypeId ? { payable_type_id: Number(payableTypeId) } : {}),
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is owed to you..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
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
        <label className="block text-sm font-medium text-gray-700 mb-1">From (person/company)</label>
        <input
          type="text"
          value={fromPerson}
          onChange={(e) => setFromPerson(e.target.value)}
          placeholder="Who owes you..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type (optional)</label>
        <select
          value={payableTypeId}
          onChange={(e) => setPayableTypeId(e.target.value ? Number(e.target.value) : "")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No type</option>
          {payableTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
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
          {submitting ? "Saving..." : payable ? "Update" : "Add Payable"}
        </button>
      </div>
    </form>
  );
}
