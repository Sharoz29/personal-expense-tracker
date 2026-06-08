import { useState, useEffect, useCallback } from "react";
import { payeesApi } from "../api/payees.api";
import type { Payee } from "../types";

export function usePayees() {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payeesApi.getAll();
      setPayees(data);
    } catch {
      setError("Failed to load payees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (name: string) => {
    const created = await payeesApi.create(name);
    setPayees((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const update = async (id: number, name: string) => {
    const updated = await payeesApi.update(id, name);
    setPayees((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id: number) => {
    await payeesApi.delete(id);
    setPayees((prev) => prev.filter((p) => p.id !== id));
  };

  return { payees, loading, error, create, update, remove, refetch: fetch };
}
