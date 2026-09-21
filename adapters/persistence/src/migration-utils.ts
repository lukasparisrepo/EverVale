import { createHash } from "node:crypto";

export function migrationChecksum(sql: string): string {
  return createHash("sha256").update(sql).digest("hex");
}

export function stripTransactionWrapper(sql: string): string {
  return sql
    .replace(/^\s*BEGIN\s*;\s*/i, "")
    .replace(/\s*COMMIT\s*;\s*$/i, "")
    .trim();
}
