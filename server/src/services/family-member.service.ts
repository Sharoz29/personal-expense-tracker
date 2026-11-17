import { FamilyMemberRepository } from "../repositories/family-member.repository.js";
import type {
  CreateFamilyMemberDto,
  UpdateFamilyMemberDto,
} from "../types/index.js";

const repo = new FamilyMemberRepository();

export class FamilyMemberService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: number) {
    return repo.findById(id);
  }

  async create(dto: CreateFamilyMemberDto) {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateFamilyMemberDto) {
    return repo.update(id, dto);
  }

  async delete(id: number) {
    return repo.delete(id);
  }
}
