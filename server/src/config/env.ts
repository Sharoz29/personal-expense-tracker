import "dotenv/config";

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "file:local.db",
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN || undefined,
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;
