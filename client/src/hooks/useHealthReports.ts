import { useState, useEffect, useCallback } from "react";
import { healthReportsApi } from "../api/health.api";
import type { HealthReport } from "../types";

interface ReportFilters {
  family_member_id?: number;
  category_id?: number;
}

interface CreateReportResultPayload {
  marker_id: number;
  value: number;
  min_reference?: number | null;
  max_reference?: number | null;
}

interface CreateReportPayload {
  family_member_id: number;
  category_id: number;
  report_date: string;
  lab_name?: string;
  notes?: string;
  results: CreateReportResultPayload[];
}

export function useHealthReports(filters?: ReportFilters) {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthReportsApi.getAll(filters);
      setReports(data);
    } catch {
      setError("Failed to load health reports");
    } finally {
      setLoading(false);
    }
  }, [filters?.family_member_id, filters?.category_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateReportPayload) => {
    const created = await healthReportsApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateReportPayload) => {
    const updated = await healthReportsApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await healthReportsApi.delete(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return { reports, loading, error, create, update, remove, refetch: fetch };
}
