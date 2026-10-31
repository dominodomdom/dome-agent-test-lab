const ALLOWED_PROVIDERS = new Set(["stackblitz-webcontainer", "github-actions"]);
const ALLOWED_COMMANDS = new Set(["npm install", "npm test", "npm run build", "npm run check", "npm run demo"]);
const SHA_PATTERN = /^[a-f0-9]{40}$/i;

export function validateTestRequest(request) {
  const errors = [];

  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return { valid: false, errors: ["request must be an object"] };
  }

  if (request.version !== 1) errors.push("version must be 1");
  if (typeof request.task_id !== "string" || !/^[a-z0-9][a-z0-9._-]{2,63}$/i.test(request.task_id)) {
    errors.push("task_id must be a 3-64 character identifier");
  }
  if (typeof request.target_repository !== "string" || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(request.target_repository)) {
    errors.push("target_repository must use owner/repository format");
  }
  if (typeof request.test_snapshot_ref !== "string" || !SHA_PATTERN.test(request.test_snapshot_ref)) {
    errors.push("test_snapshot_ref must be an immutable 40-character commit SHA");
  }
  if (!ALLOWED_PROVIDERS.has(request.execution_provider)) {
    errors.push("execution_provider is not allowed");
  }
  if (!Array.isArray(request.commands) || request.commands.length === 0) {
    errors.push("commands must be a non-empty array");
  } else {
    for (const command of request.commands) {
      if (!ALLOWED_COMMANDS.has(command)) errors.push(`command is not allowlisted: ${String(command)}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
