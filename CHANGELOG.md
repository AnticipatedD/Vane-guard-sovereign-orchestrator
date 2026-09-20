# Changelog

All notable changes to the Vane-Guard Sovereign Orchestrator documentation portal and UI components will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Direct DOM filtering assertions to `ResourcesBySelector.node.test.ts`.
- Structured JSON logging utility in `src/util/log.ts` for automated catalog processing.
- Utility unit test spec suite for `src/util/model-properties.ts`.
- Automated test and coverage enforcement job to `.github/workflows/ci.yml`.

### Changed
- Raised Vitest code coverage enforcement threshold in `package.json` to 65%.
- Refactored `bin/fetch-catalog-models.ts` script to stream machine-parseable log outputs.

## [1.0.0] - 2026-05-28

### Added
- Initial release of Cloudflare documentation portal architecture.
- Astro 4 + React 18 component grid rendering engines.
- Vitest configuration with pnpm workspace support.
