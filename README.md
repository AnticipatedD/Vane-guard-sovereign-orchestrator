# Vane-Guard-Sovereign-Orchestrator

A production-oriented frontend documentation portal and edge orchestration gateway built with **Astro**, **Starlight**, **React**, **TypeScript**, and **Cloudflare Workers**.

> **Architecture & Scope Notice:** This repository houses web application infrastructure, reusable UI components, content tooling, schema validation utilities, search integration, and Cloudflare Worker edge services. It is a high-performance frontend documentation system, not an ML research or model-training codebase.

## Technology Stack

* **Frontend Engine:** Astro, Starlight, React
* **Language & Validation:** TypeScript, Zod
* **Edge Runtime:** Cloudflare Workers
* **Testing & Quality:** Vitest, ESLint, Prettier
* **Package Management & CI:** pnpm, GitHub Actions

## Repository Structure

```text
.
├── .github/
│   └── workflows/       # CI automation and quality gates
├── bin/                 # Repository and catalog build utilities
├── src/
│   ├── components/      # React and Astro UI components
│   ├── content/         # Documentation content collections
│   ├── plugins/         # Custom MDX and rendering plugins
│   └── util/            # Shared utility functions and schemas
├── worker/              # Cloudflare Worker edge runtime & health endpoints
├── astro.config.mjs     # Astro site configuration
├── package.json         # Pinned scripts and dependencies
├── pnpm-lock.yaml       # Deterministic lockfile
└── vitest.config.ts     # Multi-environment test suite configuration
```
### Requirements
- **​Node.js**: >= 18.14.1
- ​**pnpm**: ^9.9.0

# Installation
Clone the repository and install the locked dependency tree:
```bash
pnpm install --frozen-lockfile
```
# Development
​Start the local development server on port 1111:
```bash
pnpm dev
```
# Quality Verification
​Before submitting pull requests, run the complete suite of quality gates:
```bash
pnpm run typecheck
pnpm run lint
pnpm run format
pnpm run test:ci
```
To build the static documentation assets and worker bundle for production:
```bash
pnpm run build
```
# Testing Architecture
​Tests are executed via **Vitest** across multiple targeted environments (Worker, Node, and DOM).
​Run all tests once:
```bash
pnpm test
```
Run tests with statement coverage validation (>= 65% requirement):
```bash
pnpm run test:ci
```
Run a specific test file:
```bash
pnpm exec vitest run src/components/models/SchemaTree.node.test.ts
```
# Environment Configuration
​Configure service credentials locally using environment variables. Initialize your configuration from the example file:
```bash
cp .env.example .env
```
Ensure core runtime parameters are populated in your local `.env`:
env
NODE_ENV=development
CI=false
LOG_FORMAT=json
CLIENT_ID=vane_guard_dev_client
USER_ID=vane_guard_dev_user
CLOUDFLARE_API_TOKEN=your_token_here

--- 

# Security & Secrets 
- Secrets and tokens must never be committed to source control.
- ​Use local `.env` files for development, GitHub Secrets for CI, and Cloudflare Environment Variables for edge deployment.
- If a credential is accidentally exposed, revoke and rotate it immediately.
​
# CI/CD Pipeline
​GitHub Actions executes the following automated checks on every pull request:
1. ​**Dependency Verification**: Enforces strict frozen lockfile installation.
2. ​**Type Safety & Linting**: Executes pnpm run typecheck and pnpm run lint.
3. ​**Coverage & Testing**: Runs unit test suites with coverage threshold enforcement.
4. **Production Build Verification**: Validates pnpm run build static outputs.

# ​Development Guidelines
​Maintain a clean, mineable Git history:
- Keep changes atomic, focused, and paired with their corresponding tests (`*.node.test.ts`).
- ​Follow Conventional Commits (`feat:, fix:, test:, docs:, ci:`).
- ​Keep PRs scoped and under 200 LOC where possible.
  
# Contribution
​See [CONTRIBUTING](CONTRIBUTING.md) for detailed workflow and governance policies.

# ​License
​See [LICENSE](license.md) and [LICENSE-CODE](license-code.md)  for licensing information.
