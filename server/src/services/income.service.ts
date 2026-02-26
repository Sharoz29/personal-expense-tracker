import { IncomeRepository } from "../repositories/income.repository.js";
import type { CreateIncomeDto, UpdateIncomeDto } from "../types/index.js";

const repo = new IncomeRepository();

export class IncomeService {
  async getByMonthYear(month: number, year: number) {
    return repo.findByMonthYear(month, year);
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateIncomeDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateIncomeDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }

  async getSummary(month: number, year: number) {
    return repo.sumByMonthYear(month, year);
  }
}
