import type { Expense } from "../../types";
import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";

interface CarPaymentListProps {
  payments: Expense[];
  total: number;
  onEdit: (payment: Expense) => void;
  onDelete: (payment: Expense) => void;
}

export default function CarPaymentList({ payments, total, onEdit, onDelete }: CarPaymentListProps) {
  if (payments.length === 0) {
    return <EmptyState message="No car payments recorded yet. Click 'Add Payment' to get started." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700">{payment.date}</td>
              <td className="py-3 px-4 text-gray-600">{payment.description || "-"}</td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                PKR {payment.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(payment)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(payment)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
            <td colSpan={2} className="py-3 px-4 font-semibold text-gray-700">Total Paid</td>
            <td className="py-3 px-4 text-right font-bold text-gray-900">PKR {total.toFixed(2)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
