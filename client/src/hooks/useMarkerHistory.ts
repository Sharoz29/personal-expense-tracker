import { useState, useEffect, useCallback } from "react";
import { healthReportsApi } from "../api/health.api";
import type { HealthMarkerHistory } from "../types";

export function useMarkerHistory(familyMemberId: number, markerId: number) {
  const [history, setHistory] = useState<HealthMarkerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!familyMemberId || !markerId) {
      setHistory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await healthReportsApi.getHistory(familyMemberId, markerId);
      setHistory(data);
    } catch {
      setError("Failed to load marker history");
    } finally {
      setLoading(false);
    }
  }, [familyMemberId, markerId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { history, loading, error, refetch: fetch };
}
