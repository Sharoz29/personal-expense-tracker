import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { PayableType, CreatePayableTypeDto } from "../types/index.js";

export class PayableTypeRepository {
  private db = getDb();

  async findAll(): Promise<PayableType[]> {
    const result = await this.db.execute("SELECT * FROM payable_types ORDER BY name");
    return mapRows<PayableType>(result.rows);
  }

  async findById(id: number): Promise<PayableType | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM payable_types WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<PayableType>(result.rows[0]) : null;
  }

  async create(dto: CreatePayableTypeDto): Promise<PayableType> {
    const result = await this.db.execute({
      sql: "INSERT INTO payable_types (name) VALUES (?) RETURNING *",
      args: [dto.name],
    });
    return mapRow<PayableType>(result.rows[0]);
  }

  async update(id: number, dto: CreatePayableTypeDto): Promise<PayableType | null> {
    const result = await this.db.execute({
      sql: "UPDATE payable_types SET name = ?, updated_at = datetime('now') WHERE id = ? RETURNING *",
      args: [dto.name, id],
    });
    return result.rows.length ? mapRow<PayableType>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM payable_types WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM payables WHERE payable_type_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
