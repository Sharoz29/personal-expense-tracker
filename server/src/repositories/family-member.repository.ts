import { getDb } from "../config/db.js";
import { mapRow, mapRows } from "./base.repository.js";
import type {
  FamilyMember,
  CreateFamilyMemberDto,
  UpdateFamilyMemberDto,
} from "../types/index.js";

export class FamilyMemberRepository {
  private db = getDb();

  async findAll(): Promise<FamilyMember[]> {
    const result = await this.db.execute(
      "SELECT * FROM family_members ORDER BY name"
    );
    return mapRows<FamilyMember>(result.rows);
  }

  async findById(id: number): Promise<FamilyMember | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM family_members WHERE id = ?",
      args: [id],
    });
    return result.rows.length ? mapRow<FamilyMember>(result.rows[0]) : null;
  }

  async create(dto: CreateFamilyMemberDto): Promise<FamilyMember> {
    const result = await this.db.execute({
      sql: `INSERT INTO family_members (name, relationship, date_of_birth)
            VALUES (?, ?, ?) RETURNING *`,
      args: [dto.name, dto.relationship, dto.date_of_birth ?? null],
    });
    return mapRow<FamilyMember>(result.rows[0]);
  }

  async update(
    id: number,
    dto: UpdateFamilyMemberDto
  ): Promise<FamilyMember | null> {
    const result = await this.db.execute({
      sql: `UPDATE family_members
            SET name = ?, relationship = ?, date_of_birth = ?, updated_at = datetime('now')
            WHERE id = ? RETURNING *`,
      args: [dto.name, dto.relationship, dto.date_of_birth ?? null, id],
    });
    return result.rows.length ? mapRow<FamilyMember>(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.execute({
      sql: "DELETE FROM family_members WHERE id = ?",
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}
