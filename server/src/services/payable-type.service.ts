import { PayableTypeRepository } from "../repositories/payable-type.repository.js";
import type { CreatePayableTypeDto } from "../types/index.js";

const repo = new PayableTypeRepository();

export class PayableTypeService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreatePayableTypeDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreatePayableTypeDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) {
      throw new Error("Cannot delete - type is in use by payables");
    }
    return repo.delete(id);
  }
}
