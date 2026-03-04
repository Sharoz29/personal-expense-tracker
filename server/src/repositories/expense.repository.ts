import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseBreakdown } from "../types/index.js";

function parseBreakdowns(row: any): any {
  if (row && typeof row.breakdowns === "string") {
    try { row.breakdowns = JSON.parse(row.breakdowns); } catch { row.breakdowns = null; }
  }
  return row;
}

export class ExpenseRepository {
  private db = getDb();

  async findByMonthYear(month: number, year: number): Promise<Expense[]> {
    const result = await this.db.execute({
      sql: `SELECT e.*, et.name as expense_type_name, a.name as account_name
            FROM expenses e
            JOIN expense_types et ON e.expense_type_id = et.id
            JOIN accounts a ON e.account_id = a.id
            WHERE e.month = ? AND e.year = ?
            ORDER BY e.date DESC`,
      args: [month, year],
    });
    return mapRows<Expense>(result.rows.map(parseBreakdowns));
  }

  async findById(id: number): Promise<Expense | null> {
    const result = await this.db.execute({
      sql: `SELECT e.*, et.name as expense_type_name, a.name as account_name
            FROM expenses e
            JOIN expense_types et ON e.expense_type_id = et.id
            JOIN accounts a ON e.account_id = a.id
            WHERE e.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<Expense>(parseBreakdowns(result.rows[0])) : null;
  }

  async create(dto: CreateExpenseDto): Promise<Expense> {
    const breakdownsJson = dto.breakdowns ? JSON.stringify(dto.breakdowns) : null;
    const result = await this.db.execute({
      sql: `INSERT INTO expenses (expense_type_id, account_id, amount, description, date, month, year, breakdowns)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.expense_type_id, dto.account_id, dto.amount, dto.description, dto.date, dto.month, dto.year, breakdownsJson],
    });
    return mapRow<Expense>(parseBreakdowns(result.rows[0]));
  }

  async update(id: number, dto: UpdateExpenseDto): Promise<Expense | null> {
    const breakdownsJson = dto.breakdowns ? JSON.stringify(dto.breakdowns) : null;
    const result = await this.db.execute({
      sql: `UPDATE expenses
            SET expense_type_id = ?, account_id = ?, amount = ?, description = ?, date = ?,
                month = ?, year = ?, breakdowns = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.expense_type_id, dto.account_id, dto.amount, dto.description, dto.date, dto.month, dto.year, breakdownsJson, id],
    });
    return result.rows.length ? mapRow<Expense>(parseBreakdowns(result.rows[0])) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM expenses WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async findByTypeName(typeName: string): Promise<Expense[]> {
    const result = await this.db.execute({
      sql: `SELECT e.*, et.name as expense_type_name, a.name as account_name
            FROM expenses e
            JOIN expense_types et ON e.expense_type_id = et.id
            JOIN accounts a ON e.account_id = a.id
            WHERE et.name = ?
            ORDER BY e.date DESC`,
      args: [typeName],
    });
    return mapRows<Expense>(result.rows);
  }

  async sumByMonthYear(month: number, year: number): Promise<number> {
    const result = await this.db.execute({
      sql: "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE month = ? AND year = ?",
      args: [month, year],
    });
    return Number(result.rows[0].total);
  }

  async sumByTypeForMonth(month: number, year: number): Promise<{ name: string; total: number }[]> {
    const result = await this.db.execute({
      sql: `SELECT et.name, COALESCE(SUM(e.amount), 0) as total
            FROM expenses e
            JOIN expense_types et ON e.expense_type_id = et.id
            WHERE e.month = ? AND e.year = ?
            GROUP BY et.name
            ORDER BY total DESC`,
      args: [month, year],
    });
    return mapRows<{ name: string; total: number }>(result.rows);
  }
}
