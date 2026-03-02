import { PayableRepository } from "../repositories/payable.repository.js";
import { IncomeService } from "./income.service.js";
import { getDb } from "../config/db.js";
import type { CreatePayableDto, UpdatePayableDto } from "../types/index.js";

const repo = new PayableRepository();
const incomeService = new IncomeService();

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

  async delete(id: number) {
    return repo.delete(id);
  }
}
