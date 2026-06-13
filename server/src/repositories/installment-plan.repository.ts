import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { InstallmentPlan, CreateInstallmentPlanDto } from "../types/index.js";

export class InstallmentPlanRepository {
  private db = getDb();

  async findAll(): Promise<InstallmentPlan[]> {
    const result = await this.db.execute(
      "SELECT * FROM installment_plans ORDER BY created_at DESC"
    );
    return mapRows<InstallmentPlan>(result.rows);
  }

  async findById(id: number): Promise<InstallmentPlan | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM installment_plans WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<InstallmentPlan>(result.rows[0]) : null;
  }

  async create(dto: CreateInstallmentPlanDto): Promise<InstallmentPlan> {
    const result = await this.db.execute({
      sql: `INSERT INTO installment_plans (name, total_amount, buyer_name, description)
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: [dto.name, dto.total_amount, dto.buyer_name, dto.description ?? ""],
    });
    return mapRow<InstallmentPlan>(result.rows[0]);
  }

  async update(id: number, dto: CreateInstallmentPlanDto): Promise<InstallmentPlan | null> {
    const result = await this.db.execute({
      sql: `UPDATE installment_plans SET name = ?, total_amount = ?, buyer_name = ?, description = ?,
            updated_at = datetime('now') WHERE id = ? RETURNING *`,
      args: [dto.name, dto.total_amount, dto.buyer_name, dto.description ?? "", id],
    });
    return result.rows.length ? mapRow<InstallmentPlan>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM installment_plans WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM incomes WHERE installment_plan_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
