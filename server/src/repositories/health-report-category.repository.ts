import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type {
  HealthReportCategory,
  HealthMarker,
  CreateHealthReportCategoryDto,
  UpdateHealthReportCategoryDto,
} from "../types/index.js";

export class HealthReportCategoryRepository {
  private db = getDb();

  async findAll(): Promise<HealthReportCategory[]> {
    const result = await this.db.execute(
      "SELECT * FROM health_report_categories ORDER BY name"
    );
    return mapRows<HealthReportCategory>(result.rows);
  }

  async findById(id: number): Promise<HealthReportCategory | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM health_report_categories WHERE id = ?",
      args: [id],
    });
    return result.rows.length
      ? mapRow<HealthReportCategory>(result.rows[0])
      : null;
  }

  async create(
    dto: CreateHealthReportCategoryDto
  ): Promise<HealthReportCategory> {
    const result = await this.db.execute({
      sql: `INSERT INTO health_report_categories (name)
            VALUES (?) RETURNING *`,
      args: [dto.name],
    });
    return mapRow<HealthReportCategory>(result.rows[0]);
  }

  async update(
    id: number,
    dto: UpdateHealthReportCategoryDto
  ): Promise<HealthReportCategory | null> {
    const result = await this.db.execute({
      sql: `UPDATE health_report_categories
            SET name = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, id],
    });
    return result.rows.length
      ? mapRow<HealthReportCategory>(result.rows[0])
      : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM health_report_categories WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async findMarkersByCategoryId(
    categoryId: number
  ): Promise<HealthMarker[]> {
    const result = await this.db.execute({
      sql: "SELECT * FROM health_markers WHERE category_id = ? ORDER BY name",
      args: [categoryId],
    });
    return mapRows<HealthMarker>(result.rows);
  }
}
