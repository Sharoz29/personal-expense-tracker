import { IncomeRepository } from "../repositories/income.repository.js";
import { AccountService } from "./account.service.js";
import type { CreateIncomeDto, UpdateIncomeDto } from "../types/index.js";

const repo = new IncomeRepository();
const accountService = new AccountService();

export class IncomeService {
  async getByMonthYear(month: number, year: number) {
    return repo.findByMonthYear(month, year);
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateIncomeDto) {
    const income = await repo.create(dto);
    await accountService.adjustBalance(dto.account_id, dto.amount);
    return income;
  }

  async update(id: number, dto: UpdateIncomeDto) {
    const old = await repo.findById(id);
    if (!old) return null;

    // Reverse old balance change
    await accountService.adjustBalance(old.account_id, -old.amount);
    // Apply new balance change
    await accountService.adjustBalance(dto.account_id, dto.amount);

    return repo.update(id, dto);
  }

  async delete(id: number) {
    const income = await repo.findById(id);
    if (!income) return false;

    const deleted = await repo.delete(id);
    if (deleted) {
      await accountService.adjustBalance(income.account_id, -income.amount);
    }
    return deleted;
  }

  async getSummary(month: number, year: number) {
    return repo.sumByMonthYear(month, year);
  }
}
