# Vane-Guard-Sovereign-Orchestrator

A production-oriented documentation and developer portal built with Astro, Starlight, React, TypeScript, and Cloudflare tooling.

This repository currently contains the web documentation/application infrastructure, reusable UI components, content tooling, validation utilities, search integration, and Cloudflare Worker tooling that make up the project.

> **Repository truthfulness:** The source tree and build configuration are authoritative. This README intentionally documents the actual Astro/TypeScript application rather than an unrelated historical project description.

## Technology Stack

* Astro
* Starlight
* TypeScript
* React
* Vitest
* Zod
* Cloudflare Workers
* pnpm
* GitHub Actions

## Repository Structure

```text
.
├── .github/
│   └── workflows/       # CI automation
├── bin/                  # Repository and build utilities
├── src/
│   ├── components/       # Astro and React UI components
│   ├── content/          # Documentation content and collections
│   ├── plugins/          # Content and rendering integrations
│   └── util/             # Shared application utilities
├── worker/               # Cloudflare Worker runtime
├── astro.config.mjs      # Astro configuration
├── package.json          # Scripts and dependencies
├── pnpm-lock.yaml        # Locked dependency graph
└── vitest.config.ts      # Test configuration
```

## Requirements

* Node.js 24 or compatible current LTS release
* pnpm 11+

## Installation

Clone the repository and install the locked dependency tree:

```bash
pnpm install --frozen-lockfile
```

## Development

Start the local development server:

```bash
pnpm dev
```

The development server is configured to use port `1111`.

## Validation

Before submitting changes, run the repository checks:

```bash
pnpm run check
pnpm run lint
pnpm run format:core:check
pnpm test -- --run
```

For a production build:

```bash
pnpm run build
```

## Testing

Tests are executed with Vitest.

The repository uses multiple Vitest environments for different parts of the application, including Worker, Node, and Astro-oriented tests.

Run the complete test suite:

```bash
pnpm test -- --run
```

Run a specific test file:

```bash
pnpm exec vitest run path/to/file.test.ts
```

When adding or modifying behavior, add focused tests with the implementation change.

## Environment Variables

Some integrations require credentials or service configuration through environment variables.

Create a local `.env` file from the supplied example:

```bash
cp .env.example .env
```

Never commit `.env` files containing credentials.

Typical integration variables include:

```text
ALGOLIA_API_KEY=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
GITHUB_TOKEN=
JIRA_AUTH_TOKEN=
CF_API_BASE_URL=
```

Only configure variables required by the functionality you are actually using.

## Security

Secrets must never be committed directly into source code.

Use:

* local `.env` files for development;
* GitHub Actions secrets for CI;
* Cloudflare secret/environment configuration for deployed Workers.

If a credential has previously been committed to a public repository, **revoke or rotate it** before relying on the replacement environment variable.

## CI

GitHub Actions is used to validate repository changes.

The expected quality gates include:

* dependency installation;
* repository/type checks;
* linting;
* formatting validation;
* tests;
* production build validation.

A change should not be considered complete merely because it compiles locally. Relevant automated tests should accompany behavior changes.

## Development Guidelines

Prefer small, focused changes.

For a feature or bug fix:

1. Make the smallest coherent implementation change.
2. Add or update tests for the behavior.
3. Run the relevant validation locally.
4. Keep unrelated formatting/refactoring out of the same commit.
5. Use a descriptive commit message.

Example:

```text
fix: validate Algolia configuration
```

rather than:

```text
update stuff
```

## Contribution

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for repository contribution and verification guidance.

## License

See [`LICENSE`](./LICENSE) and [`LICENSE-CODE`](./LICENSE-CODE) for the applicable project licenses.
