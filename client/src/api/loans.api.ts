import api from "./client";
import type { Loan } from "../types";

interface CreateLoanPayload {
  name: string;
  total_amount: number;
  description?: string;
  start_date?: string;
}

export const loansApi = {
  getAll: async (): Promise<Loan[]> => {
    const res = await api.get("/loans");
    return res.data.data;
  },
  create: async (data: CreateLoanPayload): Promise<Loan> => {
    const res = await api.post("/loans", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateLoanPayload): Promise<Loan> => {
    const res = await api.put(`/loans/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/loans/${id}`);
  },
};
