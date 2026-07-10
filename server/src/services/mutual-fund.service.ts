import { MutualFundRepository } from "../repositories/mutual-fund.repository.js";
import type { CreateMutualFundDto } from "../types/index.js";

const repo = new MutualFundRepository();

export class MutualFundService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async getByCompanyId(companyId: number) {
    return repo.findByCompanyId(companyId);
  }

  async create(dto: CreateMutualFundDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreateMutualFundDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) {
      throw new Error("Cannot delete - fund has associated transactions");
    }
    return repo.delete(id);
  }
}
