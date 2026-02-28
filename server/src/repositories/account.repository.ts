import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  AccountTransfer,
  CreateAccountTransferDto,
} from "../types/index.js";

export class AccountRepository {
  private db = getDb();

  async findAll(): Promise<Account[]> {
    const result = await this.db.execute(
      "SELECT * FROM accounts ORDER BY name"
    );
    return mapRows<Account>(result.rows);
  }

  async findById(id: number): Promise<Account | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM accounts WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<Account>(result.rows[0]) : null;
  }

  async create(dto: CreateAccountDto): Promise<Account> {
    const result = await this.db.execute({
      sql: `INSERT INTO accounts (name, account_number, balance)
            VALUES (?, ?, ?) RETURNING *`,
      args: [dto.name, dto.account_number, dto.balance],
    });
    return mapRow<Account>(result.rows[0]);
  }

  async update(id: number, dto: UpdateAccountDto): Promise<Account | null> {
    const result = await this.db.execute({
      sql: `UPDATE accounts
            SET name = ?, account_number = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, dto.account_number, id],
    });
    return result.rows.length ? mapRow<Account>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM accounts WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async updateBalance(id: number, delta: number): Promise<void> {
    await this.db.execute({
      sql: `UPDATE accounts SET balance = balance + ?, updated_at = datetime('now') WHERE id = ?`,
      args: [delta, id],
    });
  }

  // ---- Transfers ----

  async findAllTransfers(): Promise<AccountTransfer[]> {
    const result = await this.db.execute(
      `SELECT t.*,
              fa.name as from_account_name,
              ta.name as to_account_name
       FROM account_transfers t
       JOIN accounts fa ON t.from_account_id = fa.id
       JOIN accounts ta ON t.to_account_id = ta.id
       ORDER BY t.date DESC, t.created_at DESC`
    );
    return mapRows<AccountTransfer>(result.rows);
  }

  async createTransfer(dto: CreateAccountTransferDto): Promise<AccountTransfer> {
    const result = await this.db.execute({
      sql: `INSERT INTO account_transfers (from_account_id, to_account_id, amount, description, date)
            VALUES (?, ?, ?, ?, ?) RETURNING *`,
      args: [dto.from_account_id, dto.to_account_id, dto.amount, dto.description, dto.date],
    });
    return mapRow<AccountTransfer>(result.rows[0]);
  }
}
