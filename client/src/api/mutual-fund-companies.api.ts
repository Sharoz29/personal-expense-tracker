import api from "./client";
import type { MutualFundCompany } from "../types";

export const mutualFundCompaniesApi = {
  getAll: async (): Promise<MutualFundCompany[]> => {
    const res = await api.get("/mutual-fund-companies");
    return res.data.data;
  },
  create: async (name: string): Promise<MutualFundCompany> => {
    const res = await api.post("/mutual-fund-companies", { name });
    return res.data.data;
  },
  update: async (id: number, name: string): Promise<MutualFundCompany> => {
    const res = await api.put(`/mutual-fund-companies/${id}`, { name });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/mutual-fund-companies/${id}`);
  },
};
