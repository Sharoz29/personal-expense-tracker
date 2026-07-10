import { useState, useEffect, useCallback } from "react";
import { mutualFundTransactionsApi } from "../api/mutual-fund-transactions.api";
import type { CreateMutualFundTransactionPayload } from "../api/mutual-fund-transactions.api";
import type { MutualFundTransaction } from "../types";

export function useMutualFundTransactions() {
  const [transactions, setTransactions] = useState<MutualFundTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutualFundTransactionsApi.getAll();
      setTransactions(data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateMutualFundTransactionPayload) => {
    const created = await mutualFundTransactionsApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateMutualFundTransactionPayload) => {
    const updated = await mutualFundTransactionsApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await mutualFundTransactionsApi.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalInvested = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalNetInvested = transactions.reduce((sum, t) => sum + t.net_invested_amount, 0);
  const totalFees = transactions.reduce(
    (sum, t) => sum + t.front_end_load_amount + t.back_end_load_amount + t.other_fees_amount,
    0
  );
  const totalUnits = transactions.reduce((sum, t) => sum + t.units_allocated, 0);

  return {
    transactions, loading, error,
    totalInvested, totalNetInvested, totalFees, totalUnits,
    create, update, remove, refetch: fetch,
  };
}
