import type { Account } from "../../types";
import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR } from "../../utils/format";

interface AccountListProps {
  accounts: Account[];
  installmentTotals: Record<number, number>;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export default function AccountList({ accounts, installmentTotals, onEdit, onDelete }: AccountListProps) {
  if (accounts.length === 0) {
    return <EmptyState message="No accounts yet. Click 'Add Account' to get started." />;
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => {
        const installmentAmount = account.track_installments ? (installmentTotals[account.id] ?? 0) : 0;
        const availableBalance = account.balance - installmentAmount;
        const showBreakdown = !!account.track_installments && installmentAmount > 0;

        return (
          <div
            key={account.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{account.name}</h4>
                {account.account_number && (
                  <p className="text-xs text-gray-500 mt-0.5">{account.account_number}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(account)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(account)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className={`text-lg font-bold ${account.balance >= 0 ? "text-green-700" : "text-red-700"}`}>
              {formatPKR(account.balance)}
            </p>
            {showBreakdown && (
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Installments</span>
                  <span className="text-amber-600 font-medium">{formatPKR(installmentAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Available</span>
                  <span className={`font-medium ${availableBalance >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {formatPKR(availableBalance)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
