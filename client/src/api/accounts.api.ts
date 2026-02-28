import api from "./client";
import type { Account, AccountTransfer } from "../types";

interface CreateAccountPayload {
  name: string;
  account_number: string;
  balance: number;
}

interface UpdateAccountPayload {
  name: string;
  account_number: string;
}

interface CreateTransferPayload {
  from_account_id: number;
  to_account_id: number;
  amount: number;
  description: string;
  date: string;
}

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const res = await api.get("/accounts");
    return res.data.data;
  },
  getById: async (id: number): Promise<Account> => {
    const res = await api.get(`/accounts/${id}`);
    return res.data.data;
  },
  create: async (data: CreateAccountPayload): Promise<Account> => {
    const res = await api.post("/accounts", data);
    return res.data.data;
  },
  update: async (id: number, data: UpdateAccountPayload): Promise<Account> => {
    const res = await api.put(`/accounts/${id}`, data);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
  getTransfers: async (): Promise<AccountTransfer[]> => {
    const res = await api.get("/accounts/transfers");
    return res.data.data;
  },
  createTransfer: async (data: CreateTransferPayload): Promise<AccountTransfer> => {
    const res = await api.post("/accounts/transfers", data);
    return res.data.data;
  },
};
