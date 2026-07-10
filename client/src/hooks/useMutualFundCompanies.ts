import { useState, useEffect, useCallback } from "react";
import { mutualFundCompaniesApi } from "../api/mutual-fund-companies.api";
import type { MutualFundCompany } from "../types";

export function useMutualFundCompanies() {
  const [companies, setCompanies] = useState<MutualFundCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutualFundCompaniesApi.getAll();
      setCompanies(data);
    } catch {
      setError("Failed to load fund companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (name: string) => {
    const created = await mutualFundCompaniesApi.create(name);
    await fetch();
    return created;
  };

  const update = async (id: number, name: string) => {
    const updated = await mutualFundCompaniesApi.update(id, name);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await mutualFundCompaniesApi.delete(id);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  return { companies, loading, error, create, update, remove, refetch: fetch };
}
