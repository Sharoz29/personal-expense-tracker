import { AssetTypeRepository } from "../repositories/asset-type.repository.js";
import type { CreateAssetTypeDto } from "../types/index.js";

const repo = new AssetTypeRepository();

export class AssetTypeService {
  async getAll() { return repo.findAll(); }
  async getById(id: number) { return repo.findById(id); }
  async create(dto: CreateAssetTypeDto) { return repo.create(dto); }
  async update(id: number, dto: CreateAssetTypeDto) { return repo.update(id, dto); }
  async delete(id: number) {
    const inUse = await repo.isInUse(id);
    if (inUse) throw new Error("Cannot delete - type is in use by assets");
    return repo.delete(id);
  }
}
