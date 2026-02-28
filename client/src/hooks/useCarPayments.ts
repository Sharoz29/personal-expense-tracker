import { useState, useEffect, useCallback } from "react";
import { expensesApi } from "../api/expenses.api";
import { useExpenseTypes } from "./useExpenseTypes";
import type { Expense } from "../types";

const CAR_PAYMENT_TYPE = "Car Payment";

interface CreateCarPaymentPayload {
  account_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
}

export function useCarPayments() {
  const [payments, setPayments] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { expenseTypes } = useExpenseTypes();

  const carPaymentTypeId = expenseTypes.find((t) => t.name === CAR_PAYMENT_TYPE)?.id;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expensesApi.getByTypeName(CAR_PAYMENT_TYPE);
      setPayments(data);
    } catch {
      setError("Failed to load car payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateCarPaymentPayload) => {
    if (!carPaymentTypeId) throw new Error("Car Payment type not found");
    const created = await expensesApi.create({ ...data, expense_type_id: carPaymentTypeId });
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateCarPaymentPayload) => {
    if (!carPaymentTypeId) throw new Error("Car Payment type not found");
    const updated = await expensesApi.update(id, { ...data, expense_type_id: carPaymentTypeId });
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await expensesApi.delete(id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return { payments, loading, error, total, create, update, remove, refetch: fetch };
}
