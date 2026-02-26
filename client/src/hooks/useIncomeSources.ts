import { useState, useEffect, useCallback } from "react";
import { incomeSourcesApi } from "../api/income-sources.api";
import type { IncomeSource } from "../types";

export function useIncomeSources() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incomeSourcesApi.getAll();
      setIncomeSources(data);
    } catch {
      setError("Failed to load income sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (name: string) => {
    const created = await incomeSourcesApi.create(name);
    setIncomeSources((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const update = async (id: number, name: string) => {
    const updated = await incomeSourcesApi.update(id, name);
    setIncomeSources((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const remove = async (id: number) => {
    await incomeSourcesApi.delete(id);
    setIncomeSources((prev) => prev.filter((s) => s.id !== id));
  };

  return { incomeSources, loading, error, create, update, remove, refetch: fetch };
}
