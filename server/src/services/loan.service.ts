import { LoanRepository } from "../repositories/loan.repository.js";
import type { CreateLoanDto } from "../types/index.js";

const repo = new LoanRepository();

export class LoanService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateLoanDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreateLoanDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) {
      throw new Error("Cannot delete - loan has associated payments");
    }
    return repo.delete(id);
  }
}
