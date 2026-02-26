import { ExpenseRepository } from "../repositories/expense.repository.js";
import { IncomeRepository } from "../repositories/income.repository.js";
import { SavingsRepository } from "../repositories/savings.repository.js";
import type { DashboardSummary } from "../types/index.js";

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
}
