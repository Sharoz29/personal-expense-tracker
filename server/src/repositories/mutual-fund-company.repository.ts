import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { MutualFundCompany, CreateMutualFundCompanyDto } from "../types/index.js";

export class MutualFundCompanyRepository {
  private db = getDb();

  async findAll(): Promise<MutualFundCompany[]> {
    const result = await this.db.execute(
      "SELECT * FROM mutual_fund_companies ORDER BY name ASC"
    );
    return mapRows<MutualFundCompany>(result.rows);
  }

  async findById(id: number): Promise<MutualFundCompany | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM mutual_fund_companies WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<MutualFundCompany>(result.rows[0]) : null;
  }

  async create(dto: CreateMutualFundCompanyDto): Promise<MutualFundCompany> {
    const result = await this.db.execute({
      sql: `INSERT INTO mutual_fund_companies (name)
            VALUES (?) RETURNING *`,
      args: [dto.name],
    });
    return mapRow<MutualFundCompany>(result.rows[0]);
  }

  async update(id: number, dto: CreateMutualFundCompanyDto): Promise<MutualFundCompany | null> {
    const result = await this.db.execute({
      sql: `UPDATE mutual_fund_companies SET name = ?,
            updated_at = datetime('now') WHERE id = ? RETURNING *`,
      args: [dto.name, id],
    });
    return result.rows.length ? mapRow<MutualFundCompany>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM mutual_fund_companies WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM mutual_funds WHERE company_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
