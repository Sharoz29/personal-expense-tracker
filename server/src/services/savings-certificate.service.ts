import { SavingsCertificateRepository } from "../repositories/savings-certificate.repository.js";
import type { CreateSavingsCertificateDto, UpdateSavingsCertificateDto } from "../types/index.js";

const repo = new SavingsCertificateRepository();

export class SavingsCertificateService {
  async getAll() { return repo.findAll(); }
  async create(dto: CreateSavingsCertificateDto) { return repo.create(dto); }
  async update(id: number, dto: UpdateSavingsCertificateDto) { return repo.update(id, dto); }
  async delete(id: number) { return repo.delete(id); }
}
