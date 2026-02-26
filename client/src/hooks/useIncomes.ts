import { useState, useEffect, useCallback } from "react";
import { incomesApi } from "../api/incomes.api";
import type { Income } from "../types";

interface CreateIncomePayload {
  income_source_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
}

export function useIncomes(month: number, year: number) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incomesApi.getByMonthYear(month, year);
      setIncomes(data);
    } catch {
      setError("Failed to load income");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateIncomePayload) => {
    const created = await incomesApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateIncomePayload) => {
    const updated = await incomesApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await incomesApi.delete(id);
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const total = incomes.reduce((sum, i) => sum + i.amount, 0);

  return { incomes, loading, error, total, create, update, remove, refetch: fetch };
}
