import { ExpenseTypeRepository } from "../repositories/expense-type.repository.js";
import type { CreateExpenseTypeDto } from "../types/index.js";

const repo = new ExpenseTypeRepository();

export class ExpenseTypeService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateExpenseTypeDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreateExpenseTypeDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }
}
