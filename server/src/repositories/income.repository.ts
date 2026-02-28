import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Income, CreateIncomeDto, UpdateIncomeDto } from "../types/index.js";

export class IncomeRepository {
  private db = getDb();

  async findByMonthYear(month: number, year: number): Promise<Income[]> {
    const result = await this.db.execute({
      sql: `SELECT i.*, s.name as income_source_name, a.name as account_name
            FROM incomes i
            JOIN income_sources s ON i.income_source_id = s.id
            JOIN accounts a ON i.account_id = a.id
            WHERE i.month = ? AND i.year = ?
            ORDER BY i.date DESC`,
      args: [month, year],
    });
    return mapRows<Income>(result.rows);
  }

  async findById(id: number): Promise<Income | null> {
    const result = await this.db.execute({
      sql: `SELECT i.*, s.name as income_source_name, a.name as account_name
            FROM incomes i
            JOIN income_sources s ON i.income_source_id = s.id
            JOIN accounts a ON i.account_id = a.id
            WHERE i.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<Income>(result.rows[0]) : null;
  }

  async create(dto: CreateIncomeDto): Promise<Income> {
    const result = await this.db.execute({
      sql: `INSERT INTO incomes (income_source_id, account_id, amount, description, date, month, year)
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.income_source_id, dto.account_id, dto.amount, dto.description, dto.date, dto.month, dto.year],
    });
    return mapRow<Income>(result.rows[0]);
  }

  async update(id: number, dto: UpdateIncomeDto): Promise<Income | null> {
    const result = await this.db.execute({
      sql: `UPDATE incomes
            SET income_source_id = ?, account_id = ?, amount = ?, description = ?, date = ?,
                month = ?, year = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.income_source_id, dto.account_id, dto.amount, dto.description, dto.date, dto.month, dto.year, id],
    });
    return result.rows.length ? mapRow<Income>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM incomes WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async sumByMonthYear(month: number, year: number): Promise<number> {
    const result = await this.db.execute({
      sql: "SELECT COALESCE(SUM(amount), 0) as total FROM incomes WHERE month = ? AND year = ?",
      args: [month, year],
    });
    return Number(result.rows[0].total);
  }

  async sumBySourceForMonth(month: number, year: number): Promise<{ name: string; total: number }[]> {
    const result = await this.db.execute({
      sql: `SELECT s.name, COALESCE(SUM(i.amount), 0) as total
            FROM incomes i
            JOIN income_sources s ON i.income_source_id = s.id
            WHERE i.month = ? AND i.year = ?
            GROUP BY s.name
            ORDER BY total DESC`,
      args: [month, year],
    });
    return mapRows<{ name: string; total: number }>(result.rows);
  }
}
