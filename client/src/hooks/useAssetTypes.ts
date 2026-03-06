import { useState, useEffect, useCallback } from "react";
import { assetTypesApi } from "../api/asset-types.api";
import type { AssetType } from "../types";

export function useAssetTypes() {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetTypesApi.getAll();
      setAssetTypes(data);
    } catch {
      setError("Failed to load asset types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (name: string) => {
    const created = await assetTypesApi.create(name);
    setAssetTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const update = async (id: number, name: string) => {
    const updated = await assetTypesApi.update(id, name);
    setAssetTypes((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const remove = async (id: number) => {
    await assetTypesApi.delete(id);
    setAssetTypes((prev) => prev.filter((t) => t.id !== id));
  };

  return { assetTypes, loading, error, create, update, remove, refetch: fetch };
}
