import { CommitteeRepository } from "../repositories/committee.repository.js";
import { AccountService } from "./account.service.js";
import type { CreateCommitteeDto, UpdateCommitteeDto, PayCommitteeDto } from "../types/index.js";

const repo = new CommitteeRepository();
const accountService = new AccountService();

export class CommitteeService {
  async getAll() { return repo.findAll(); }
  async create(dto: CreateCommitteeDto) { return repo.create(dto); }
  async update(id: number, dto: UpdateCommitteeDto) { return repo.update(id, dto); }
  async delete(id: number) { return repo.delete(id); }

  async getPayments(committeeId: number) {
    return repo.findPaymentsByCommitteeId(committeeId);
  }

  async getAllPayments() {
    return repo.findAllPayments();
  }

  async payMonth(committeeId: number, dto: PayCommitteeDto) {
    const committee = await repo.findById(committeeId);
    if (!committee) throw new Error("Committee not found");

    if (dto.month_number < 1 || dto.month_number > committee.total_members) {
      throw new Error(`Month number must be between 1 and ${committee.total_members}`);
    }

    const payment = await repo.createPayment(committeeId, dto);

    // Deduct from account
    await accountService.adjustBalance(dto.account_id, -committee.contribution_per_month);

    return payment;
  }

  async undoPayment(paymentId: number) {
    const payment = await repo.deletePayment(paymentId);
    if (!payment) throw new Error("Payment not found");

    // Refund account
    if (payment.account_id) {
      await accountService.adjustBalance(payment.account_id, payment.amount);
    }

    return payment;
  }
}
