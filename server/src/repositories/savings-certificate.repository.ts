import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { SavingsCertificate, CreateSavingsCertificateDto, UpdateSavingsCertificateDto } from "../types/index.js";

export class SavingsCertificateRepository {
  private db = getDb();

  async findAll(): Promise<SavingsCertificate[]> {
    const result = await this.db.execute({
      sql: "SELECT * FROM savings_certificates ORDER BY purchase_date DESC",
      args: [],
    });
    return mapRows<SavingsCertificate>(result.rows);
  }

  async findById(id: number): Promise<SavingsCertificate | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM savings_certificates WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<SavingsCertificate>(result.rows[0]) : null;
  }

  async create(dto: CreateSavingsCertificateDto): Promise<SavingsCertificate> {
    const result = await this.db.execute({
      sql: `INSERT INTO savings_certificates (certificate_type, principal_amount, profit_rate, purchase_date, maturity_date)
            VALUES (?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.certificate_type, dto.principal_amount, dto.profit_rate, dto.purchase_date, dto.maturity_date],
    });
    return mapRow<SavingsCertificate>(result.rows[0]);
  }

  async update(id: number, dto: UpdateSavingsCertificateDto): Promise<SavingsCertificate | null> {
    const result = await this.db.execute({
      sql: `UPDATE savings_certificates
            SET certificate_type = ?, principal_amount = ?, profit_rate = ?, purchase_date = ?, maturity_date = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.certificate_type, dto.principal_amount, dto.profit_rate, dto.purchase_date, dto.maturity_date, id],
    });
    return result.rows.length ? mapRow<SavingsCertificate>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM savings_certificates WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
