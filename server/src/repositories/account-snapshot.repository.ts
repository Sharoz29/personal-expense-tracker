import { getDb } from "../config/db.js";
import { mapRows } from "./base.repository.js";
import type { Account, MonthlyDelta } from "../types/index.js";

export class AccountSnapshotRepository {
  private db = getDb();

  async getAllAccounts(): Promise<Account[]> {
    const result = await this.db.execute(
      "SELECT * FROM accounts ORDER BY name"
    );
    return mapRows<Account>(result.rows);
  }

  async getMonthlyDeltas(): Promise<MonthlyDelta[]> {
    const result = await this.db.execute(`
      SELECT account_id, month, year, SUM(delta) as delta
      FROM (
        SELECT account_id, month, year, -SUM(amount) as delta
        FROM expenses
        GROUP BY account_id, month, year

        UNION ALL

        SELECT account_id, month, year, SUM(amount) as delta
        FROM incomes
        GROUP BY account_id, month, year

        UNION ALL

        SELECT from_account_id as account_id,
               CAST(strftime('%m', date) AS INTEGER) as month,
               CAST(strftime('%Y', date) AS INTEGER) as year,
               -SUM(amount) as delta
        FROM account_transfers
        GROUP BY from_account_id,
                 CAST(strftime('%m', date) AS INTEGER),
                 CAST(strftime('%Y', date) AS INTEGER)

        UNION ALL

        SELECT to_account_id as account_id,
               CAST(strftime('%m', date) AS INTEGER) as month,
               CAST(strftime('%Y', date) AS INTEGER) as year,
               SUM(amount) as delta
        FROM account_transfers
        GROUP BY to_account_id,
                 CAST(strftime('%m', date) AS INTEGER),
                 CAST(strftime('%Y', date) AS INTEGER)

        UNION ALL

        SELECT account_id,
               CAST(strftime('%m', created_at) AS INTEGER) as month,
               CAST(strftime('%Y', created_at) AS INTEGER) as year,
               -SUM(current_value) as delta
        FROM assets
        WHERE account_id IS NOT NULL
        GROUP BY account_id,
                 CAST(strftime('%m', created_at) AS INTEGER),
                 CAST(strftime('%Y', created_at) AS INTEGER)

        UNION ALL

        SELECT account_id,
               CAST(strftime('%m', payment_date) AS INTEGER) as month,
               CAST(strftime('%Y', payment_date) AS INTEGER) as year,
               -SUM(amount) as delta
        FROM committee_payments
        WHERE account_id IS NOT NULL
        GROUP BY account_id,
                 CAST(strftime('%m', payment_date) AS INTEGER),
                 CAST(strftime('%Y', payment_date) AS INTEGER)

        UNION ALL

        SELECT account_id,
               CAST(strftime('%m', investment_date) AS INTEGER) as month,
               CAST(strftime('%Y', investment_date) AS INTEGER) as year,
               -SUM(amount) as delta
        FROM mutual_fund_transactions
        WHERE account_id IS NOT NULL
        GROUP BY account_id,
                 CAST(strftime('%m', investment_date) AS INTEGER),
                 CAST(strftime('%Y', investment_date) AS INTEGER)

        UNION ALL

        SELECT account_id,
               CAST(strftime('%m', purchase_date) AS INTEGER) as month,
               CAST(strftime('%Y', purchase_date) AS INTEGER) as year,
               -SUM(principal_amount) as delta
        FROM savings_certificates
        WHERE account_id IS NOT NULL
        GROUP BY account_id,
                 CAST(strftime('%m', purchase_date) AS INTEGER),
                 CAST(strftime('%Y', purchase_date) AS INTEGER)
      ) all_deltas
      GROUP BY account_id, year, month
      ORDER BY account_id, year ASC, month ASC
    `);
    return mapRows<MonthlyDelta>(result.rows);
  }

  async getMonthlyDeltasByAccount(accountId: number): Promise<MonthlyDelta[]> {
    const result = await this.db.execute({
      sql: `
        SELECT account_id, month, year, SUM(delta) as delta
        FROM (
          SELECT account_id, month, year, -SUM(amount) as delta
          FROM expenses WHERE account_id = ?
          GROUP BY account_id, month, year

          UNION ALL

          SELECT account_id, month, year, SUM(amount) as delta
          FROM incomes WHERE account_id = ?
          GROUP BY account_id, month, year

          UNION ALL

          SELECT from_account_id as account_id,
                 CAST(strftime('%m', date) AS INTEGER) as month,
                 CAST(strftime('%Y', date) AS INTEGER) as year,
                 -SUM(amount) as delta
          FROM account_transfers WHERE from_account_id = ?
          GROUP BY from_account_id,
                   CAST(strftime('%m', date) AS INTEGER),
                   CAST(strftime('%Y', date) AS INTEGER)

          UNION ALL

          SELECT to_account_id as account_id,
                 CAST(strftime('%m', date) AS INTEGER) as month,
                 CAST(strftime('%Y', date) AS INTEGER) as year,
                 SUM(amount) as delta
          FROM account_transfers WHERE to_account_id = ?
          GROUP BY to_account_id,
                   CAST(strftime('%m', date) AS INTEGER),
                   CAST(strftime('%Y', date) AS INTEGER)

          UNION ALL

          SELECT account_id,
                 CAST(strftime('%m', created_at) AS INTEGER) as month,
                 CAST(strftime('%Y', created_at) AS INTEGER) as year,
                 -SUM(current_value) as delta
          FROM assets WHERE account_id = ?
          GROUP BY account_id,
                   CAST(strftime('%m', created_at) AS INTEGER),
                   CAST(strftime('%Y', created_at) AS INTEGER)

          UNION ALL

          SELECT account_id,
                 CAST(strftime('%m', payment_date) AS INTEGER) as month,
                 CAST(strftime('%Y', payment_date) AS INTEGER) as year,
                 -SUM(amount) as delta
          FROM committee_payments WHERE account_id = ?
          GROUP BY account_id,
                   CAST(strftime('%m', payment_date) AS INTEGER),
                   CAST(strftime('%Y', payment_date) AS INTEGER)

          UNION ALL

          SELECT account_id,
                 CAST(strftime('%m', investment_date) AS INTEGER) as month,
                 CAST(strftime('%Y', investment_date) AS INTEGER) as year,
                 -SUM(amount) as delta
          FROM mutual_fund_transactions WHERE account_id = ?
          GROUP BY account_id,
                   CAST(strftime('%m', investment_date) AS INTEGER),
                   CAST(strftime('%Y', investment_date) AS INTEGER)

          UNION ALL

          SELECT account_id,
                 CAST(strftime('%m', purchase_date) AS INTEGER) as month,
                 CAST(strftime('%Y', purchase_date) AS INTEGER) as year,
                 -SUM(principal_amount) as delta
          FROM savings_certificates WHERE account_id = ?
          GROUP BY account_id,
                   CAST(strftime('%m', purchase_date) AS INTEGER),
                   CAST(strftime('%Y', purchase_date) AS INTEGER)
        ) all_deltas
        GROUP BY account_id, year, month
        ORDER BY year ASC, month ASC
      `,
      args: [
        accountId, accountId, accountId, accountId,
        accountId, accountId, accountId, accountId,
      ],
    });
    return mapRows<MonthlyDelta>(result.rows);
  }

  async upsertSnapshots(
    snapshots: { account_id: number; month: number; year: number; balance: number }[]
  ): Promise<void> {
    for (const s of snapshots) {
      await this.db.execute({
        sql: `INSERT OR REPLACE INTO account_balance_snapshots (account_id, month, year, balance)
              VALUES (?, ?, ?, ?)`,
        args: [s.account_id, s.month, s.year, Math.round(s.balance * 100) / 100],
      });
    }
  }
}
