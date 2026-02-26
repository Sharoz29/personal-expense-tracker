import api from "./client";
import type { DashboardSummary } from "../types";

export const dashboardApi = {
  getSummary: async (month: number, year: number): Promise<DashboardSummary> => {
    const res = await api.get("/dashboard/summary", { params: { month, year } });
    return res.data.data;
  },
};
