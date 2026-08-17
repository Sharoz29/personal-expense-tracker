import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Committee, CreateCommitteeDto, UpdateCommitteeDto, CommitteePayment, PayCommitteeDto } from "../types/index.js";

export class CommitteeRepository {
  private db = getDb();

  async findAll(): Promise<Committee[]> {
    const result = await this.db.execute({
      sql: `SELECT c.*, acc.name as account_name
            FROM committees c
            LEFT JOIN accounts acc ON c.account_id = acc.id
            ORDER BY c.start_date DESC`,
      args: [],
    });
    return mapRows<Committee>(result.rows);
  }

  async findById(id: number): Promise<Committee | null> {
    const result = await this.db.execute({
      sql: `SELECT c.*, acc.name as account_name
            FROM committees c
            LEFT JOIN accounts acc ON c.account_id = acc.id
            WHERE c.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<Committee>(result.rows[0]) : null;
  }

  async create(dto: CreateCommitteeDto): Promise<Committee> {
    const result = await this.db.execute({
      sql: `INSERT INTO committees (name, total_members, contribution_per_month, my_month, start_date, account_id)
            VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.name, dto.total_members, dto.contribution_per_month, dto.my_month, dto.start_date, dto.account_id ?? null],
    });
    return mapRow<Committee>(result.rows[0]);
  }

  async update(id: number, dto: UpdateCommitteeDto): Promise<Committee | null> {
    const result = await this.db.execute({
      sql: `UPDATE committees
            SET name = ?, total_members = ?, contribution_per_month = ?, my_month = ?, start_date = ?, account_id = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, dto.total_members, dto.contribution_per_month, dto.my_month, dto.start_date, dto.account_id ?? null, id],
    });
    return result.rows.length ? mapRow<Committee>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM committees WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async findPaymentsByCommitteeId(committeeId: number): Promise<CommitteePayment[]> {
    const result = await this.db.execute({
      sql: `SELECT cp.*, acc.name as account_name
            FROM committee_payments cp
            LEFT JOIN accounts acc ON cp.account_id = acc.id
            WHERE cp.committee_id = ?
            ORDER BY cp.month_number ASC`,
      args: [committeeId],
    });
    return mapRows<CommitteePayment>(result.rows);
  }

  async findAllPayments(): Promise<CommitteePayment[]> {
    const result = await this.db.execute({
      sql: `SELECT cp.*, acc.name as account_name
            FROM committee_payments cp
            LEFT JOIN accounts acc ON cp.account_id = acc.id
            ORDER BY cp.committee_id, cp.month_number ASC`,
      args: [],
    });
    return mapRows<CommitteePayment>(result.rows);
  }

  async createPayment(committeeId: number, dto: PayCommitteeDto): Promise<CommitteePayment> {
    const result = await this.db.execute({
      sql: `INSERT INTO committee_payments (committee_id, month_number, amount, payment_date, account_id)
            VALUES (?, ?, (SELECT contribution_per_month FROM committees WHERE id = ?), ?, ?)
            RETURNING *`,
      args: [committeeId, dto.month_number, committeeId, dto.payment_date, dto.account_id],
    });
    return mapRow<CommitteePayment>(result.rows[0]);
  }

  async deletePayment(paymentId: number): Promise<CommitteePayment | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM committee_payments WHERE id = ?",
      args: [paymentId],
    });
    if (!result.rows.length) return null;
    const payment = mapRow<CommitteePayment>(result.rows[0]);
    await this.db.execute({
      sql: "DELETE FROM committee_payments WHERE id = ?",
      args: [paymentId],
    });
    return payment;
  }
}
