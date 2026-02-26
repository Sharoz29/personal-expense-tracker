import type { Income } from "../../types";
import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";

interface IncomeListProps {
  incomes: Income[];
  total: number;
  onEdit: (income: Income) => void;
  onDelete: (income: Income) => void;
}

export default function IncomeList({ incomes, total, onEdit, onDelete }: IncomeListProps) {
  if (incomes.length === 0) {
    return <EmptyState message="No income for this month. Click 'Add Income' to get started." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700">{income.date}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                  {income.income_source_name}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">{income.description || "-"}</td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                ${income.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(income)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(income)}
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
            <td colSpan={3} className="py-3 px-4 font-semibold text-gray-700">Total</td>
            <td className="py-3 px-4 text-right font-bold text-gray-900">${total.toFixed(2)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
