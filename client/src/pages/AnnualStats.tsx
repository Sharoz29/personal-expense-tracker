import { useState, useEffect, useRef } from "react";
import { dashboardApi } from "../api/dashboard.api";
import SummaryCards from "../components/dashboard/SummaryCards";
import ExpenseBreakdownChart from "../components/dashboard/ExpenseBreakdownChart";
import IncomeBreakdownChart from "../components/dashboard/IncomeBreakdownChart";
import MonthlyTrendChart from "../components/annual-stats/MonthlyTrendChart";
import CategoryDrilldownChart from "../components/annual-stats/CategoryDrilldownChart";
import type { AnnualSummary } from "../types";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

interface Drilldown {
  category: string;
  type: "expense" | "income";
  data: { month: number; total: number }[];
}

export default function AnnualStats() {
  const [year, setYear] = useState(currentYear);
  const [summary, setSummary] = useState<AnnualSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [drilldown, setDrilldown] = useState<Drilldown | null>(null);
  const [drilldownLoading, setDrilldownLoading] = useState(false);
  const drilldownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setDrilldown(null);
    dashboardApi
      .getAnnualSummary(year)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [year]);

  const handleCategoryClick = async (category: string, type: "expense" | "income") => {
    setDrilldownLoading(true);
    try {
      const data = await dashboardApi.getCategoryBreakdown(year, category, type);
      setDrilldown({ category, type, data });
      setTimeout(() => drilldownRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setDrilldown(null);
    } finally {
      setDrilldownLoading(false);
    }
  };

  return (
    <>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Annual Statistics</h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </header>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : summary ? (
          <>
            <SummaryCards
              totalIncome={summary.totalIncome}
              totalExpenses={summary.totalExpenses}
              savings={summary.netSavings}
              pendingPayablesTotal={0}
            />
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Income vs Expenses</h3>
              <MonthlyTrendChart data={summary.monthlyBreakdown} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Type</h3>
                <ExpenseBreakdownChart
                  data={summary.expensesByType}
                  onItemClick={(name) => handleCategoryClick(name, "expense")}
                />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Source</h3>
                <IncomeBreakdownChart
                  data={summary.incomesBySource}
                  onItemClick={(name) => handleCategoryClick(name, "income")}
                />
              </div>
            </div>
            <div ref={drilldownRef}>
              {drilldownLoading && (
                <div className="text-gray-500 py-4">Loading breakdown...</div>
              )}
              {drilldown && !drilldownLoading && (
                <CategoryDrilldownChart
                  data={drilldown.data}
                  categoryName={drilldown.category}
                  type={drilldown.type}
                  onClose={() => setDrilldown(null)}
                />
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No data available for {year}.
          </div>
        )}
      </div>
    </>
  );
}
