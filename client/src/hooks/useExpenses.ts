import { useState, useEffect, useCallback } from "react";
import { expensesApi } from "../api/expenses.api";
import type { Expense } from "../types";

interface CreateExpensePayload {
  expense_type_id: number;
  account_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
}

export function useExpenses(month: number, year: number) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expensesApi.getByMonthYear(month, year);
      setExpenses(data);
    } catch {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateExpensePayload) => {
    const created = await expensesApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateExpensePayload) => {
    const updated = await expensesApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await expensesApi.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return { expenses, loading, error, total, create, update, remove, refetch: fetch };
}
