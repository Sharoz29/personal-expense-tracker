import { useState, useEffect, useCallback } from "react";
import { expenseTypesApi } from "../api/expense-types.api";
import type { ExpenseType } from "../types";

export function useExpenseTypes() {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseTypesApi.getAll();
      setExpenseTypes(data);
    } catch {
      setError("Failed to load expense types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (name: string) => {
    const created = await expenseTypesApi.create(name);
    setExpenseTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const update = async (id: number, name: string) => {
    const updated = await expenseTypesApi.update(id, name);
    setExpenseTypes((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const remove = async (id: number) => {
    await expenseTypesApi.delete(id);
    setExpenseTypes((prev) => prev.filter((t) => t.id !== id));
  };

  return { expenseTypes, loading, error, create, update, remove, refetch: fetch };
}
