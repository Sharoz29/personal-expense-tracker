import api from "./client";
import type { AccountSnapshotTrajectory } from "../types";

export const accountSnapshotsApi = {
  getAll: async (): Promise<AccountSnapshotTrajectory[]> => {
    const res = await api.get("/account-snapshots");
    return res.data.data;
  },
  getByAccount: async (accountId: number): Promise<AccountSnapshotTrajectory[]> => {
    const res = await api.get(`/account-snapshots?account_id=${accountId}`);
    return res.data.data;
  },
};
