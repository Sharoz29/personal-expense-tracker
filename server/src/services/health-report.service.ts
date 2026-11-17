import { HealthReportRepository } from "../repositories/health-report.repository.js";
import type {
  CreateHealthReportDto,
  UpdateHealthReportDto,
} from "../types/index.js";

const repo = new HealthReportRepository();

export class HealthReportService {
  async getAll(filters?: {
    family_member_id?: number;
    category_id?: number;
  }) {
    return repo.findAll(filters);
  }

  async getById(id: number) {
    const report = await repo.findById(id);
    if (!report) return null;
    const results = await repo.findResultsByReportId(id);
    return { ...report, results };
  }

  async create(dto: CreateHealthReportDto) {
    const report = await repo.create(dto);
    const results = await Promise.all(
      dto.results.map((r) => repo.createResult(report.id, r))
    );
    return { ...report, results };
  }

  async update(id: number, dto: UpdateHealthReportDto) {
    const report = await repo.update(id, dto);
    if (!report) return null;
    await repo.deleteResultsByReportId(id);
    const results = await Promise.all(
      dto.results.map((r) => repo.createResult(id, r))
    );
    return { ...report, results };
  }

  async delete(id: number) {
    return repo.delete(id);
  }

  async getMarkerHistory(familyMemberId: number, markerId: number) {
    return repo.findMarkerHistory(familyMemberId, markerId);
  }
}
