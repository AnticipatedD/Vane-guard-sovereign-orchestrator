# Contributing to Vane-Guard-Sovereign-Orchestrator

Thank you for contributing to Vane-Guard-Sovereign-Orchestrator.

This repository contains an Astro/Starlight documentation application with React components and Cloudflare Worker tooling. Contributions should preserve the existing architecture, keep behavior testable, and avoid introducing credentials or unrelated generated artifacts.

## Development requirements

* Node.js 24+
* pnpm 11+

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Start the development server:

```bash
pnpm dev
```

## Before opening a pull request

Run the relevant verification commands locally:

```bash
pnpm run check
pnpm run lint
pnpm run format:core:check
pnpm test -- --run
pnpm run build
```

For changes affecting testable application logic, also run coverage:

```bash
pnpm exec vitest run --coverage
```

A pull request should not knowingly introduce failing type checks, lint errors, formatting violations, or tests.

## Testing

Tests are implemented with Vitest.

When changing existing behavior:

1. Identify the smallest meaningful test boundary.
2. Add or update a focused test for the behavior.
3. Run the affected test locally.
4. Run the complete test suite before opening the pull request.

Prefer deterministic unit tests over tests that depend on external services.

When a bug is fixed, include a regression test whenever practical.

## Type checking

The repository contains both Astro and Cloudflare Worker code.

Run:

```bash
pnpm run check
```

This is the authoritative type-validation command for the repository.

## Code style

Use the repository's existing ESLint and Prettier configuration.

Run:

```bash
pnpm run lint
pnpm run format:core:check
```

Avoid unrelated formatting or refactoring in feature/fix commits. Keeping changes focused makes reviews and repository history easier to understand.

## Security

Never commit:

* API keys
* access tokens
* passwords
* private keys
* `.env` files
* production credentials
* credentials copied from CI or deployment systems

Use environment variables for secrets.

If a credential has accidentally been committed, assume it is compromised. Revoke or rotate it before removing the value from source control.

Before submitting security-sensitive changes, inspect the diff carefully:

```bash
git diff --check
git diff
```

## Commit guidelines

Keep commits small and focused.

A useful commit should represent one coherent engineering change, for example:

```text
Add validation tests for model configuration
```

or:

```text
Add structured logging for gateway failures
```

Avoid combining unrelated changes such as:

* feature work
* mass formatting
* dependency upgrades
* unrelated refactoring
* documentation rewrites

A focused commit should make it possible to understand what changed and why.

## Pull requests

A pull request should explain:

* what changed
* why the change was necessary
* how the change was tested
* whether configuration or environment variables changed
* whether documentation needs updating

For behavior changes, include the relevant test coverage.

For CI changes, verify the corresponding command locally before opening the pull request.

## Environment configuration

Copy the example environment file when local configuration is required:

```bash
cp .env.example .env
```

Populate only the variables needed for the feature being developed.

Do not commit `.env`.

## Docker verification

When modifying the application's runtime or container configuration, verify the container workflow:

```bash
docker compose config
docker compose build
docker compose up
```

Stop the environment when finished:

```bash
docker compose down
```

## Review principle

The goal of this repository is not to maximize code volume. Prefer changes that are:

* correct
* testable
* maintainable
* documented
* secure
* narrowly scoped

New functionality should normally arrive together with the tests that demonstrate its intended behavior.
