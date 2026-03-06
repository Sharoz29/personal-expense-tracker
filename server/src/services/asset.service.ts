import { AssetRepository } from "../repositories/asset.repository.js";
import type { CreateAssetDto, UpdateAssetDto } from "../types/index.js";

const repo = new AssetRepository();

export class AssetService {
  async getAll() { return repo.findAll(); }
  async create(dto: CreateAssetDto) { return repo.create(dto); }
  async update(id: number, dto: UpdateAssetDto) { return repo.update(id, dto); }
  async delete(id: number) { return repo.delete(id); }
}
