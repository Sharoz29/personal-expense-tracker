import api from "./client";
import type { Payee } from "../types";

export const payeesApi = {
  getAll: async (): Promise<Payee[]> => {
    const res = await api.get("/payees");
    return res.data.data;
  },
  create: async (name: string): Promise<Payee> => {
    const res = await api.post("/payees", { name });
    return res.data.data;
  },
  update: async (id: number, name: string): Promise<Payee> => {
    const res = await api.put(`/payees/${id}`, { name });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/payees/${id}`);
  },
};
