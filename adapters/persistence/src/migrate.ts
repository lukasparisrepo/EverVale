import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";
import { migrationChecksum, stripTransactionWrapper } from "./migration-utils.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL_REQUIRED");
}

const migrationsDir = fileURLToPath(
  new URL("../../../db/migrations/", import.meta.url),
);

const pool = new Pool({ connectionString: DATABASE_URL });
const client = await pool.connect();

try {
  await client.query(
    "SELECT pg_advisory_lock(hashtext($1))",
    ["evervale:schema-migrations"],
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`,
  );

  const files = (await readdir(migrationsDir))
    .filter((file) => /^\d+.*\.sql$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  for (const filename of files) {
    const raw = await readFile(path.join(migrationsDir, filename), "utf8");
    const checksum = migrationChecksum(raw);
    const existing = await client.query<{ checksum: string }>(
      "SELECT checksum FROM schema_migrations WHERE filename = $1",
      [filename],
    );

    const applied = existing.rows[0];
    if (applied) {
      if (applied.checksum !== checksum) {
        throw new Error(`MIGRATION_CHECKSUM_MISMATCH:${filename}`);
      }
      console.info(`[EverVale] migration skip ${filename}`);
      continue;
    }

    const sql = stripTransactionWrapper(raw);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)",
        [filename, checksum],
      );
      await client.query("COMMIT");
      console.info(`[EverVale] migration applied ${filename}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  try {
    await client.query(
      "SELECT pg_advisory_unlock(hashtext($1))",
      ["evervale:schema-migrations"],
    );
  } finally {
    client.release();
    await pool.end();
  }
}
