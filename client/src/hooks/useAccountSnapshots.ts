import { useState, useEffect, useCallback } from "react";
import { accountSnapshotsApi } from "../api/account-snapshots.api";
import type { AccountSnapshotTrajectory } from "../types";

export function useAccountSnapshots() {
  const [trajectories, setTrajectories] = useState<AccountSnapshotTrajectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountSnapshotsApi.getAll();
      setTrajectories(data);
    } catch {
      setError("Failed to load balance history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { trajectories, loading, error, refetch: fetch };
}
