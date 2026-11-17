import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type {
  HealthMarker,
  CreateHealthMarkerDto,
  UpdateHealthMarkerDto,
} from "../types/index.js";

export class HealthMarkerRepository {
  private db = getDb();

  async findAll(): Promise<HealthMarker[]> {
    const result = await this.db.execute(
      `SELECT m.*, c.name as category_name
       FROM health_markers m
       JOIN health_report_categories c ON m.category_id = c.id
       ORDER BY c.name, m.name`
    );
    return mapRows<HealthMarker>(result.rows);
  }

  async findByCategoryId(categoryId: number): Promise<HealthMarker[]> {
    const result = await this.db.execute({
      sql: `SELECT m.*, c.name as category_name
            FROM health_markers m
            JOIN health_report_categories c ON m.category_id = c.id
            WHERE m.category_id = ?
            ORDER BY m.name`,
      args: [categoryId],
    });
    return mapRows<HealthMarker>(result.rows);
  }

  async findById(id: number): Promise<HealthMarker | null> {
    const result = await this.db.execute({
      sql: `SELECT m.*, c.name as category_name
            FROM health_markers m
            JOIN health_report_categories c ON m.category_id = c.id
            WHERE m.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<HealthMarker>(result.rows[0]) : null;
  }

  async create(dto: CreateHealthMarkerDto): Promise<HealthMarker> {
    const result = await this.db.execute({
      sql: `INSERT INTO health_markers (name, unit, category_id)
            VALUES (?, ?, ?) RETURNING *`,
      args: [dto.name, dto.unit, dto.category_id],
    });
    return mapRow<HealthMarker>(result.rows[0]);
  }

  async update(
    id: number,
    dto: UpdateHealthMarkerDto
  ): Promise<HealthMarker | null> {
    const result = await this.db.execute({
      sql: `UPDATE health_markers
            SET name = ?, unit = ?, category_id = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, dto.unit, dto.category_id, id],
    });
    return result.rows.length ? mapRow<HealthMarker>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM health_markers WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
