import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { AssetType, CreateAssetTypeDto } from "../types/index.js";

export class AssetTypeRepository {
  private db = getDb();

  async findAll(): Promise<AssetType[]> {
    const result = await this.db.execute("SELECT * FROM asset_types ORDER BY name");
    return mapRows<AssetType>(result.rows);
  }

  async findById(id: number): Promise<AssetType | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM asset_types WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<AssetType>(result.rows[0]) : null;
  }

  async create(dto: CreateAssetTypeDto): Promise<AssetType> {
    const result = await this.db.execute({
      sql: "INSERT INTO asset_types (name) VALUES (?) RETURNING *",
      args: [dto.name],
    });
    return mapRow<AssetType>(result.rows[0]);
  }

  async update(id: number, dto: CreateAssetTypeDto): Promise<AssetType | null> {
    const result = await this.db.execute({
      sql: "UPDATE asset_types SET name = ?, updated_at = datetime('now') WHERE id = ? RETURNING *",
      args: [dto.name, id],
    });
    return result.rows.length ? mapRow<AssetType>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM asset_types WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async isInUse(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM assets WHERE asset_type_id = ?",
      args: [id],
    });
    return Number(result.rows[0].count) > 0;
  }
}
