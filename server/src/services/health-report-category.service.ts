import { HealthReportCategoryRepository } from "../repositories/health-report-category.repository.js";
import type {
  CreateHealthReportCategoryDto,
  UpdateHealthReportCategoryDto,
} from "../types/index.js";

const repo = new HealthReportCategoryRepository();

export class HealthReportCategoryService {
  async getAllWithMarkers() {
    const categories = await repo.findAll();
    const result = await Promise.all(
      categories.map(async (cat) => {
        const markers = await repo.findMarkersByCategoryId(cat.id);
        return { ...cat, markers };
      })
    );
    return result;
  }

  async create(dto: CreateHealthReportCategoryDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateHealthReportCategoryDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }
}
