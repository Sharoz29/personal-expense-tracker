import api from "./client";
import type { AssetType } from "../types";

export const assetTypesApi = {
  getAll: async (): Promise<AssetType[]> => {
    const res = await api.get("/asset-types");
    return res.data.data;
  },
  create: async (name: string): Promise<AssetType> => {
    const res = await api.post("/asset-types", { name });
    return res.data.data;
  },
  update: async (id: number, name: string): Promise<AssetType> => {
    const res = await api.put(`/asset-types/${id}`, { name });
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/asset-types/${id}`);
  },
};
