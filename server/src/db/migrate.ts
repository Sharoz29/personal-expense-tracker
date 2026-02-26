import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getDb } from "../config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const db = getDb();
  const sql = readFileSync(
    join(__dirname, "migrations", "001_initial_schema.sql"),
    "utf-8"
  );

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  await db.batch(statements.map((sql) => ({ sql, args: [] })));
  console.log("Migration completed successfully.");
}

migrate().catch(console.error);
