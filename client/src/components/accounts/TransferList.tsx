import type { AccountTransfer } from "../../types";
import EmptyState from "../common/EmptyState";
import { formatPKR } from "../../utils/format";

interface TransferListProps {
  transfers: AccountTransfer[];
}

export default function TransferList({ transfers }: TransferListProps) {
  if (transfers.length === 0) {
    return <EmptyState message="No transfers yet. Click 'New Transfer' to move funds between accounts." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">From</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">To</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700">{t.date}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                  {t.from_account_name}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                  {t.to_account_name}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">{t.description || "-"}</td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {formatPKR(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
