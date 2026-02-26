import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { IncomeSource, CreateIncomeSourceDto } from "../types/index.js";

export class IncomeSourceRepository {
  private db = getDb();

  async findAll(): Promise<IncomeSource[]> {
    const result = await this.db.execute("SELECT * FROM income_sources ORDER BY name");
    return mapRows<IncomeSource>(result.rows);
  }

  async findById(id: number): Promise<IncomeSource | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM income_sources WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<IncomeSource>(result.rows[0]) : null;
  }

  async create(dto: CreateIncomeSourceDto): Promise<IncomeSource> {
    const result = await this.db.execute({
      sql: "INSERT INTO income_sources (name) VALUES (?) RETURNING *",
      args: [dto.name],
    });
    return mapRow<IncomeSource>(result.rows[0]);
  }

  async update(id: number, dto: CreateIncomeSourceDto): Promise<IncomeSource | null> {
    const result = await this.db.execute({
      sql: "UPDATE income_sources SET name = ?, updated_at = datetime('now') WHERE id = ? RETURNING *",
      args: [dto.name, id],
    });
    return result.rows.length ? mapRow<IncomeSource>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM income_sources WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
