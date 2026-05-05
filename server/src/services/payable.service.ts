import { PayableRepository } from "../repositories/payable.repository.js";
import { IncomeService } from "./income.service.js";
import { AccountService } from "./account.service.js";
import { getDb } from "../config/db.js";
import type { CreatePayableDto, UpdatePayableDto } from "../types/index.js";

const repo = new PayableRepository();
const incomeService = new IncomeService();
const accountService = new AccountService();

export class PayableService {
  async getAll() {
    return repo.findAll();
  }

  async create(dto: CreatePayableDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdatePayableDto) {
    return repo.update(id, dto);
  }

  async markPaid(id: number, accountId: number) {
    const payable = await repo.findById(id);
    if (!payable) return null;
    if (payable.status === "paid") {
      throw new Error("Payable is already paid");
    }

    // Look up the "Reimbursement" income source
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id FROM income_sources WHERE name = 'Reimbursement' LIMIT 1",
      args: [],
    });
    if (!result.rows.length) {
      throw new Error("Reimbursement income source not found");
    }
    const reimbursementSourceId = Number(result.rows[0].id);

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Create income entry
    const income = await incomeService.create({
      income_source_id: reimbursementSourceId,
      account_id: accountId,
      amount: payable.amount,
      description: payable.description,
      date: dateStr,
      month,
      year,
    });

    // Mark payable as paid
    return repo.markPaid(id, accountId, income.id, dateStr);
  }

  async receiveLumpSum(fromPerson: string, totalAmount: number, accountId: number) {
    const pendingPayables = await repo.findPendingByPerson(fromPerson);
    if (pendingPayables.length === 0) {
      throw new Error(`No pending payables found from "${fromPerson}"`);
    }

    // Look up the "Reimbursement" income source
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id FROM income_sources WHERE name = 'Reimbursement' LIMIT 1",
      args: [],
    });
    if (!result.rows.length) {
      throw new Error("Reimbursement income source not found");
    }
    const reimbursementSourceId = Number(result.rows[0].id);

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    let remaining = totalAmount;
    const affectedPayables = [];

    for (const payable of pendingPayables) {
      if (remaining <= 0) break;

      const payableRemaining = payable.amount - payable.amount_paid;
      const paymentForThis = Math.min(remaining, payableRemaining);
      const newAmountPaid = payable.amount_paid + paymentForThis;
      const isFullyPaid = newAmountPaid >= payable.amount;

      // Create income entry for this payable's portion
      const income = await incomeService.create({
        income_source_id: reimbursementSourceId,
        account_id: accountId,
        amount: paymentForThis,
        description: `${payable.description} (lump sum)`,
        date: dateStr,
        month,
        year,
      });

      // Update payable
      await repo.updateAmountPaid(
        payable.id,
        newAmountPaid,
        isFullyPaid ? "paid" : "pending",
        accountId,
        income.id,
        isFullyPaid ? dateStr : undefined
      );

      affectedPayables.push({
        id: payable.id,
        description: payable.description,
        amount: payable.amount,
        amount_paid: newAmountPaid,
        payment_applied: paymentForThis,
        status: isFullyPaid ? "paid" as const : "pending" as const,
      });

      remaining -= paymentForThis;
    }

    return {
      total_received: totalAmount,
      total_applied: totalAmount - remaining,
      remaining_unused: remaining,
      affected_payables: affectedPayables,
    };
  }

  async delete(id: number) {
    return repo.delete(id);
  }
}
