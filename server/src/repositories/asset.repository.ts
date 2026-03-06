import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type { Asset, CreateAssetDto, UpdateAssetDto } from "../types/index.js";

export class AssetRepository {
  private db = getDb();

  async findAll(): Promise<Asset[]> {
    const result = await this.db.execute({
      sql: `SELECT a.*, at.name as asset_type_name
            FROM assets a
            JOIN asset_types at ON a.asset_type_id = at.id
            ORDER BY a.created_at DESC`,
      args: [],
    });
    return mapRows<Asset>(result.rows);
  }

  async findById(id: number): Promise<Asset | null> {
    const result = await this.db.execute({
      sql: `SELECT a.*, at.name as asset_type_name
            FROM assets a
            JOIN asset_types at ON a.asset_type_id = at.id
            WHERE a.id = ?`,
      args: [id],
    });
    return result.rows.length ? mapRow<Asset>(result.rows[0]) : null;
  }

  async create(dto: CreateAssetDto): Promise<Asset> {
    const result = await this.db.execute({
      sql: `INSERT INTO assets (name, asset_type_id, current_value)
            VALUES (?, ?, ?) RETURNING *`,
      args: [dto.name, dto.asset_type_id, dto.current_value],
    });
    return mapRow<Asset>(result.rows[0]);
  }

  async update(id: number, dto: UpdateAssetDto): Promise<Asset | null> {
    const result = await this.db.execute({
      sql: `UPDATE assets
            SET name = ?, asset_type_id = ?, current_value = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, dto.asset_type_id, dto.current_value, id],
    });
    return result.rows.length ? mapRow<Asset>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM assets WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
