import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Payable, CreatePayableDto, UpdatePayableDto } from "../types/index.js";

export class PayableRepository {
  private db = getDb();

  async findAll(): Promise<Payable[]> {
    const result = await this.db.execute({
      sql: `SELECT p.*, a.name as account_name, pt.name as payable_type_name, py.name as payee_name
            FROM payables p
            LEFT JOIN accounts a ON p.account_id = a.id
            LEFT JOIN payable_types pt ON p.payable_type_id = pt.id
            LEFT JOIN payees py ON p.payee_id = py.id
            ORDER BY
              CASE p.status WHEN 'pending' THEN 0 ELSE 1 END,
              p.created_at DESC`,
      args: [],
    });
    return mapRows<Payable>(result.rows);
  }

  async findById(id: number): Promise<Payable | null> {
    const result = await this.db.execute({
      sql: `SELECT p.*, a.name as account_name, pt.name as payable_type_name, py.name as payee_name
            FROM payables p
            LEFT JOIN accounts a ON p.account_id = a.id
            LEFT JOIN payable_types pt ON p.payable_type_id = pt.id
            LEFT JOIN payees py ON p.payee_id = py.id
            WHERE p.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<Payable>(result.rows[0]) : null;
  }

  async create(dto: CreatePayableDto): Promise<Payable> {
    const result = await this.db.execute({
      sql: `INSERT INTO payables (description, amount, from_person, payee_id, due_date, payable_type_id, status, account_id, paid_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        dto.description,
        dto.amount,
        dto.from_person ?? "",
        dto.payee_id ?? null,
        dto.due_date ?? null,
        dto.payable_type_id ?? null,
        dto.status ?? "pending",
        dto.account_id ?? null,
        dto.paid_date ?? null,
      ],
    });
    return mapRow<Payable>(result.rows[0]);
  }

  async update(id: number, dto: UpdatePayableDto): Promise<Payable | null> {
    const result = await this.db.execute({
      sql: `UPDATE payables
            SET description = ?, amount = ?, from_person = ?, payee_id = ?, due_date = ?, payable_type_id = ?, updated_at = datetime('now')
            WHERE id = ? AND status = 'pending' RETURNING *`,
      args: [dto.description, dto.amount, dto.from_person ?? "", dto.payee_id ?? null, dto.due_date ?? null, dto.payable_type_id ?? null, id],
    });
    return result.rows.length ? mapRow<Payable>(result.rows[0]) : null;
  }

  async markPaid(id: number, accountId: number, incomeId: number, paidDate: string): Promise<Payable | null> {
    const result = await this.db.execute({
      sql: `UPDATE payables
            SET status = 'paid', amount_paid = amount, account_id = ?, income_id = ?, paid_date = ?, updated_at = datetime('now')
            WHERE id = ? AND status = 'pending' RETURNING *`,
      args: [accountId, incomeId, paidDate, id],
    });
    return result.rows.length ? mapRow<Payable>(result.rows[0]) : null;
  }

  async findPendingByPayee(payeeId: number): Promise<Payable[]> {
    const result = await this.db.execute({
      sql: `SELECT p.*, a.name as account_name, pt.name as payable_type_name, py.name as payee_name
            FROM payables p
            LEFT JOIN accounts a ON p.account_id = a.id
            LEFT JOIN payable_types pt ON p.payable_type_id = pt.id
            LEFT JOIN payees py ON p.payee_id = py.id
            WHERE p.payee_id = ? AND p.status = 'pending'
            ORDER BY p.created_at ASC`,
      args: [payeeId],
    });
    return mapRows<Payable>(result.rows);
  }

  async updateAmountPaid(
    id: number,
    amountPaid: number,
    status: "pending" | "paid",
    accountId?: number,
    incomeId?: number,
    paidDate?: string
  ): Promise<Payable | null> {
    const result = await this.db.execute({
      sql: `UPDATE payables
            SET amount_paid = ?, status = ?, account_id = COALESCE(?, account_id),
                income_id = COALESCE(?, income_id), paid_date = COALESCE(?, paid_date),
                updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [amountPaid, status, accountId ?? null, incomeId ?? null, paidDate ?? null, id],
    });
    return result.rows.length ? mapRow<Payable>(result.rows[0]) : null;
  }

  async sumPending(): Promise<number> {
    const result = await this.db.execute({
      sql: "SELECT COALESCE(SUM(amount - amount_paid), 0) as total FROM payables WHERE status = 'pending'",
      args: [],
    });
    return Number(result.rows[0]?.total ?? 0);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM payables WHERE id = ? AND status = 'pending'",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
