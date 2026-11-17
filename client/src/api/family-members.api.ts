import api from "./client";
import type { FamilyMember } from "../types";

interface CreateFamilyMemberPayload {
  name: string;
  relationship: string;
  date_of_birth?: string;
}

export const familyMembersApi = {
  getAll: async (): Promise<FamilyMember[]> => {
    const res = await api.get("/family-members");
    return res.data.data;
  },
  create: async (data: CreateFamilyMemberPayload): Promise<FamilyMember> => {
    const res = await api.post("/family-members", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateFamilyMemberPayload): Promise<FamilyMember> => {
    const res = await api.put(`/family-members/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/family-members/${id}`);
  },
};
