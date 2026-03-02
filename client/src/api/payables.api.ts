import api from "./client";
import type { Payable } from "../types";

interface CreatePayablePayload {
  description: string;
  amount: number;
  from_person: string;
  due_date?: string;
}

export const payablesApi = {
  getAll: async (): Promise<Payable[]> => {
    const res = await api.get("/payables");
    return res.data.data;
  },
  create: async (data: CreatePayablePayload): Promise<Payable> => {
    const res = await api.post("/payables", data);
    return res.data.data;
  },
  update: async (id: number, data: CreatePayablePayload): Promise<Payable> => {
    const res = await api.put(`/payables/${id}`, data);
    return res.data.data;
  },
  markPaid: async (id: number, accountId: number): Promise<Payable> => {
    const res = await api.post(`/payables/${id}/mark-paid`, { account_id: accountId });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/payables/${id}`);
  },
};
