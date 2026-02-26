import api from "./client";
import type { Savings } from "../types";

export const savingsApi = {
  getAll: async (): Promise<Savings[]> => {
    const res = await api.get("/savings");
    return res.data.data;
  },
  getByMonthYear: async (month: number, year: number): Promise<Savings | null> => {
    const res = await api.get("/savings/monthly", { params: { month, year } });
    return res.data.data;
  },
  calculate: async (month: number, year: number): Promise<Savings> => {
    const res = await api.post("/savings/calculate", { month, year });
    return res.data.data;
  },
  update: async (month: number, year: number, amount: number, notes: string): Promise<Savings> => {
    const res = await api.put("/savings", { month, year, amount, notes });
    return res.data.data;
  },
};
