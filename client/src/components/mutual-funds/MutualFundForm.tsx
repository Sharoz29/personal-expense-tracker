import { useState } from "react";
import type { MutualFund, MutualFundCompany } from "../../types";
import type { CreateMutualFundPayload } from "../../api/mutual-funds.api";

const CATEGORIES = [
  "Equity", "Income", "Money Market", "Balanced",
  "Fund of Funds", "Capital Protected", "Index Tracker", "Islamic",
];

const RISK_LEVELS = ["High", "Medium", "Low"];

interface MutualFundFormProps {
  fund?: MutualFund | null;
  companies: MutualFundCompany[];
  onSubmit: (data: CreateMutualFundPayload) => Promise<void>;
  onCancel: () => void;
}

type LoadType = "percentage" | "fixed";

export default function MutualFundForm({ fund, companies, onSubmit, onCancel }: MutualFundFormProps) {
  const [name, setName] = useState(fund?.name ?? "");
  const [companyId, setCompanyId] = useState(fund?.company_id ?? (companies[0]?.id ?? 0));
  const [category, setCategory] = useState(fund?.category ?? CATEGORIES[0]);
  const [riskLevel, setRiskLevel] = useState(fund?.risk_level ?? "Medium");
  const [felValue, setFelValue] = useState(fund?.front_end_load_value?.toString() ?? "0");
  const [felType, setFelType] = useState<LoadType>(fund?.front_end_load_type ?? "percentage");
  const [belValue, setBelValue] = useState(fund?.back_end_load_value?.toString() ?? "0");
  const [belType, setBelType] = useState<LoadType>(fund?.back_end_load_type ?? "percentage");
  const [otherValue, setOtherValue] = useState(fund?.other_fees_value?.toString() ?? "0");
  const [otherType, setOtherType] = useState<LoadType>(fund?.other_fees_type ?? "percentage");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Fund name is required"); return; }
    if (!companyId) { setError("Please select a company"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        company_id: companyId,
        category,
        risk_level: riskLevel,
        front_end_load_value: Number(felValue) || 0,
        front_end_load_type: felType,
        back_end_load_value: Number(belValue) || 0,
        back_end_load_type: belType,
        other_fees_value: Number(otherValue) || 0,
        other_fees_type: otherType,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBtnClass = (active: boolean) =>
    `px-2 py-1 text-xs font-medium transition-colors ${
      active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm p-2 bg-red-50 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. AKD Index Tracker Fund"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company (AMC)</label>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {companies.length === 0 && <option value={0}>No companies — add one first</option>}
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {RISK_LEVELS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Fee Structure</p>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Front-End Load</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={felValue}
              onChange={(e) => setFelValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button type="button" className={toggleBtnClass(felType === "percentage")} onClick={() => setFelType("percentage")}>%</button>
              <button type="button" className={toggleBtnClass(felType === "fixed")} onClick={() => setFelType("fixed")}>PKR</button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Back-End Load</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={belValue}
              onChange={(e) => setBelValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button type="button" className={toggleBtnClass(belType === "percentage")} onClick={() => setBelType("percentage")}>%</button>
              <button type="button" className={toggleBtnClass(belType === "fixed")} onClick={() => setBelType("fixed")}>PKR</button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Other Fees</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button type="button" className={toggleBtnClass(otherType === "percentage")} onClick={() => setOtherType("percentage")}>%</button>
              <button type="button" className={toggleBtnClass(otherType === "fixed")} onClick={() => setOtherType("fixed")}>PKR</button>
            </div>
          </div>
        </div>
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
          {submitting ? "Saving..." : fund ? "Update Fund" : "Add Fund"}
        </button>
      </div>
    </form>
  );
}
