import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { MutualFund, CreateMutualFundDto } from "../types/index.js";

export class MutualFundRepository {
  private db = getDb();

  async findAll(): Promise<MutualFund[]> {
    const result = await this.db.execute({
      sql: `SELECT mf.*, mfc.name as company_name
            FROM mutual_funds mf
            JOIN mutual_fund_companies mfc ON mf.company_id = mfc.id
            ORDER BY mfc.name ASC, mf.name ASC`,
      args: [],
    });
    return mapRows<MutualFund>(result.rows);
  }

  async findById(id: number): Promise<MutualFund | null> {
    const result = await this.db.execute({
      sql: `SELECT mf.*, mfc.name as company_name
            FROM mutual_funds mf
            JOIN mutual_fund_companies mfc ON mf.company_id = mfc.id
            WHERE mf.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<MutualFund>(result.rows[0]) : null;
  }

  async findByCompanyId(companyId: number): Promise<MutualFund[]> {
    const result = await this.db.execute({
      sql: `SELECT mf.*, mfc.name as company_name
            FROM mutual_funds mf
            JOIN mutual_fund_companies mfc ON mf.company_id = mfc.id
            WHERE mf.company_id = ?`,
      args: [companyId],
    });
    return mapRows<MutualFund>(result.rows);
  }

  async create(dto: CreateMutualFundDto): Promise<MutualFund> {
    const result = await this.db.execute({
      sql: `INSERT INTO mutual_funds (name, company_id, category, risk_level, front_end_load_value, front_end_load_type, back_end_load_value, back_end_load_type, other_fees_value, other_fees_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.name, dto.company_id, dto.category, dto.risk_level, dto.front_end_load_value, dto.front_end_load_type, dto.back_end_load_value, dto.back_end_load_type, dto.other_fees_value, dto.other_fees_type],
    });
    return mapRow<MutualFund>(result.rows[0]);
  }

  async update(id: number, dto: CreateMutualFundDto): Promise<MutualFund | null> {
    const result = await this.db.execute({
      sql: `UPDATE mutual_funds
            SET name = ?, company_id = ?, category = ?, risk_level = ?, front_end_load_value = ?, front_end_load_type = ?, back_end_load_value = ?, back_end_load_type = ?, other_fees_value = ?, other_fees_type = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, dto.company_id, dto.category, dto.risk_level, dto.front_end_load_value, dto.front_end_load_type, dto.back_end_load_value, dto.back_end_load_type, dto.other_fees_value, dto.other_fees_type, id],
    });
    return result.rows.length ? mapRow<MutualFund>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM mutual_funds WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM mutual_fund_transactions WHERE fund_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
