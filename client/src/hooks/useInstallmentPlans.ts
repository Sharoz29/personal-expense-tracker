import { useState, useEffect, useCallback } from "react";
import { installmentPlansApi } from "../api/installment-plans.api";
import { incomesApi } from "../api/incomes.api";
import type { InstallmentPlan, Income } from "../types";

export function useInstallmentPlans() {
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await installmentPlansApi.getAll();
      setPlans(data);
    } catch {
      setError("Failed to load installment plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: { name: string; total_amount: number; buyer_name: string; description?: string }) => {
    const created = await installmentPlansApi.create(data);
    setPlans((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id: number, data: { name: string; total_amount: number; buyer_name: string; description?: string }) => {
    const updated = await installmentPlansApi.update(id, data);
    setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id: number) => {
    await installmentPlansApi.delete(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const getPayments = async (planId: number): Promise<Income[]> => {
    return incomesApi.getByInstallmentPlanId(planId);
  };

  return { plans, loading, error, create, update, remove, getPayments, refetch: fetch };
}
