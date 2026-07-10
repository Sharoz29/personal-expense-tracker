import api from "./client";
import type { MutualFund } from "../types";

export interface CreateMutualFundPayload {
  name: string;
  company_id: number;
  category: string;
  risk_level: string;
  front_end_load_value: number;
  front_end_load_type: "percentage" | "fixed";
  back_end_load_value: number;
  back_end_load_type: "percentage" | "fixed";
  other_fees_value: number;
  other_fees_type: "percentage" | "fixed";
}

export const mutualFundsApi = {
  getAll: async (): Promise<MutualFund[]> => {
    const res = await api.get("/mutual-funds");
    return res.data.data;
  },
  create: async (data: CreateMutualFundPayload): Promise<MutualFund> => {
    const res = await api.post("/mutual-funds", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateMutualFundPayload): Promise<MutualFund> => {
    const res = await api.put(`/mutual-funds/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/mutual-funds/${id}`);
  },
};
