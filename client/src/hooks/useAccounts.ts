import { useState, useEffect, useCallback } from "react";
import { accountsApi } from "../api/accounts.api";
import { incomesApi } from "../api/incomes.api";
import type { Account, AccountTransfer } from "../types";

interface CreateAccountPayload {
  name: string;
  account_number: string;
  balance: number;
}

interface UpdateAccountPayload {
  name: string;
  account_number: string;
  track_installments?: boolean;
}

interface CreateTransferPayload {
  from_account_id: number;
  to_account_id: number;
  amount: number;
  description: string;
  date: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<AccountTransfer[]>([]);
  const [installmentTotals, setInstallmentTotals] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accts, xfers, totals] = await Promise.all([
        accountsApi.getAll(),
        accountsApi.getTransfers(),
        incomesApi.getInstallmentTotals(),
      ]);
      setAccounts(accts);
      setTransfers(xfers);
      const totalsMap: Record<number, number> = {};
      for (const t of totals) {
        totalsMap[t.account_id] = t.total;
      }
      setInstallmentTotals(totalsMap);
    } catch {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateAccountPayload) => {
    const created = await accountsApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: UpdateAccountPayload) => {
    const updated = await accountsApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await accountsApi.delete(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const transfer = async (data: CreateTransferPayload) => {
    const created = await accountsApi.createTransfer(data);
    await fetch();
    return created;
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return { accounts, transfers, installmentTotals, loading, error, totalBalance, create, update, remove, transfer, refetch: fetch };
}
