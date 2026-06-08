import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Loan, CreateLoanDto } from "../types/index.js";

export class LoanRepository {
  private db = getDb();

  async findAll(): Promise<Loan[]> {
    const result = await this.db.execute(
      "SELECT * FROM loans ORDER BY created_at DESC"
    );
    return mapRows<Loan>(result.rows);
  }

  async findById(id: number): Promise<Loan | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM loans WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<Loan>(result.rows[0]) : null;
  }

  async create(dto: CreateLoanDto): Promise<Loan> {
    const result = await this.db.execute({
      sql: `INSERT INTO loans (name, total_amount, description, start_date)
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: [dto.name, dto.total_amount, dto.description ?? "", dto.start_date ?? null],
    });
    return mapRow<Loan>(result.rows[0]);
  }

  async update(id: number, dto: CreateLoanDto): Promise<Loan | null> {
    const result = await this.db.execute({
      sql: `UPDATE loans SET name = ?, total_amount = ?, description = ?, start_date = ?,
            updated_at = datetime('now') WHERE id = ? RETURNING *`,
      args: [dto.name, dto.total_amount, dto.description ?? "", dto.start_date ?? null, id],
    });
    return result.rows.length ? mapRow<Loan>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM loans WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM expenses WHERE loan_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
