import api from "./client";
import type { DashboardSummary, MonthlySavingsRecord, AnnualSummary } from "../types";

export const dashboardApi = {
  getSummary: async (month: number, year: number): Promise<DashboardSummary> => {
    const res = await api.get("/dashboard/summary", { params: { month, year } });
    return res.data.data;
  },

  getSavingsHistory: async (): Promise<MonthlySavingsRecord[]> => {
    const res = await api.get("/dashboard/savings-history");
    return res.data.data;
  },

  getAnnualSummary: async (year: number): Promise<AnnualSummary> => {
    const res = await api.get("/dashboard/annual-summary", { params: { year } });
    return res.data.data;
  },
};
