import { useState, useEffect, useCallback } from "react";
import { healthReportsApi } from "../api/health.api";
import type { FollowUpDue } from "../types";

export function useFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUpDue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthReportsApi.getFollowUps();
      setFollowUps(data);
    } catch {
      setError("Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { followUps, loading, error, refetch: fetch };
}
