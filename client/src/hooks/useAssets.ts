import { useState, useEffect, useCallback } from "react";
import { assetsApi } from "../api/assets.api";
import type { Asset } from "../types";

interface CreateAssetPayload {
  name: string;
  asset_type_id: number;
  current_value: number;
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetsApi.getAll();
      setAssets(data);
    } catch {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateAssetPayload) => {
    const created = await assetsApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateAssetPayload) => {
    const updated = await assetsApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await assetsApi.delete(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const totalValue = assets.reduce((sum, a) => sum + a.current_value, 0);

  return { assets, loading, error, totalValue, create, update, remove, refetch: fetch };
}
