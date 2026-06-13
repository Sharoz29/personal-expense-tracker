import api from "./client";
import type { InstallmentPlan } from "../types";

interface CreateInstallmentPlanPayload {
  name: string;
  total_amount: number;
  buyer_name: string;
  description?: string;
}

export const installmentPlansApi = {
  getAll: async (): Promise<InstallmentPlan[]> => {
    const res = await api.get("/installment-plans");
    return res.data.data;
  },
  create: async (data: CreateInstallmentPlanPayload): Promise<InstallmentPlan> => {
    const res = await api.post("/installment-plans", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateInstallmentPlanPayload): Promise<InstallmentPlan> => {
    const res = await api.put(`/installment-plans/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/installment-plans/${id}`);
  },
};
