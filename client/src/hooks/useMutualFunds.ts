import { useState, useEffect, useCallback } from "react";
import { mutualFundsApi } from "../api/mutual-funds.api";
import type { CreateMutualFundPayload } from "../api/mutual-funds.api";
import type { MutualFund } from "../types";

export function useMutualFunds() {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutualFundsApi.getAll();
      setFunds(data);
    } catch {
      setError("Failed to load mutual funds");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateMutualFundPayload) => {
    const created = await mutualFundsApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateMutualFundPayload) => {
    const updated = await mutualFundsApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await mutualFundsApi.delete(id);
    setFunds((prev) => prev.filter((f) => f.id !== id));
  };

  return { funds, loading, error, create, update, remove, refetch: fetch };
}
