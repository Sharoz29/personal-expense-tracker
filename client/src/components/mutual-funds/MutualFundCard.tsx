import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2, Plus } from "lucide-react";
import type { MutualFund, MutualFundTransaction } from "../../types";
import { formatPKR } from "../../utils/format";

interface MutualFundCardProps {
  fund: MutualFund;
  transactions: MutualFundTransaction[];
  onEditFund: (fund: MutualFund) => void;
  onDeleteFund: (fund: MutualFund) => void;
  onAddTransaction: (fund: MutualFund) => void;
  onEditTransaction: (tx: MutualFundTransaction) => void;
  onDeleteTransaction: (tx: MutualFundTransaction) => void;
}

const riskColor: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-green-50 text-green-700",
};

function formatFee(value: number, type: "percentage" | "fixed") {
  return type === "percentage" ? `${value}%` : formatPKR(value);
}

export default function MutualFundCard({
  fund, transactions, onEditFund, onDeleteFund, onAddTransaction, onEditTransaction, onDeleteTransaction,
}: MutualFundCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalInvested = transactions.reduce((s, t) => s + t.amount, 0);
  const totalNet = transactions.reduce((s, t) => s + t.net_invested_amount, 0);
  const totalUnits = transactions.reduce((s, t) => s + t.units_allocated, 0);
  const totalFees = transactions.reduce(
    (s, t) => s + t.front_end_load_amount + t.back_end_load_amount + t.other_fees_amount, 0
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-800">{fund.name}</h4>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{fund.category}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${riskColor[fund.risk_level] ?? "bg-gray-50 text-gray-700"}`}>
                {fund.risk_level}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>FEL: {formatFee(fund.front_end_load_value, fund.front_end_load_type)}</span>
              <span>BEL: {formatFee(fund.back_end_load_value, fund.back_end_load_type)}</span>
              {fund.other_fees_value > 0 && <span>Other: {formatFee(fund.other_fees_value, fund.other_fees_type)}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <div className="text-right mr-2">
              <p className="text-sm font-bold text-gray-800">{formatPKR(totalInvested)}</p>
              <p className="text-xs text-gray-500">{totalUnits.toFixed(4)} units</p>
            </div>
            {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-200">
          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
            <div className="flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onEditFund(fund); }}
                className="px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
              >
                <Pencil size={12} /> Edit Fund
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteFund(fund); }}
                className="px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onAddTransaction(fund); }}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus size={12} /> Add Investment
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-50 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Total Invested</p>
              <p className="text-sm font-semibold text-gray-800">{formatPKR(totalInvested)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Net Invested</p>
              <p className="text-sm font-semibold text-blue-700">{formatPKR(totalNet)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Fees</p>
              <p className="text-sm font-semibold text-red-500">{formatPKR(totalFees)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Units</p>
              <p className="text-sm font-semibold text-gray-800">{totalUnits.toFixed(4)}</p>
            </div>
          </div>

          {/* Transactions table */}
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">Date</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Amount</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">NAV</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Units</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Fees</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500">Portal Date</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-700">
                        {tx.investment_date}
                        {!!tx.is_online && <span className="ml-1 px-1 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-medium">Online</span>}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-800 font-medium">{formatPKR(tx.amount)}</td>
                      <td className="py-2 px-3 text-right text-gray-600">{tx.nav_at_purchase}</td>
                      <td className="py-2 px-3 text-right text-gray-600">{tx.units_allocated.toFixed(4)}</td>
                      <td className="py-2 px-3 text-right text-red-500">
                        {formatPKR(tx.front_end_load_amount + tx.back_end_load_amount + tx.other_fees_amount)}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{tx.portal_reflection_date || "—"}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => onDeleteTransaction(tx)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 p-4 text-center">No investments yet. Click "Add Investment" to start.</p>
          )}
        </div>
      )}
    </div>
  );
}
