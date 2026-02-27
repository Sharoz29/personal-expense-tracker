import { useState, useEffect, useCallback } from "react";
import { savingsApi } from "../api/savings.api";
import type { Savings } from "../types";

export function useSavings() {
  const [savings, setSavings] = useState<Savings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await savingsApi.getAll();
      setSavings(data);
    } catch {
      setError("Failed to load savings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const calculate = async (month: number, year: number) => {
    const result = await savingsApi.calculate(month, year);
    await fetch();
    return result;
  };

  const update = async (month: number, year: number, amount: number, notes: string) => {
    const result = await savingsApi.update(month, year, amount, notes);
    await fetch();
    return result;
  };

  const create = async (month: number, year: number, amount: number, notes: string) => {
    const result = await savingsApi.update(month, year, amount, notes);
    await fetch();
    return result;
  };

  return { savings, loading, error, calculate, update, create, refetch: fetch };
}
