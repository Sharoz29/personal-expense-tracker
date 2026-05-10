import { SavingsCertificateRepository } from "../repositories/savings-certificate.repository.js";
import { IncomeSourceRepository } from "../repositories/income-source.repository.js";
import { IncomeService } from "./income.service.js";
import { AccountService } from "./account.service.js";
import type { CreateSavingsCertificateDto, UpdateSavingsCertificateDto } from "../types/index.js";

const repo = new SavingsCertificateRepository();
const incomeSourceRepo = new IncomeSourceRepository();
const incomeService = new IncomeService();
const accountService = new AccountService();

function getPeriodMonths(duration: string): number {
  switch (duration) {
    case "Monthly": return 1;
    case "6 Months": return 6;
    case "1 Year": return 12;
    case "5 Years": return 60;
    case "10 Years": return 120;
    default: return 0;
  }
}

function monthsBetween(from: string, to: string): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

export class SavingsCertificateService {
  async getAll() { return repo.findAll(); }

  async create(dto: CreateSavingsCertificateDto) {
    const cert = await repo.create(dto);
    if (dto.account_id) {
      await accountService.adjustBalance(dto.account_id, -dto.principal_amount);
    }
    return cert;
  }

  async update(id: number, dto: UpdateSavingsCertificateDto) { return repo.update(id, dto); }
  async delete(id: number) { return repo.delete(id); }

  async redeemProfit(id: number, accountId: number) {
    const cert = await repo.findById(id);
    if (!cert) throw new Error("Certificate not found");

    const periodMonths = getPeriodMonths(cert.duration);
    if (periodMonths === 0) throw new Error("Certificate has no duration set");

    const trackingStart = cert.profit_tracking_start_date ?? cert.purchase_date;
    const today = new Date().toISOString().split("T")[0];
    const totalMonthsElapsed = monthsBetween(trackingStart, today);
    const elapsedPeriods = Math.floor(totalMonthsElapsed / periodMonths);

    if (elapsedPeriods <= 0) throw new Error("No profit due yet");

    const periodMultiplier = periodMonths / 12;
    const grossProfitPerPeriod = cert.principal_amount * (cert.profit_rate / 100) * periodMultiplier;
    const taxRate = cert.tax_rate ?? 0;
    const taxPerPeriod = grossProfitPerPeriod * (taxRate / 100);
    const netProfitPerPeriod = grossProfitPerPeriod - taxPerPeriod;
    const totalAmount = netProfitPerPeriod * elapsedPeriods;

    // Find or create "Investment Profit" income source
    let source = await incomeSourceRepo.findByName("Investment Profit");
    if (!source) {
      source = await incomeSourceRepo.create({ name: "Investment Profit" });
    }

    const now = new Date();
    const income = await incomeService.create({
      income_source_id: source.id,
      account_id: accountId,
      amount: Math.round(totalAmount * 100) / 100,
      description: `Profit: ${cert.certificate_type} - ${elapsedPeriods} ${periodMonths === 1 ? "month" : "period"}(s)`,
      date: today,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    // Advance tracking date
    const newTrackingDate = addMonths(trackingStart, elapsedPeriods * periodMonths);
    await repo.updateTrackingDate(id, newTrackingDate);

    return {
      income,
      periods_redeemed: elapsedPeriods,
      amount: Math.round(totalAmount * 100) / 100,
      new_tracking_date: newTrackingDate,
    };
  }
}
