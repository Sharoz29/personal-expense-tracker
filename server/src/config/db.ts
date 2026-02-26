import { createClient, Client } from "@libsql/client";
import { env } from "./env.js";

let client: Client;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
  }
  return client;
}
