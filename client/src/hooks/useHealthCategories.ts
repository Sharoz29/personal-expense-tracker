import { useState, useEffect, useCallback } from "react";
import { healthCategoriesApi, healthMarkersApi } from "../api/health.api";
import type { HealthReportCategory } from "../types";

export function useHealthCategories() {
  const [categories, setCategories] = useState<HealthReportCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthCategoriesApi.getAll();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createCategory = async (name: string, follow_up_months?: number | null) => {
    const created = await healthCategoriesApi.create({ name, follow_up_months });
    await fetch();
    return created;
  };

  const updateCategory = async (id: number, name: string, follow_up_months?: number | null) => {
    const updated = await healthCategoriesApi.update(id, { name, follow_up_months });
    await fetch();
    return updated;
  };

  const deleteCategory = async (id: number) => {
    await healthCategoriesApi.delete(id);
    await fetch();
  };

  const createMarker = async (data: {
    name: string; unit: string; category_id: number;
    marker_type: "numeric" | "text";
    min_reference?: number | null; max_reference?: number | null;
    normal_value?: string | null; reference_ranges?: string | null;
  }) => {
    const created = await healthMarkersApi.create(data);
    await fetch();
    return created;
  };

  const updateMarker = async (id: number, data: {
    name: string; unit: string; category_id: number;
    marker_type: "numeric" | "text";
    min_reference?: number | null; max_reference?: number | null;
    normal_value?: string | null; reference_ranges?: string | null;
  }) => {
    const updated = await healthMarkersApi.update(id, data);
    await fetch();
    return updated;
  };

  const createMarkersBatch = async (markers: {
    name: string; unit: string; category_id: number;
    marker_type: "numeric" | "text";
    min_reference?: number | null; max_reference?: number | null;
    normal_value?: string | null; reference_ranges?: string | null;
  }[]) => {
    for (const data of markers) {
      await healthMarkersApi.create(data);
    }
    await fetch();
  };

  const deleteMarker = async (id: number) => {
    await healthMarkersApi.delete(id);
    await fetch();
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createMarker,
    createMarkersBatch,
    updateMarker,
    deleteMarker,
    refetch: fetch,
  };
}
