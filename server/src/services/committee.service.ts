import { CommitteeRepository } from "../repositories/committee.repository.js";
import type { CreateCommitteeDto, UpdateCommitteeDto } from "../types/index.js";

const repo = new CommitteeRepository();

export class CommitteeService {
  async getAll() { return repo.findAll(); }
  async create(dto: CreateCommitteeDto) { return repo.create(dto); }
  async update(id: number, dto: UpdateCommitteeDto) { return repo.update(id, dto); }
  async delete(id: number) { return repo.delete(id); }
}
