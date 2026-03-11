import { useState, useEffect, useCallback } from "react";
import { payablesApi } from "../api/payables.api";
import type { Payable } from "../types";

interface CreatePayablePayload {
  description: string;
  amount: number;
  from_person: string;
  due_date?: string;
  payable_type_id?: number;
  status?: "pending" | "paid";
  account_id?: number;
  paid_date?: string;
}

export function usePayables() {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payablesApi.getAll();
      setPayables(data);
    } catch {
      setError("Failed to load payables");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreatePayablePayload) => {
    const created = await payablesApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreatePayablePayload) => {
    const updated = await payablesApi.update(id, data);
    await fetch();
    return updated;
  };

  const markPaid = async (id: number, accountId: number) => {
    const updated = await payablesApi.markPaid(id, accountId);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await payablesApi.delete(id);
    setPayables((prev) => prev.filter((p) => p.id !== id));
  };

  const totalPending = payables
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return { payables, loading, error, totalPending, create, update, markPaid, remove, refetch: fetch };
}
