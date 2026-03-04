import api from "./client";
import type { PayableType } from "../types";

export const payableTypesApi = {
  getAll: async (): Promise<PayableType[]> => {
    const res = await api.get("/payable-types");
    return res.data.data;
  },
  create: async (name: string): Promise<PayableType> => {
    const res = await api.post("/payable-types", { name });
    return res.data.data;
  },
  update: async (id: number, name: string): Promise<PayableType> => {
    const res = await api.put(`/payable-types/${id}`, { name });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/payable-types/${id}`);
  },
};
