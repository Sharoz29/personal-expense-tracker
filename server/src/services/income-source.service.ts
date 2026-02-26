import { IncomeSourceRepository } from "../repositories/income-source.repository.js";
import type { CreateIncomeSourceDto } from "../types/index.js";

const repo = new IncomeSourceRepository();

export class IncomeSourceService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateIncomeSourceDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreateIncomeSourceDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }
}
