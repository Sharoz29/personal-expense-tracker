import type { Savings } from "../../types";
import { Pencil, Calculator } from "lucide-react";
import EmptyState from "../common/EmptyState";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface SavingsListProps {
  savings: Savings[];
  onEdit: (s: Savings) => void;
  onRecalculate: (month: number, year: number) => void;
}

export default function SavingsList({ savings, onEdit, onRecalculate }: SavingsListProps) {
  if (savings.length === 0) {
    return <EmptyState message="No savings records yet. Add income and expenses, then calculate savings." />;
  }

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Month</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Notes</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {savings.map((s) => (
            <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700 font-medium">
                {MONTHS[s.month - 1]} {s.year}
              </td>
              <td className={`py-3 px-4 text-right font-medium ${s.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${s.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-gray-600">{s.notes || "-"}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onRecalculate(s.month, s.year)}
                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Recalculate"
                  >
                    <Calculator size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(s)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td className="py-3 px-4 font-semibold text-gray-700">Total Savings</td>
            <td className={`py-3 px-4 text-right font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalSavings.toFixed(2)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
