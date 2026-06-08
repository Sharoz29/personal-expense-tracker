import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Payee, CreatePayeeDto } from "../types/index.js";

export class PayeeRepository {
  private db = getDb();

  async findAll(): Promise<Payee[]> {
    const result = await this.db.execute("SELECT * FROM payees ORDER BY name");
    return mapRows<Payee>(result.rows);
  }

  async findById(id: number): Promise<Payee | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM payees WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<Payee>(result.rows[0]) : null;
  }

  async create(dto: CreatePayeeDto): Promise<Payee> {
    const result = await this.db.execute({
      sql: "INSERT INTO payees (name) VALUES (?) RETURNING *",
      args: [dto.name],
    });
    return mapRow<Payee>(result.rows[0]);
  }

  async update(id: number, dto: CreatePayeeDto): Promise<Payee | null> {
    const result = await this.db.execute({
      sql: "UPDATE payees SET name = ?, updated_at = datetime('now') WHERE id = ? RETURNING *",
      args: [dto.name, id],
    });
    return result.rows.length ? mapRow<Payee>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM payees WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM payables WHERE payee_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
