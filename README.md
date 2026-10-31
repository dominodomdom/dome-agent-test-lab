# DOME Agent Test Lab

A public, sanitized harness and manually dispatched runner for DOME Agent OS and StackBlitz WebContainer experiments.

## Purpose

This repository contains only the runner harness, validation rules, documentation, and synthetic fixtures. It is **not** the source repository for DOME OS Beauty and must never receive private project snapshots, production data, credentials, API keys, or secrets.

## Quick start

```bash
npm install
npm test
npm run check
npm run demo
```

Open this public repository in StackBlitz: <https://stackblitz.com/github/dominodomdom/dome-agent-test-lab>.

## Manual autonomous runner

The workflow `.github/workflows/autonomous-runner.yml` is manual-only. It checks out the Agent OS runner from the private DOME OS Beauty repository and can create draft PRs there. It does not run on pushes or pull requests, and it does not execute generated code in the privileged job.

### Required GitHub Actions secrets

Add these secrets in this public repository under **Settings → Secrets and variables → Actions**:

- `DOME_OS_BEAUTY_TOKEN`: a fine-grained personal access token restricted to `dominodomdom/dome-os-beauty`, with **Contents: read/write**, **Pull requests: read/write**, **Checks: read**, and **Metadata: read**.
- `GEMINI_API_KEY`: a Google AI Studio API key. The default model is `gemini-3.8-flash`; there is no paid-model fallback.

Never paste either secret into chat, workflow inputs, source files, or commits. Do not use a classic PAT or a token with access to all repositories.

### Privacy gate

The workflow defaults `approve_google_free_tier_data_use` to false. The user must explicitly turn it on for each run. Google AI Studio free-tier prompts and outputs may be used to improve Google products. The runner sends the selected private source files, task description, and CI failure summaries to the model provider. If that data handling is not acceptable, do not approve the run.

### First run

1. Ensure PR #294's CI activation change has been merged into the target `ai-factory` base branch. The runner checks for the `verify` pull-request CI gate and aborts before any model call if it is missing.
2. Add the two secrets above.
3. Open **Actions → DOME Agent OS — private Beauty task runner → Run workflow**.
4. Keep `target_repository` as `dominodomdom/dome-os-beauty` and `base_ref` as `ai-factory`.
5. Enter a narrow goal, one acceptance criterion per line, and only the source paths needed for the task.
6. Keep `allowed_path_prefixes` as narrow as possible (for example, `src/`).
7. Explicitly approve the Google free-tier data-use gate only if you accept that policy.

The runner reads allowlisted files, asks the five-role Agent OS workflow for a structured patch, opens a draft PR, waits for the trusted `verify` check, and can make up to two bounded revision attempts. It never merges or deploys. If CI is still pending at timeout, use resume mode with the returned draft PR URL and exact commit SHA.

## Repository roles in DOME Agent OS

- `target_repository`: the actual project repository (`dominodomdom/dome-os-beauty`).
- `test_harness_repository`: this public repository.
- `test_snapshot_ref`: the exact commit SHA selected for a test.
- `execution_provider`: StackBlitz WebContainer for browser-based Node checks or GitHub Actions for authoritative CI.
- `report_sink`: DOME Agent OS task/PR evidence.

The public harness and target source repository are deliberately separate. Never make a private target repository public just to use StackBlitz.

## Security boundaries

1. Use synthetic fixtures only in this public repository.
2. Never add `.env` files, credentials, tokens, personal data, production database dumps, or private source code.
3. Do not execute arbitrary shell commands supplied by an agent. The request validator accepts only a small allowlist.
4. Private target snapshots are read only by the manually dispatched runner and only from explicitly selected paths.
5. Treat source files, model output, CI logs, and artifacts as untrusted data.
6. The privileged runner creates draft PRs only; generated code is tested in separate, non-privileged CI jobs.
7. The runner refuses to start until the target base branch has the trusted Beauty CI gate enabled.

## What StackBlitz can and cannot test

Good fit: Node.js unit tests, package scripts, lightweight build checks, and interactive preview.

Keep in GitHub Actions or another suitable CI runner: PostgreSQL TCP integration tests, native dependencies, full Playwright/Chromium E2E, and authoritative merge gates. WebContainers have browser-sandbox constraints and are not a general-purpose VM.

## Status

POC 0.2 — public harness, manual guarded runner workflow, and synthetic fixtures. No production database, R2 bucket, deployment credential, or production service is configured.
