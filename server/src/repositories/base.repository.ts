import { Row } from "@libsql/client";

export function mapRow<T>(row: Row): T {
  return row as unknown as T;
}

export function mapRows<T>(rows: Row[]): T[] {
  return rows.map((row) => row as unknown as T);
}
