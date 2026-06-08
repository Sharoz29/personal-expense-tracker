import { PayeeRepository } from "../repositories/payee.repository.js";
import type { CreatePayeeDto } from "../types/index.js";

const repo = new PayeeRepository();

export class PayeeService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreatePayeeDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: CreatePayeeDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) {
      throw new Error("Cannot delete - payee is in use by payables");
    }
    return repo.delete(id);
  }
}
