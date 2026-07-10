import api from "./client";
import type { MutualFundTransaction } from "../types";

export interface CreateMutualFundTransactionPayload {
  fund_id: number;
  account_id?: number;
  amount: number;
  nav_at_purchase: number;
  units_allocated: number;
  investment_date: string;
  portal_reflection_date?: string;
  description?: string;
}

export const mutualFundTransactionsApi = {
  getAll: async (): Promise<MutualFundTransaction[]> => {
    const res = await api.get("/mutual-fund-transactions");
    return res.data.data;
  },
  getByFundId: async (fundId: number): Promise<MutualFundTransaction[]> => {
    const res = await api.get(`/mutual-fund-transactions/fund/${fundId}`);
    return res.data.data;
  },
  create: async (data: CreateMutualFundTransactionPayload): Promise<MutualFundTransaction> => {
    const res = await api.post("/mutual-fund-transactions", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateMutualFundTransactionPayload): Promise<MutualFundTransaction> => {
    const res = await api.put(`/mutual-fund-transactions/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/mutual-fund-transactions/${id}`);
  },
};
