import type { Payable } from "../../types";
import { Pencil, Trash2, CheckCircle } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR, formatDate } from "../../utils/format";

interface PendingPayableListProps {
  payables: Payable[];
  total: number;
  onEdit: (payable: Payable) => void;
  onDelete: (payable: Payable) => void;
  onMarkPaid: (payable: Payable) => void;
}

export function PendingPayableList({ payables, total, onEdit, onDelete, onMarkPaid }: PendingPayableListProps) {
  if (payables.length === 0) {
    return <EmptyState message="No pending payables." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-150">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">From</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Type</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Description</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Due Date</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Amount</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payables.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-3 md:px-4 text-gray-700">{p.from_person || "-"}</td>
              <td className="py-3 px-3 md:px-4 text-gray-600">{p.payable_type_name || "-"}</td>
              <td className="py-3 px-3 md:px-4 text-gray-600">{p.description}</td>
              <td className="py-3 px-3 md:px-4 text-gray-600">{p.due_date ? formatDate(p.due_date) : "-"}</td>
              <td className="py-3 px-3 md:px-4 text-right font-medium text-gray-900">{formatPKR(p.amount)}</td>
              <td className="py-3 px-3 md:px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onMarkPaid(p)}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Mark as Paid"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td colSpan={4} className="py-3 px-3 md:px-4 font-semibold text-gray-700">Total Pending</td>
            <td className="py-3 px-3 md:px-4 text-right font-bold text-yellow-600">{formatPKR(total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

interface PaidPayableListProps {
  payables: Payable[];
  total: number;
}

export function PaidPayableList({ payables, total }: PaidPayableListProps) {
  if (payables.length === 0) {
    return <EmptyState message="No paid payables yet." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-150">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">From</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Type</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Description</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Account</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Paid Date</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payables.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-3 md:px-4 text-gray-700">{p.from_person || "-"}</td>
              <td className="py-3 px-3 md:px-4 text-gray-600">{p.payable_type_name || "-"}</td>
              <td className="py-3 px-3 md:px-4 text-gray-600">{p.description}</td>
              <td className="py-3 px-3 md:px-4">
                {p.account_name ? (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{p.account_name}</span>
                ) : "-"}
              </td>
              <td className="py-3 px-3 md:px-4 text-gray-600">{p.paid_date ? formatDate(p.paid_date) : "-"}</td>
              <td className="py-3 px-3 md:px-4 text-right font-medium text-gray-900">{formatPKR(p.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td colSpan={5} className="py-3 px-3 md:px-4 font-semibold text-gray-700">Total Paid</td>
            <td className="py-3 px-3 md:px-4 text-right font-bold text-green-600">{formatPKR(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
