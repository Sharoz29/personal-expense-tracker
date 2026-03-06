import { useState, useEffect, useCallback } from "react";
import { savingsCertificatesApi } from "../api/savings-certificates.api";
import type { SavingsCertificate } from "../types";

interface CreateSavingsCertificatePayload {
  certificate_type: string;
  principal_amount: number;
  profit_rate: number;
  purchase_date: string;
  maturity_date: string;
}

export function useSavingsCertificates() {
  const [certificates, setCertificates] = useState<SavingsCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await savingsCertificatesApi.getAll();
      setCertificates(data);
    } catch {
      setError("Failed to load savings certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateSavingsCertificatePayload) => {
    const created = await savingsCertificatesApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateSavingsCertificatePayload) => {
    const updated = await savingsCertificatesApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await savingsCertificatesApi.delete(id);
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const totalInvested = certificates.reduce((sum, c) => sum + c.principal_amount, 0);

  return { certificates, loading, error, totalInvested, create, update, remove, refetch: fetch };
}
