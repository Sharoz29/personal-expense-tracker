import { useState, useEffect, useCallback } from "react";
import { committeesApi } from "../api/committees.api";
import type { CreateCommitteePayload, PayCommitteePayload } from "../api/committees.api";
import type { Committee, CommitteePayment } from "../types";

export function useCommittees() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [payments, setPayments] = useState<CommitteePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await committeesApi.getAll();
      setCommittees(result.data);
      setPayments(result.payments);
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
    await fetch();
  };

  const payMonth = async (committeeId: number, data: PayCommitteePayload) => {
    const payment = await committeesApi.payMonth(committeeId, data);
    await fetch();
    return payment;
  };

  const undoPayment = async (paymentId: number) => {
    await committeesApi.undoPayment(paymentId);
    await fetch();
  };

  const getPaymentsForCommittee = (committeeId: number) =>
    payments.filter((p) => p.committee_id === committeeId);

  const totalPayout = committees.reduce(
    (sum, c) => sum + c.total_members * c.contribution_per_month,
    0
  );

  return {
    committees, payments, loading, error, totalPayout,
    create, update, remove, payMonth, undoPayment,
    getPaymentsForCommittee, refetch: fetch,
  };
}
