import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { MutualFundTransaction, CreateMutualFundTransactionDto } from "../types/index.js";

export class MutualFundTransactionRepository {
  private db = getDb();

  async findAll(): Promise<MutualFundTransaction[]> {
    const result = await this.db.execute({
      sql: `SELECT t.*, mf.name as fund_name, mfc.name as company_name, acc.name as account_name
            FROM mutual_fund_transactions t
            JOIN mutual_funds mf ON t.fund_id = mf.id
            JOIN mutual_fund_companies mfc ON mf.company_id = mfc.id
            LEFT JOIN accounts acc ON t.account_id = acc.id
            ORDER BY t.investment_date DESC`,
      args: [],
    });
    return mapRows<MutualFundTransaction>(result.rows);
  }

  async findByFundId(fundId: number): Promise<MutualFundTransaction[]> {
    const result = await this.db.execute({
      sql: `SELECT t.*, mf.name as fund_name, mfc.name as company_name, acc.name as account_name
            FROM mutual_fund_transactions t
            JOIN mutual_funds mf ON t.fund_id = mf.id
            JOIN mutual_fund_companies mfc ON mf.company_id = mfc.id
            LEFT JOIN accounts acc ON t.account_id = acc.id
            WHERE t.fund_id = ?
            ORDER BY t.investment_date DESC`,
      args: [fundId],
    });
    return mapRows<MutualFundTransaction>(result.rows);
  }

  async findById(id: number): Promise<MutualFundTransaction | null> {
    const result = await this.db.execute({
      sql: `SELECT t.*, mf.name as fund_name, mfc.name as company_name, acc.name as account_name
            FROM mutual_fund_transactions t
            JOIN mutual_funds mf ON t.fund_id = mf.id
            JOIN mutual_fund_companies mfc ON mf.company_id = mfc.id
            LEFT JOIN accounts acc ON t.account_id = acc.id
            WHERE t.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<MutualFundTransaction>(result.rows[0]) : null;
  }

  async create(
    dto: CreateMutualFundTransactionDto,
    fees: { front_end_load_amount: number; back_end_load_amount: number; other_fees_amount: number; net_invested_amount: number }
  ): Promise<MutualFundTransaction> {
    const result = await this.db.execute({
      sql: `INSERT INTO mutual_fund_transactions (fund_id, account_id, amount, nav_at_purchase, units_allocated, front_end_load_amount, back_end_load_amount, other_fees_amount, net_invested_amount, is_online, investment_date, portal_reflection_date, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        dto.fund_id,
        dto.account_id ?? null,
        dto.amount,
        dto.nav_at_purchase,
        dto.units_allocated,
        fees.front_end_load_amount,
        fees.back_end_load_amount,
        fees.other_fees_amount,
        fees.net_invested_amount,
        dto.is_online ? 1 : 0,
        dto.investment_date,
        dto.portal_reflection_date ?? null,
        dto.description ?? "",
      ],
    });
    return mapRow<MutualFundTransaction>(result.rows[0]);
  }

  async update(
    id: number,
    dto: CreateMutualFundTransactionDto,
    fees: { front_end_load_amount: number; back_end_load_amount: number; other_fees_amount: number; net_invested_amount: number }
  ): Promise<MutualFundTransaction | null> {
    const result = await this.db.execute({
      sql: `UPDATE mutual_fund_transactions
            SET fund_id = ?, account_id = ?, amount = ?, nav_at_purchase = ?, units_allocated = ?, front_end_load_amount = ?, back_end_load_amount = ?, other_fees_amount = ?, net_invested_amount = ?, is_online = ?, investment_date = ?, portal_reflection_date = ?, description = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [
        dto.fund_id,
        dto.account_id ?? null,
        dto.amount,
        dto.nav_at_purchase,
        dto.units_allocated,
        fees.front_end_load_amount,
        fees.back_end_load_amount,
        fees.other_fees_amount,
        fees.net_invested_amount,
        dto.is_online ? 1 : 0,
        dto.investment_date,
        dto.portal_reflection_date ?? null,
        dto.description ?? "",
        id,
      ],
    });
    return result.rows.length ? mapRow<MutualFundTransaction>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM mutual_fund_transactions WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
