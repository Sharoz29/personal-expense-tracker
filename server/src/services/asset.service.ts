import { AssetRepository } from "../repositories/asset.repository.js";
import { AccountService } from "./account.service.js";
import type { CreateAssetDto, UpdateAssetDto } from "../types/index.js";

const repo = new AssetRepository();
const accountService = new AccountService();

export class AssetService {
  async getAll() { return repo.findAll(); }

  async create(dto: CreateAssetDto) {
    const asset = await repo.create(dto);
    if (dto.account_id) {
      await accountService.adjustBalance(dto.account_id, -dto.current_value);
    }
    return asset;
  }

  async update(id: number, dto: UpdateAssetDto) { return repo.update(id, dto); }
  async delete(id: number) { return repo.delete(id); }
}
