import { useState, useEffect, useCallback } from "react";
import { payableTypesApi } from "../api/payable-types.api";
import type { PayableType } from "../types";

export function usePayableTypes() {
  const [payableTypes, setPayableTypes] = useState<PayableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payableTypesApi.getAll();
      setPayableTypes(data);
    } catch {
      setError("Failed to load payable types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (name: string) => {
    const created = await payableTypesApi.create(name);
    setPayableTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const update = async (id: number, name: string) => {
    const updated = await payableTypesApi.update(id, name);
    setPayableTypes((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const remove = async (id: number) => {
    await payableTypesApi.delete(id);
    setPayableTypes((prev) => prev.filter((t) => t.id !== id));
  };

  return { payableTypes, loading, error, create, update, remove, refetch: fetch };
}
