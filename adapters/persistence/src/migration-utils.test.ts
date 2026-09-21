import assert from "node:assert/strict";
import test from "node:test";
import { migrationChecksum, stripTransactionWrapper } from "./migration-utils.js";

test("stripTransactionWrapper removes one outer BEGIN/COMMIT pair", () => {
  const sql = "BEGIN;\nCREATE TABLE demo(id int);\nCOMMIT;\n";
  assert.equal(stripTransactionWrapper(sql), "CREATE TABLE demo(id int);");
});

test("migrationChecksum is stable and content-sensitive", () => {
  const a = migrationChecksum("CREATE TABLE a(id int);");
  const b = migrationChecksum("CREATE TABLE a(id int);");
  const c = migrationChecksum("CREATE TABLE b(id int);");
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a.length, 64);
});
