import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { ExpenseType, CreateExpenseTypeDto } from "../types/index.js";

export class ExpenseTypeRepository {
  private db = getDb();

  async findAll(): Promise<ExpenseType[]> {
    const result = await this.db.execute("SELECT * FROM expense_types ORDER BY name");
    return mapRows<ExpenseType>(result.rows);
  }

  async findById(id: number): Promise<ExpenseType | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM expense_types WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<ExpenseType>(result.rows[0]) : null;
  }

  async create(dto: CreateExpenseTypeDto): Promise<ExpenseType> {
    const result = await this.db.execute({
      sql: "INSERT INTO expense_types (name) VALUES (?) RETURNING *",
      args: [dto.name],
    });
    return mapRow<ExpenseType>(result.rows[0]);
  }

  async update(id: number, dto: CreateExpenseTypeDto): Promise<ExpenseType | null> {
    const result = await this.db.execute({
      sql: "UPDATE expense_types SET name = ?, updated_at = datetime('now') WHERE id = ? RETURNING *",
      args: [dto.name, id],
    });
    return result.rows.length ? mapRow<ExpenseType>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM expense_types WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
