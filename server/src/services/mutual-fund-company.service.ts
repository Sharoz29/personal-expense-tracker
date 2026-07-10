import { MutualFundCompanyRepository } from "../repositories/mutual-fund-company.repository.js";
import type { CreateMutualFundCompanyDto } from "../types/index.js";

const repo = new MutualFundCompanyRepository();

export class MutualFundCompanyService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateMutualFundCompanyDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreateMutualFundCompanyDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) {
      throw new Error("Cannot delete - company has associated funds");
    }
    return repo.delete(id);
  }
}
