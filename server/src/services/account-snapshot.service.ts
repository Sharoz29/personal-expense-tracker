import { AccountSnapshotRepository } from "../repositories/account-snapshot.repository.js";
import type { AccountSnapshotTrajectory } from "../types/index.js";

const repo = new AccountSnapshotRepository();

export class AccountSnapshotService {
  async getTrajectories(
    accountId?: number
  ): Promise<AccountSnapshotTrajectory[]> {
    const [accounts, deltas] = await Promise.all([
      repo.getAllAccounts(),
      accountId
        ? repo.getMonthlyDeltasByAccount(accountId)
        : repo.getMonthlyDeltas(),
    ]);

    const targetAccounts = accountId
      ? accounts.filter((a) => a.id === accountId)
      : accounts;

    if (targetAccounts.length === 0) {
      return [];
    }

    // Build map: account_id -> Map<"YYYY-MM", delta>
    const deltasByAccount = new Map<number, Map<string, number>>();
    for (const d of deltas) {
      if (!deltasByAccount.has(d.account_id)) {
        deltasByAccount.set(d.account_id, new Map());
      }
      const key = `${d.year}-${String(d.month).padStart(2, "0")}`;
      const accountMap = deltasByAccount.get(d.account_id)!;
      accountMap.set(key, (accountMap.get(key) ?? 0) + Number(d.delta));
    }

    const allSnapshotsForPersistence: {
      account_id: number;
      month: number;
      year: number;
      balance: number;
    }[] = [];
    const result: AccountSnapshotTrajectory[] = [];

    for (const account of targetAccounts) {
      const accountDeltas = deltasByAccount.get(account.id);

      if (!accountDeltas || accountDeltas.size === 0) {
        result.push({
          account_id: account.id,
          account_name: account.name,
          current_balance: Number(account.balance),
          snapshots: [],
        });
        continue;
      }

      // Determine this account's month range
      const sortedKeys = Array.from(accountDeltas.keys()).sort();
      const [firstYear, firstMonth] = sortedKeys[0].split("-").map(Number);
      const [lastYear, lastMonth] = sortedKeys[sortedKeys.length - 1]
        .split("-")
        .map(Number);

      // Generate continuous month range
      const months: { month: number; year: number; key: string }[] = [];
      let y = firstYear;
      let m = firstMonth;
      while (y < lastYear || (y === lastYear && m <= lastMonth)) {
        const key = `${y}-${String(m).padStart(2, "0")}`;
        months.push({ month: m, year: y, key });
        m++;
        if (m > 12) {
          m = 1;
          y++;
        }
      }

      // Walk backwards from current balance
      // End-of-last-active-month = current balance
      // End-of-previous-month = next month's balance - next month's delta
      const snapshots: { month: number; year: number; balance: number }[] = [];
      let runningBalance = Number(account.balance);

      for (let i = months.length - 1; i >= 0; i--) {
        const { month, year, key } = months[i];
        const balance = Math.round(runningBalance * 100) / 100;

        snapshots.unshift({ month, year, balance });
        allSnapshotsForPersistence.push({
          account_id: account.id,
          month,
          year,
          balance,
        });

        // Subtract this month's delta to get end-of-previous-month balance
        const delta = accountDeltas.get(key) ?? 0;
        runningBalance -= delta;
      }

      result.push({
        account_id: account.id,
        account_name: account.name,
        current_balance: Number(account.balance),
        snapshots,
      });
    }

    // Persist to cache table
    if (allSnapshotsForPersistence.length > 0) {
      await repo.upsertSnapshots(allSnapshotsForPersistence);
    }

    return result;
  }
}
