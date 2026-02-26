import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Savings } from "../types/index.js";

export class SavingsRepository {
  private db = getDb();

  async findAll(): Promise<Savings[]> {
    const result = await this.db.execute(
      "SELECT * FROM savings ORDER BY year DESC, month DESC"
    );
    return mapRows<Savings>(result.rows);
  }

  async findByMonthYear(month: number, year: number): Promise<Savings | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM savings WHERE month = ? AND year = ?",
      args: [month, year],
    });
    return result.rows.length ? mapRow<Savings>(result.rows[0]) : null;
  }

  async upsert(month: number, year: number, amount: number, notes: string): Promise<Savings> {
    const result = await this.db.execute({
      sql: `INSERT INTO savings (month, year, amount, notes)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(month, year)
            DO UPDATE SET amount = excluded.amount, notes = excluded.notes, updated_at = datetime('now')
            RETURNING *`,
      args: [month, year, amount, notes],
    });
    return mapRow<Savings>(result.rows[0]);
  }
}
