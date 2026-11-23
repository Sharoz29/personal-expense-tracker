import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type {
  HealthReport,
  HealthReportResult,
  CreateHealthReportDto,
  UpdateHealthReportDto,
  CreateHealthReportResultDto,
  HealthMarkerHistory,
} from "../types/index.js";

export class HealthReportRepository {
  private db = getDb();

  async findAll(filters?: {
    family_member_id?: number;
    category_id?: number;
  }): Promise<HealthReport[]> {
    let sql = `SELECT r.*, fm.name as family_member_name, c.name as category_name
               FROM health_reports r
               JOIN family_members fm ON r.family_member_id = fm.id
               JOIN health_report_categories c ON r.category_id = c.id`;
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (filters?.family_member_id) {
      conditions.push("r.family_member_id = ?");
      args.push(filters.family_member_id);
    }
    if (filters?.category_id) {
      conditions.push("r.category_id = ?");
      args.push(filters.category_id);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY r.report_date DESC, r.created_at DESC";

    const result = await this.db.execute({ sql, args });
    return mapRows<HealthReport>(result.rows);
  }

  async findById(id: number): Promise<HealthReport | null> {
    const result = await this.db.execute({
      sql: `SELECT r.*, fm.name as family_member_name, c.name as category_name
            FROM health_reports r
            JOIN family_members fm ON r.family_member_id = fm.id
            JOIN health_report_categories c ON r.category_id = c.id
            WHERE r.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<HealthReport>(result.rows[0]) : null;
  }

  async findResultsByReportId(
    reportId: number
  ): Promise<HealthReportResult[]> {
    const result = await this.db.execute({
      sql: `SELECT rr.id, rr.report_id, rr.marker_id, rr.value, rr.text_value, rr.created_at,
                   m.name as marker_name, m.unit as marker_unit, m.marker_type,
                   m.min_reference, m.max_reference, m.normal_value, m.reference_ranges
            FROM health_report_results rr
            JOIN health_markers m ON rr.marker_id = m.id
            WHERE rr.report_id = ?
            ORDER BY m.name`,
      args: [reportId],
    });
    return mapRows<HealthReportResult>(result.rows);
  }

  async create(dto: CreateHealthReportDto): Promise<HealthReport> {
    const result = await this.db.execute({
      sql: `INSERT INTO health_reports (family_member_id, category_id, report_date, lab_name, notes)
            VALUES (?, ?, ?, ?, ?) RETURNING *`,
      args: [
        dto.family_member_id,
        dto.category_id,
        dto.report_date,
        dto.lab_name ?? "",
        dto.notes ?? "",
      ],
    });
    return mapRow<HealthReport>(result.rows[0]);
  }

  async createResult(
    reportId: number,
    dto: CreateHealthReportResultDto
  ): Promise<HealthReportResult> {
    const result = await this.db.execute({
      sql: `INSERT INTO health_report_results (report_id, marker_id, value, text_value)
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: [
        reportId,
        dto.marker_id,
        dto.value ?? 0,
        dto.text_value ?? null,
      ],
    });
    return mapRow<HealthReportResult>(result.rows[0]);
  }

  async update(
    id: number,
    dto: UpdateHealthReportDto
  ): Promise<HealthReport | null> {
    const result = await this.db.execute({
      sql: `UPDATE health_reports
            SET family_member_id = ?, category_id = ?, report_date = ?, lab_name = ?, notes = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [
        dto.family_member_id,
        dto.category_id,
        dto.report_date,
        dto.lab_name ?? "",
        dto.notes ?? "",
        id,
      ],
    });
    return result.rows.length ? mapRow<HealthReport>(result.rows[0]) : null;
  }

  async deleteResultsByReportId(reportId: number): Promise<void> {
    await this.db.execute({
      sql: "DELETE FROM health_report_results WHERE report_id = ?",
      args: [reportId],
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM health_reports WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async findMarkerHistory(
    familyMemberId: number,
    markerId: number
  ): Promise<HealthMarkerHistory[]> {
    const result = await this.db.execute({
      sql: `SELECT r.id as report_id, r.report_date, r.lab_name,
                   rr.value, rr.text_value,
                   m.min_reference, m.max_reference, m.normal_value, m.reference_ranges, m.marker_type
            FROM health_report_results rr
            JOIN health_reports r ON rr.report_id = r.id
            JOIN health_markers m ON rr.marker_id = m.id
            WHERE r.family_member_id = ? AND rr.marker_id = ?
            ORDER BY r.report_date ASC`,
      args: [familyMemberId, markerId],
    });
    return mapRows<HealthMarkerHistory>(result.rows);
  }
}
