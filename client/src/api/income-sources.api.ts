import api from "./client";
import type { IncomeSource } from "../types";

export const incomeSourcesApi = {
  getAll: async (): Promise<IncomeSource[]> => {
    const res = await api.get("/income-sources");
    return res.data.data;
  },
  create: async (name: string): Promise<IncomeSource> => {
    const res = await api.post("/income-sources", { name });
    return res.data.data;
  },
  update: async (id: number, name: string): Promise<IncomeSource> => {
    const res = await api.put(`/income-sources/${id}`, { name });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/income-sources/${id}`);
  },
};
