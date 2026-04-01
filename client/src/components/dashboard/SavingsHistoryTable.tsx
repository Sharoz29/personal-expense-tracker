import { formatPKR } from "../../utils/format";
import type { MonthlySavingsRecord } from "../../types";

interface SavingsHistoryTableProps {
  data: MonthlySavingsRecord[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function SavingsHistoryTable({ data }: SavingsHistoryTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No savings data available
      </div>
    );
  }

  const reversed = [...data].reverse();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3">Month</th>
            <th className="px-4 py-3 text-right">Income</th>
            <th className="px-4 py-3 text-right">Expenses</th>
            <th className="px-4 py-3 text-right">Net Savings</th>
            <th className="px-4 py-3 text-right">Cumulative</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reversed.map((row) => (
            <tr key={`${row.year}-${row.month}`} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">
                {MONTH_NAMES[row.month - 1]} {row.year}
              </td>
              <td className="px-4 py-3 text-right text-green-600">
                {formatPKR(row.monthlyIncome)}
              </td>
              <td className="px-4 py-3 text-right text-red-600">
                {formatPKR(row.monthlyExpenses)}
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  row.monthlySavings >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatPKR(row.monthlySavings)}
              </td>
              <td
                className={`px-4 py-3 text-right font-bold ${
                  row.cumulativeSavings >= 0 ? "text-blue-700" : "text-red-700"
                }`}
              >
                {formatPKR(row.cumulativeSavings)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
