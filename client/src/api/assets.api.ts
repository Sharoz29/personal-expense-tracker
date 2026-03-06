import api from "./client";
import type { Asset } from "../types";

interface CreateAssetPayload {
  name: string;
  asset_type_id: number;
  current_value: number;
}

export const assetsApi = {
  getAll: async (): Promise<Asset[]> => {
    const res = await api.get("/assets");
    return res.data.data;
  },
  create: async (data: CreateAssetPayload): Promise<Asset> => {
    const res = await api.post("/assets", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateAssetPayload): Promise<Asset> => {
    const res = await api.put(`/assets/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}`);
  },
};
