import { useState } from "react";
import type { Expense } from "../../types";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR, formatDate } from "../../utils/format";

interface ExpenseListProps {
  expenses: Expense[];
  total: number;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, total, onEdit, onDelete }: ExpenseListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (expenses.length === 0) {
    return <EmptyState message="No expenses for this month. Click 'Add Expense' to get started." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-150">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Type</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Account</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Description</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Amount</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const hasBreakdowns = expense.breakdowns && expense.breakdowns.length > 0;
            const isExpanded = expandedId === expense.id;

            return (
              <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                <td className="py-3 px-3 md:px-4 text-gray-700">{formatDate(expense.date)}</td>
                <td className="py-3 px-3 md:px-4">
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                    {expense.expense_type_name}
                  </span>
                </td>
                <td className="py-3 px-3 md:px-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {expense.account_name}
                  </span>
                </td>
                <td className="py-3 px-3 md:px-4 text-gray-600">
                  {expense.description || (hasBreakdowns
                    ? expense.breakdowns!.map(b => b.label).join(", ")
                    : "-"
                  )}
                </td>
                <td className="py-3 px-3 md:px-4 text-right font-medium text-gray-900">
                  <div className="flex items-center justify-end gap-1">
                    {hasBreakdowns && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                        className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View breakdown"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                    <span>{formatPKR(expense.amount)}</span>
                  </div>
                  {hasBreakdowns && isExpanded && (
                    <div className="mt-2 text-left bg-gray-50 rounded-lg p-2.5 border border-gray-200 space-y-1">
                      {expense.breakdowns!.map((b, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-gray-500">{b.label}</span>
                          <span className="text-gray-700 font-medium">{formatPKR(b.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                        <span className="text-gray-600 font-medium">Total</span>
                        <span className="text-gray-900 font-semibold">{formatPKR(expense.amount)}</span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 md:px-4 text-right align-top">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td colSpan={4} className="py-3 px-4 font-semibold text-gray-700">Total</td>
            <td className="py-3 px-4 text-right font-bold text-gray-900">{formatPKR(total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
