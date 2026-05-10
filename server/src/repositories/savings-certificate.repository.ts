import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { SavingsCertificate, CreateSavingsCertificateDto, UpdateSavingsCertificateDto } from "../types/index.js";

export class SavingsCertificateRepository {
  private db = getDb();

  async findAll(): Promise<SavingsCertificate[]> {
    const result = await this.db.execute({
      sql: `SELECT sc.*, acc.name as account_name
            FROM savings_certificates sc
            LEFT JOIN accounts acc ON sc.account_id = acc.id
            ORDER BY sc.purchase_date DESC`,
      args: [],
    });
    return mapRows<SavingsCertificate>(result.rows);
  }

  async findById(id: number): Promise<SavingsCertificate | null> {
    const result = await this.db.execute({
      sql: `SELECT sc.*, acc.name as account_name
            FROM savings_certificates sc
            LEFT JOIN accounts acc ON sc.account_id = acc.id
            WHERE sc.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<SavingsCertificate>(result.rows[0]) : null;
  }

  async create(dto: CreateSavingsCertificateDto): Promise<SavingsCertificate> {
    const result = await this.db.execute({
      sql: `INSERT INTO savings_certificates (certificate_type, principal_amount, profit_rate, purchase_date, maturity_date, duration, tax_rate, profit_tracking_start_date, account_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.certificate_type, dto.principal_amount, dto.profit_rate, dto.purchase_date, dto.maturity_date, dto.duration, dto.tax_rate, dto.profit_tracking_start_date ?? dto.purchase_date, dto.account_id ?? null],
    });
    return mapRow<SavingsCertificate>(result.rows[0]);
  }

  async update(id: number, dto: UpdateSavingsCertificateDto): Promise<SavingsCertificate | null> {
    const result = await this.db.execute({
      sql: `UPDATE savings_certificates
            SET certificate_type = ?, principal_amount = ?, profit_rate = ?, purchase_date = ?, maturity_date = ?, duration = ?, tax_rate = ?, profit_tracking_start_date = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.certificate_type, dto.principal_amount, dto.profit_rate, dto.purchase_date, dto.maturity_date, dto.duration, dto.tax_rate, dto.profit_tracking_start_date ?? dto.purchase_date, id],
    });
    return result.rows.length ? mapRow<SavingsCertificate>(result.rows[0]) : null;
  }

  async updateTrackingDate(id: number, date: string): Promise<void> {
    await this.db.execute({
      sql: `UPDATE savings_certificates SET profit_tracking_start_date = ?, updated_at = datetime('now') WHERE id = ?`,
      args: [date, id],
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM savings_certificates WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
