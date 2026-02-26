import { ExpenseRepository } from "../repositories/expense.repository.js";
import { IncomeRepository } from "../repositories/income.repository.js";
import { SavingsRepository } from "../repositories/savings.repository.js";

const expenseRepo = new ExpenseRepository();
const incomeRepo = new IncomeRepository();
const savingsRepo = new SavingsRepository();

export class SavingsService {
  async calculateAndSave(month: number, year: number) {
    const totalIncome = await incomeRepo.sumByMonthYear(month, year);
    const totalExpenses = await expenseRepo.sumByMonthYear(month, year);
    const netSavings = totalIncome - totalExpenses;

    const existing = await savingsRepo.findByMonthYear(month, year);
    const notes = existing?.notes ?? "";

    return savingsRepo.upsert(month, year, netSavings, notes);
  }

  async getByMonthYear(month: number, year: number) {
    return savingsRepo.findByMonthYear(month, year);
  }

  async updateManually(month: number, year: number, amount: number, notes: string) {
    return savingsRepo.upsert(month, year, amount, notes);
  }

  async getAll() {
    return savingsRepo.findAll();
  }
}
