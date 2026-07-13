import { useState, useEffect } from "react";
import type { MutualFund, MutualFundTransaction, Account } from "../../types";
import type { CreateMutualFundTransactionPayload } from "../../api/mutual-fund-transactions.api";
import { formatPKR } from "../../utils/format";

interface MutualFundTransactionFormProps {
  transaction?: MutualFundTransaction | null;
  fund?: MutualFund | null;
  funds: MutualFund[];
  accounts: Account[];
  onSubmit: (data: CreateMutualFundTransactionPayload) => Promise<void>;
  onCancel: () => void;
}

export default function MutualFundTransactionForm({
  transaction, fund, funds, accounts, onSubmit, onCancel,
}: MutualFundTransactionFormProps) {
  const [fundId, setFundId] = useState(transaction?.fund_id ?? fund?.id ?? (funds[0]?.id ?? 0));
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? "");
  const [nav, setNav] = useState(transaction?.nav_at_purchase?.toString() ?? "");
  const [units, setUnits] = useState(transaction?.units_allocated?.toString() ?? "");
  const [investmentDate, setInvestmentDate] = useState(
    transaction?.investment_date ?? new Date().toISOString().split("T")[0]
  );
  const [portalDate, setPortalDate] = useState(transaction?.portal_reflection_date ?? "");
  const [accountId, setAccountId] = useState<number>(0);
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!transaction;
  const selectedFund = funds.find((f) => f.id === fundId);

  // Fee preview based on selected fund's structure
  const calcFee = (value: number, type: "percentage" | "fixed", amt: number) =>
    type === "percentage" ? amt * (value / 100) : value;

  const amtNum = Number(amount) || 0;
  const felAmount = selectedFund ? calcFee(selectedFund.front_end_load_value, selectedFund.front_end_load_type, amtNum) : 0;
  const belAmount = selectedFund ? calcFee(selectedFund.back_end_load_value, selectedFund.back_end_load_type, amtNum) : 0;
  const otherAmount = selectedFund ? calcFee(selectedFund.other_fees_value, selectedFund.other_fees_type, amtNum) : 0;
  const netAmount = amtNum - felAmount - belAmount - otherAmount;

  // Auto-calculate units from (amount - front-end load) / NAV
  useEffect(() => {
    const amt = Number(amount);
    const navVal = Number(nav);
    if (amt > 0 && navVal > 0) {
      const fel = selectedFund
        ? calcFee(selectedFund.front_end_load_value, selectedFund.front_end_load_type, amt)
        : 0;
      const afterFel = amt - fel;
      setUnits((afterFel / navVal).toFixed(4));
    }
  }, [amount, nav, selectedFund]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundId) { setError("Please select a fund"); return; }
    if (!amount || Number(amount) <= 0) { setError("Amount must be positive"); return; }
    if (!nav || Number(nav) <= 0) { setError("NAV must be positive"); return; }
    if (!units || Number(units) <= 0) { setError("Units must be positive"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        fund_id: fundId,
        amount: Number(amount),
        nav_at_purchase: Number(nav),
        units_allocated: Number(units),
        investment_date: investmentDate,
        ...(portalDate ? { portal_reflection_date: portalDate } : {}),
        ...(accountId && !isEditing ? { account_id: accountId } : {}),
        description: description.trim(),
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

      {!fund && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fund</label>
          <select
            value={fundId}
            onChange={(e) => setFundId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {funds.map((f) => (
              <option key={f.id} value={f.id}>{f.company_name} — {f.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Gross amount invested"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NAV at Purchase</label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={nav}
            onChange={(e) => setNav(e.target.value)}
            placeholder="e.g. 12.3456"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Units Allocated</label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="Auto-calculated"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Date</label>
          <input
            type="date"
            value={investmentDate}
            onChange={(e) => setInvestmentDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Portal Reflection Date</label>
          <input
            type="date"
            value={portalDate}
            onChange={(e) => setPortalDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deduct from Account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>None (don't deduct)</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}

      {amtNum > 0 && selectedFund && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
          <p className="font-medium text-gray-700 mb-2">Fee Summary</p>
          {felAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Front-End Load ({selectedFund.front_end_load_type === "percentage" ? `${selectedFund.front_end_load_value}%` : "fixed"})</span>
              <span className="text-red-500">-{formatPKR(felAmount)}</span>
            </div>
          )}
          {belAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Back-End Load ({selectedFund.back_end_load_type === "percentage" ? `${selectedFund.back_end_load_value}%` : "fixed"})</span>
              <span className="text-red-500">-{formatPKR(belAmount)}</span>
            </div>
          )}
          {otherAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Other Fees ({selectedFund.other_fees_type === "percentage" ? `${selectedFund.other_fees_value}%` : "fixed"})</span>
              <span className="text-red-500">-{formatPKR(otherAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-gray-800 pt-1 border-t border-gray-200">
            <span>Net Invested</span>
            <span className="text-green-700">{formatPKR(netAmount)}</span>
          </div>
        </div>
      )}

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
          {submitting ? "Saving..." : transaction ? "Update" : "Add Investment"}
        </button>
      </div>
    </form>
  );
}
