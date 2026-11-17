import { HealthMarkerRepository } from "../repositories/health-marker.repository.js";
import type {
  CreateHealthMarkerDto,
  UpdateHealthMarkerDto,
} from "../types/index.js";

const repo = new HealthMarkerRepository();

export class HealthMarkerService {
  async getAll(categoryId?: number) {
    if (categoryId) {
      return repo.findByCategoryId(categoryId);
    }
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateHealthMarkerDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateHealthMarkerDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }
}
