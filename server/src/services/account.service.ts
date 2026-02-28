import { AccountRepository } from "../repositories/account.repository.js";
import type {
  CreateAccountDto,
  UpdateAccountDto,
  CreateAccountTransferDto,
} from "../types/index.js";

const repo = new AccountRepository();

export class AccountService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateAccountDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateAccountDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }

  async adjustBalance(accountId: number, delta: number) {
    await repo.updateBalance(accountId, delta);
  }

  async getTransfers() {
    return repo.findAllTransfers();
  }

  async createTransfer(dto: CreateAccountTransferDto) {
    // Deduct from source account
    await repo.updateBalance(dto.from_account_id, -dto.amount);
    // Add to destination account
    await repo.updateBalance(dto.to_account_id, dto.amount);
    // Record the transfer
    return repo.createTransfer(dto);
  }
}
