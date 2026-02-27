import api from "./client";
import type { Expense } from "../types";

interface CreateExpensePayload {
  expense_type_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
}

export const expensesApi = {
  getByMonthYear: async (month: number, year: number): Promise<Expense[]> => {
    const res = await api.get("/expenses", { params: { month, year } });
    return res.data.data;
  },
  create: async (data: CreateExpensePayload): Promise<Expense> => {
    const res = await api.post("/expenses", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateExpensePayload): Promise<Expense> => {
    const res = await api.put(`/expenses/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
  getByTypeName: async (typeName: string): Promise<Expense[]> => {
    const res = await api.get("/expenses/by-type", { params: { typeName } });
    return res.data.data;
  },
  getSummary: async (month: number, year: number): Promise<number> => {
    const res = await api.get("/expenses/summary", { params: { month, year } });
    return res.data.data.total;
  },
};
