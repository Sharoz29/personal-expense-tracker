import { ExpenseRepository } from "../repositories/expense.repository.js";
import { IncomeRepository } from "../repositories/income.repository.js";
import { SavingsRepository } from "../repositories/savings.repository.js";
import type { DashboardSummary, MonthlySavingsRecord, AnnualSummary } from "../types/index.js";

const expenseRepo = new ExpenseRepository();
const incomeRepo = new IncomeRepository();
const savingsRepo = new SavingsRepository();

export class DashboardService {
  async getSummary(month: number, year: number): Promise<DashboardSummary> {
    const [totalExpenses, totalIncome, expensesByType, incomeBySource, savingsRecord] =
      await Promise.all([
        expenseRepo.sumByMonthYear(month, year),
        incomeRepo.sumByMonthYear(month, year),
        expenseRepo.sumByTypeForMonth(month, year),
        incomeRepo.sumBySourceForMonth(month, year),
        savingsRepo.findByMonthYear(month, year),
      ]);

    return {
      totalIncome,
      totalExpenses,
      savings: savingsRecord?.amount ?? totalIncome - totalExpenses,
      expensesByType,
      incomeBySource,
    };
  }

  async getSavingsHistory(): Promise<MonthlySavingsRecord[]> {
    const [incomeByMonth, expenseByMonth] = await Promise.all([
      incomeRepo.sumAllMonths(),
      expenseRepo.sumAllMonths(),
    ]);

    // Build income map — only months with income will appear as rows
    const incomeKeys = new Set<string>();
    const incomeMap = new Map<string, number>();
    for (const row of incomeByMonth) {
      const key = `${row.year}-${row.month}`;
      incomeKeys.add(key);
      incomeMap.set(key, Number(row.total));
    }

    const expenseMap = new Map<string, number>();
    for (const row of expenseByMonth) {
      const key = `${row.year}-${row.month}`;
      expenseMap.set(key, Number(row.total));
    }

    // Only consider months that have income — completely ignore expense-only months
    const sortedKeys = Array.from(incomeKeys).sort((a, b) => {
      const [ay, am] = a.split("-").map(Number);
      const [by, bm] = b.split("-").map(Number);
      return ay !== by ? ay - by : am - bm;
    });

    let cumulative = 0;
    const result: MonthlySavingsRecord[] = [];

    for (const key of sortedKeys) {
      const income = incomeMap.get(key)!;
      const expense = expenseMap.get(key) ?? 0;
      const monthlySavings = income - expense;
      cumulative += monthlySavings;

      const [year, month] = key.split("-").map(Number);
      result.push({
        month,
        year,
        monthlyIncome: income,
        monthlyExpenses: expense,
        monthlySavings,
        cumulativeSavings: cumulative,
      });
    }

    return result;
  }

  async getAnnualSummary(year: number): Promise<AnnualSummary> {
    const [expensesByType, incomesBySource, expenseMonthly, incomeMonthly] =
      await Promise.all([
        expenseRepo.sumByTypeForYear(year),
        incomeRepo.sumBySourceForYear(year),
        expenseRepo.monthlyTotalsForYear(year),
        incomeRepo.monthlyTotalsForYear(year),
      ]);

    const totalExpenses = expensesByType.reduce((sum, e) => sum + Number(e.total), 0);
    const totalIncome = incomesBySource.reduce((sum, i) => sum + Number(i.total), 0);

    const expenseMap = new Map(expenseMonthly.map((e) => [e.month, Number(e.total)]));
    const incomeMap = new Map(incomeMonthly.map((i) => [i.month, Number(i.total)]));

    const monthlyBreakdown = [];
    for (let m = 1; m <= 12; m++) {
      monthlyBreakdown.push({
        month: m,
        income: incomeMap.get(m) ?? 0,
        expenses: expenseMap.get(m) ?? 0,
      });
    }

    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      expensesByType,
      incomesBySource,
      monthlyBreakdown,
    };
  }
}
