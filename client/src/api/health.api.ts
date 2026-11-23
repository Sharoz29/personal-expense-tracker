import api from "./client";
import type {
  HealthReportCategory,
  HealthMarker,
  HealthReport,
  HealthMarkerHistory,
} from "../types";

interface CreateCategoryPayload {
  name: string;
}

interface CreateMarkerPayload {
  name: string;
  unit: string;
  category_id: number;
  marker_type: "numeric" | "text";
  min_reference?: number | null;
  max_reference?: number | null;
  normal_value?: string | null;
  reference_ranges?: string | null;
}

interface CreateReportResultPayload {
  marker_id: number;
  value?: number | null;
  text_value?: string | null;
}

interface CreateReportPayload {
  family_member_id: number;
  category_id: number;
  report_date: string;
  lab_name?: string;
  notes?: string;
  results: CreateReportResultPayload[];
}

export const healthCategoriesApi = {
  getAll: async (): Promise<HealthReportCategory[]> => {
    const res = await api.get("/health-report-categories");
    return res.data.data;
  },
  create: async (data: CreateCategoryPayload): Promise<HealthReportCategory> => {
    const res = await api.post("/health-report-categories", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateCategoryPayload): Promise<HealthReportCategory> => {
    const res = await api.put(`/health-report-categories/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/health-report-categories/${id}`);
  },
};

export const healthMarkersApi = {
  getAll: async (categoryId?: number): Promise<HealthMarker[]> => {
    const params = categoryId ? `?category_id=${categoryId}` : "";
    const res = await api.get(`/health-markers${params}`);
    return res.data.data;
  },
  create: async (data: CreateMarkerPayload): Promise<HealthMarker> => {
    const res = await api.post("/health-markers", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateMarkerPayload): Promise<HealthMarker> => {
    const res = await api.put(`/health-markers/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/health-markers/${id}`);
  },
};

export const healthReportsApi = {
  getAll: async (filters?: {
    family_member_id?: number;
    category_id?: number;
  }): Promise<HealthReport[]> => {
    const params = new URLSearchParams();
    if (filters?.family_member_id)
      params.set("family_member_id", String(filters.family_member_id));
    if (filters?.category_id)
      params.set("category_id", String(filters.category_id));
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get(`/health-reports${query}`);
    return res.data.data;
  },
  getById: async (id: number): Promise<HealthReport> => {
    const res = await api.get(`/health-reports/${id}`);
    return res.data.data;
  },
  create: async (data: CreateReportPayload): Promise<HealthReport> => {
    const res = await api.post("/health-reports", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateReportPayload): Promise<HealthReport> => {
    const res = await api.put(`/health-reports/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/health-reports/${id}`);
  },
  getHistory: async (
    familyMemberId: number,
    markerId: number
  ): Promise<HealthMarkerHistory[]> => {
    const res = await api.get(
      `/health-reports/history?family_member_id=${familyMemberId}&marker_id=${markerId}`
    );
    return res.data.data;
  },
};
