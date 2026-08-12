import api from "./client";
import type { Committee } from "../types";

export interface CreateCommitteePayload {
  name: string;
  total_members: number;
  contribution_per_month: number;
  my_month: number;
  start_date: string;
  account_id?: number;
}

export const committeesApi = {
  getAll: async (): Promise<Committee[]> => {
    const res = await api.get("/committees");
    return res.data.data;
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
};
