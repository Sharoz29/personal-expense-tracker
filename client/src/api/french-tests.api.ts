import api from "./client";
import type { FrenchTestResult } from "../types";

interface CreateTestResultDto {
  test_name: string;
  test_type: string;
  score: number;
  total_questions: number;
  time_taken_seconds?: number;
  answers_json?: string;
}

export const frenchTestsApi = {
  getAllResults: async (): Promise<FrenchTestResult[]> => {
    const res = await api.get("/french-tests/results");
    return res.data.data;
  },

  getResultById: async (id: number): Promise<FrenchTestResult> => {
    const res = await api.get(`/french-tests/results/${id}`);
    return res.data.data;
  },

  createResult: async (data: CreateTestResultDto): Promise<FrenchTestResult> => {
    const res = await api.post("/french-tests/results", data);
    return res.data.data;
  },

  deleteResult: async (id: number): Promise<void> => {
    await api.delete(`/french-tests/results/${id}`);
  },
};
