import api from "./client";
import type { ExpenseType } from "../types";

export const expenseTypesApi = {
  getAll: async (): Promise<ExpenseType[]> => {
    const res = await api.get("/expense-types");
    return res.data.data;
  },
  create: async (name: string): Promise<ExpenseType> => {
    const res = await api.post("/expense-types", { name });
    return res.data.data;
  },
  update: async (id: number, name: string): Promise<ExpenseType> => {
    const res = await api.put(`/expense-types/${id}`, { name });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/expense-types/${id}`);
  },
};
