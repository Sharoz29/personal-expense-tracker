import { useState } from "react";
import type { SavingsCertificate } from "../../types";
import { todayISO } from "../../utils/format";

const CERTIFICATE_TYPES = [
  "Defence Savings Certificate (DSC)",
  "Regular Income Certificate (RIC)",
  "Special Savings Certificate (SSC)",
  "Behbood Savings Certificate",
  "Savings Account",
  "Short Term Savings Certificate",
];

interface SavingsCertificateFormProps {
  certificate?: SavingsCertificate | null;
  onSubmit: (data: {
    certificate_type: string;
    principal_amount: number;
    profit_rate: number;
    purchase_date: string;
    maturity_date: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function SavingsCertificateForm({ certificate, onSubmit, onCancel }: SavingsCertificateFormProps) {
  const [certificateType, setCertificateType] = useState(certificate?.certificate_type ?? CERTIFICATE_TYPES[0]);
  const [principalAmount, setPrincipalAmount] = useState(certificate?.principal_amount?.toString() ?? "");
  const [profitRate, setProfitRate] = useState(certificate?.profit_rate?.toString() ?? "");
  const [purchaseDate, setPurchaseDate] = useState(certificate?.purchase_date ?? todayISO());
  const [maturityDate, setMaturityDate] = useState(certificate?.maturity_date ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principalAmount || Number(principalAmount) <= 0) { setError("Principal amount must be positive"); return; }
    if (!profitRate || Number(profitRate) < 0) { setError("Profit rate must be >= 0"); return; }
    if (!maturityDate) { setError("Maturity date is required"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        certificate_type: certificateType,
        principal_amount: Number(principalAmount),
        profit_rate: Number(profitRate),
        purchase_date: purchaseDate,
        maturity_date: maturityDate,
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
        <select
          value={certificateType}
          onChange={(e) => setCertificateType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CERTIFICATE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={principalAmount}
          onChange={(e) => setPrincipalAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profit Rate (%)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={profitRate}
          onChange={(e) => setProfitRate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Date</label>
        <input
          type="date"
          value={maturityDate}
          onChange={(e) => setMaturityDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
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
          {submitting ? "Saving..." : certificate ? "Update" : "Add Certificate"}
        </button>
      </div>
    </form>
  );
}
