import { SavingsCertificateRepository } from "../repositories/savings-certificate.repository.js";
import { AccountService } from "./account.service.js";
import type { CreateSavingsCertificateDto, UpdateSavingsCertificateDto } from "../types/index.js";

const repo = new SavingsCertificateRepository();
const accountService = new AccountService();

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
}
