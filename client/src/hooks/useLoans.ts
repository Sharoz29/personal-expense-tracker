import { useState, useEffect, useCallback } from "react";
import { loansApi } from "../api/loans.api";
import { expensesApi } from "../api/expenses.api";
import type { Loan, Expense } from "../types";

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loansApi.getAll();
      setLoans(data);
    } catch {
      setError("Failed to load loans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: { name: string; total_amount: number; description?: string; start_date?: string }) => {
    const created = await loansApi.create(data);
    setLoans((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id: number, data: { name: string; total_amount: number; description?: string; start_date?: string }) => {
    const updated = await loansApi.update(id, data);
    setLoans((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  };

  const remove = async (id: number) => {
    await loansApi.delete(id);
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  const getPayments = async (loanId: number): Promise<Expense[]> => {
    return expensesApi.getByLoanId(loanId);
  };

  return { loans, loading, error, create, update, remove, getPayments, refetch: fetch };
}
