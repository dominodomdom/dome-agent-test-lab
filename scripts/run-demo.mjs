import { readFile } from "node:fs/promises";
import { validateTestRequest } from "../src/validate-request.mjs";

const requestUrl = new URL("../fixtures/sample-request.json", import.meta.url);
const request = JSON.parse(await readFile(requestUrl, "utf8"));
const validation = validateTestRequest(request);

const report = {
  schema_version: 1,
  task_id: request.task_id,
  status: validation.valid ? "accepted" : "rejected",
  execution_provider: request.execution_provider,
  target_repository: request.target_repository,
  test_snapshot_ref: request.test_snapshot_ref,
  accepted_commands: validation.valid ? request.commands : [],
  errors: validation.errors,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (!validation.valid) process.exitCode = 1;
