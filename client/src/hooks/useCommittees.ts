import { useState, useEffect, useCallback } from "react";
import { committeesApi } from "../api/committees.api";
import type { CreateCommitteePayload } from "../api/committees.api";
import type { Committee } from "../types";

export function useCommittees() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await committeesApi.getAll();
      setCommittees(data);
    } catch {
      setError("Failed to load committees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateCommitteePayload) => {
    const created = await committeesApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateCommitteePayload) => {
    const updated = await committeesApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await committeesApi.delete(id);
    setCommittees((prev) => prev.filter((c) => c.id !== id));
  };

  const totalPayout = committees.reduce(
    (sum, c) => sum + c.total_members * c.contribution_per_month,
    0
  );

  return { committees, loading, error, totalPayout, create, update, remove, refetch: fetch };
}
