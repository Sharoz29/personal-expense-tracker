import { ExpenseRepository } from "../repositories/expense.repository.js";
import { AccountService } from "./account.service.js";
import type { CreateExpenseDto, UpdateExpenseDto } from "../types/index.js";

const repo = new ExpenseRepository();
const accountService = new AccountService();

export class ExpenseService {
  async getByMonthYear(month: number, year: number) {
    return repo.findByMonthYear(month, year);
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateExpenseDto) {
    const expense = await repo.create(dto);
    await accountService.adjustBalance(dto.account_id, -dto.amount);
    return expense;
  }

  async update(id: number, dto: UpdateExpenseDto) {
    const old = await repo.findById(id);
    if (!old) return null;

    // Reverse old balance change
    await accountService.adjustBalance(old.account_id, old.amount);
    // Apply new balance change
    await accountService.adjustBalance(dto.account_id, -dto.amount);

    return repo.update(id, dto);
  }

  async delete(id: number) {
    const expense = await repo.findById(id);
    if (!expense) return false;

    const deleted = await repo.delete(id);
    if (deleted) {
      await accountService.adjustBalance(expense.account_id, expense.amount);
    }
    return deleted;
  }

  async getByTypeName(typeName: string) {
    return repo.findByTypeName(typeName);
  }

  async getSummary(month: number, year: number) {
    return repo.sumByMonthYear(month, year);
  }
}
