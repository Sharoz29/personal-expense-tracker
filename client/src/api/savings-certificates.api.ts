import api from "./client";
import type { SavingsCertificate } from "../types";

interface CreateSavingsCertificatePayload {
  certificate_type: string;
  principal_amount: number;
  profit_rate: number;
  purchase_date: string;
  maturity_date: string;
}

export const savingsCertificatesApi = {
  getAll: async (): Promise<SavingsCertificate[]> => {
    const res = await api.get("/savings-certificates");
    return res.data.data;
  },
  create: async (data: CreateSavingsCertificatePayload): Promise<SavingsCertificate> => {
    const res = await api.post("/savings-certificates", data);
    return res.data.data;
  },
  update: async (id: number, data: CreateSavingsCertificatePayload): Promise<SavingsCertificate> => {
    const res = await api.put(`/savings-certificates/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/savings-certificates/${id}`);
  },
};
