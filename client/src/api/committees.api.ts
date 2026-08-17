import api from "./client";
import type { Committee, CommitteePayment } from "../types";

export interface CreateCommitteePayload {
  name: string;
  total_members: number;
  contribution_per_month: number;
  my_month: number;
  start_date: string;
  account_id?: number;
}

export interface PayCommitteePayload {
  month_number: number;
  account_id: number;
  payment_date: string;
}

export const committeesApi = {
  getAll: async (): Promise<{ data: Committee[]; payments: CommitteePayment[] }> => {
    const res = await api.get("/committees");
    return { data: res.data.data, payments: res.data.payments };
  },
  create: async (data: CreateCommitteePayload): Promise<Committee> => {
    const res = await api.post("/committees", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateCommitteePayload): Promise<Committee> => {
    const res = await api.put(`/committees/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/committees/${id}`);
  },
  payMonth: async (id: number, data: PayCommitteePayload): Promise<CommitteePayment> => {
    const res = await api.post(`/committees/${id}/pay`, data);
    return res.data.data;
  },
  undoPayment: async (paymentId: number): Promise<void> => {
    await api.delete(`/committees/payments/${paymentId}`);
  },
};
