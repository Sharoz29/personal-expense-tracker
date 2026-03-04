import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getDb } from "../config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const db = getDb();

  const migrationFiles = [
    "001_initial_schema.sql",
    "002_accounts.sql",
    "003_payables.sql",
    "004_payable_types.sql",
  ];

  for (const file of migrationFiles) {
    const sql = readFileSync(join(__dirname, "migrations", file), "utf-8");

    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const stmt of statements) {
      try {
        await db.execute({ sql: stmt, args: [] });
      } catch (err: any) {
        // Tolerate "duplicate column" errors from re-running ALTER TABLE
        if (err.message?.includes("duplicate column")) continue;
        throw err;
      }
    }
    console.log(`Migration ${file} completed.`);
  }

  console.log("All migrations completed successfully.");
}

migrate().catch(console.error);
