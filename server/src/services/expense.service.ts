import { ExpenseRepository } from "../repositories/expense.repository.js";
import type { CreateExpenseDto, UpdateExpenseDto } from "../types/index.js";

const repo = new ExpenseRepository();

export class ExpenseService {
  async getByMonthYear(month: number, year: number) {
    return repo.findByMonthYear(month, year);
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateExpenseDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateExpenseDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }

  async getByTypeName(typeName: string) {
    return repo.findByTypeName(typeName);
  }

  async getSummary(month: number, year: number) {
    return repo.sumByMonthYear(month, year);
  }
}
