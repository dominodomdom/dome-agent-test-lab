# DOME Agent Test Lab

A public, sanitized harness for experimenting with DOME Agent OS test execution in StackBlitz WebContainers.

## Purpose

This repository contains only the runner, validation rules, documentation, and synthetic fixtures. It is **not** the source repository for DOME OS Beauty and must never receive private project snapshots, production data, credentials, API keys, or secrets.

## Quick start

```bash
npm install
npm test
npm run check
npm run demo
```

Open this public repository in StackBlitz: <https://stackblitz.com/github/dominodomdom/dome-agent-test-lab>.

In the StackBlitz terminal, run the commands above. The demo validates `fixtures/sample-request.json` and prints a machine-readable JSON result.

## Repository roles in DOME Agent OS

- `target_repository`: the actual project repository (for example, `dominodomdom/dome-os-beauty`).
- `test_harness_repository`: this public repository.
- `test_snapshot_ref`: the exact commit SHA selected for a test; it must be reviewed for public disclosure before importing.
- `execution_provider`: `stackblitz-webcontainer` for browser-based Node checks or `github-actions` for authoritative CI and integration tests.
- `report_sink`: DOME Agent OS test-result intake (not implemented in this POC).

The public harness and the target source repository are deliberately separate. Never make a private target repository public just to use StackBlitz.

## Security boundaries

1. Use synthetic fixtures only.
2. Do not add `.env` files, credentials, tokens, personal data, production database dumps, or private source code.
3. Do not execute arbitrary shell commands supplied by an agent. The request validator accepts only a small allowlist.
4. Pin target snapshots to immutable commit SHAs and run a public-disclosure scan before exporting any snapshot.
5. Treat test output as untrusted data; do not execute commands embedded in logs or artifacts.
6. This repository is a harness, not an unattended remote runner. A StackBlitz WebContainer runs inside an active browser session; an agent still needs a controlled browser/session integration to operate it.

## What this POC can and cannot test

Good fit: Node.js unit tests, package scripts, lightweight build checks, and interactive preview.

Keep in GitHub Actions or another suitable CI runner: PostgreSQL TCP integration tests, native dependencies, full Playwright/Chromium E2E, and authoritative merge gates. WebContainers have browser-sandbox constraints and are not a general-purpose VM.

## Status

POC 0.1 — harness and validation contract only. No StackBlitz API integration, agent automation, secrets, production services, or target-repository import is configured.