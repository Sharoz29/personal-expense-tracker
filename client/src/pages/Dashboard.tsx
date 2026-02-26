import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { useMonthYear } from "../context/MonthYearContext";
import { dashboardApi } from "../api/dashboard.api";
import SummaryCards from "../components/dashboard/SummaryCards";
import ExpenseBreakdownChart from "../components/dashboard/ExpenseBreakdownChart";
import IncomeBreakdownChart from "../components/dashboard/IncomeBreakdownChart";
import type { DashboardSummary } from "../types";

export default function Dashboard() {
  const { month, year } = useMonthYear();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dashboardApi
      .getSummary(month, year)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [month, year]);

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : summary ? (
          <>
            <SummaryCards
              totalIncome={summary.totalIncome}
              totalExpenses={summary.totalExpenses}
              savings={summary.savings}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Type</h3>
                <ExpenseBreakdownChart data={summary.expensesByType} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Source</h3>
                <IncomeBreakdownChart data={summary.incomeBySource} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No data available for this month. Start by adding income and expenses.
          </div>
        )}
      </div>
    </>
  );
}
