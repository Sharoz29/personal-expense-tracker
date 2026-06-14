import api from "./client";
import type { Income } from "../types";

interface CreateIncomePayload {
  income_source_id: number;
  account_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  installment_plan_id?: number;
  reference_number?: string;
}

export const incomesApi = {
  getByMonthYear: async (month: number, year: number): Promise<Income[]> => {
    const res = await api.get("/incomes", { params: { month, year } });
    return res.data.data;
  },
  create: async (data: CreateIncomePayload): Promise<Income> => {
    const res = await api.post("/incomes", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateIncomePayload): Promise<Income> => {
    const res = await api.put(`/incomes/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/incomes/${id}`);
  },
  getByInstallmentPlanId: async (installmentPlanId: number): Promise<Income[]> => {
    const res = await api.get("/incomes/by-installment-plan", { params: { installmentPlanId } });
    return res.data.data;
  },
  getInstallmentTotals: async (): Promise<{ account_id: number; total: number }[]> => {
    const res = await api.get("/incomes/installment-totals");
    return res.data.data;
  },
  getSummary: async (month: number, year: number): Promise<number> => {
    const res = await api.get("/incomes/summary", { params: { month, year } });
    return res.data.data.total;
  },
};
