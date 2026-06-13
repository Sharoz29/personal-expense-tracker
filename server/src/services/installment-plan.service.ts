import { InstallmentPlanRepository } from "../repositories/installment-plan.repository.js";
import type { CreateInstallmentPlanDto } from "../types/index.js";

const repo = new InstallmentPlanRepository();

export class InstallmentPlanService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateInstallmentPlanDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreateInstallmentPlanDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) {
      throw new Error("Cannot delete - installment plan has associated payments");
    }
    return repo.delete(id);
  }
}
