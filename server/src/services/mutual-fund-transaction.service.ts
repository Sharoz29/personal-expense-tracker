import { MutualFundTransactionRepository } from "../repositories/mutual-fund-transaction.repository.js";
import { MutualFundRepository } from "../repositories/mutual-fund.repository.js";
import { AccountService } from "./account.service.js";
import type { CreateMutualFundTransactionDto } from "../types/index.js";

const repo = new MutualFundTransactionRepository();
const fundRepo = new MutualFundRepository();
const accountService = new AccountService();

export class MutualFundTransactionService {
  async getAll() { return repo.findAll(); }
  async getByFundId(fundId: number) { return repo.findByFundId(fundId); }

  async create(dto: CreateMutualFundTransactionDto) {
    // Look up fund to get fee structure
    const fund = await fundRepo.findById(dto.fund_id);
    if (!fund) throw new Error("Fund not found");

    // Calculate fees based on fund's structure (skip front-end load for online transactions)
    const frontEndLoad = dto.is_online ? 0
      : fund.front_end_load_type === "percentage"
        ? dto.amount * (fund.front_end_load_value / 100)
        : fund.front_end_load_value;
    const backEndLoad = fund.back_end_load_type === "percentage"
      ? dto.amount * (fund.back_end_load_value / 100)
      : fund.back_end_load_value;
    const otherFees = fund.other_fees_type === "percentage"
      ? dto.amount * (fund.other_fees_value / 100)
      : fund.other_fees_value;
    const netInvestedAmount = dto.amount - frontEndLoad - backEndLoad - otherFees;

    const fees = {
      front_end_load_amount: Math.round(frontEndLoad * 100) / 100,
      back_end_load_amount: Math.round(backEndLoad * 100) / 100,
      other_fees_amount: Math.round(otherFees * 100) / 100,
      net_invested_amount: Math.round(netInvestedAmount * 100) / 100,
    };

    const transaction = await repo.create(dto, fees);

    // Deduct from account (like asset.service.ts does)
    if (dto.account_id) {
      await accountService.adjustBalance(dto.account_id, -dto.amount);
    }

    return transaction;
  }

  async update(id: number, dto: CreateMutualFundTransactionDto) {
    const fund = await fundRepo.findById(dto.fund_id);
    if (!fund) throw new Error("Fund not found");

    const frontEndLoad = dto.is_online ? 0
      : fund.front_end_load_type === "percentage"
        ? dto.amount * (fund.front_end_load_value / 100)
        : fund.front_end_load_value;
    const backEndLoad = fund.back_end_load_type === "percentage"
      ? dto.amount * (fund.back_end_load_value / 100)
      : fund.back_end_load_value;
    const otherFees = fund.other_fees_type === "percentage"
      ? dto.amount * (fund.other_fees_value / 100)
      : fund.other_fees_value;
    const netInvestedAmount = dto.amount - frontEndLoad - backEndLoad - otherFees;

    const fees = {
      front_end_load_amount: Math.round(frontEndLoad * 100) / 100,
      back_end_load_amount: Math.round(backEndLoad * 100) / 100,
      other_fees_amount: Math.round(otherFees * 100) / 100,
      net_invested_amount: Math.round(netInvestedAmount * 100) / 100,
    };

    return repo.update(id, dto, fees);
  }

  async delete(id: number) { return repo.delete(id); }
}
