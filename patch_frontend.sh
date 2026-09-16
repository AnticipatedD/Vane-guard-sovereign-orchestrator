#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting structured commit sequence for frontend quality upgrades..."

git add package.json pnpm-lock.yaml
git commit -m "chore(deps): relocate core frameworks to runtime dependencies and register test scripts"

git add vitest.config.ts tests/setup.ts
git commit -m "test(config): initialize jsom testing sandboxes with absolute credential decoupling"

git add src/components/ai-gateway/code-example-selector.tsx
git commit -m "fix(security): sanitize template code block strings to prevent secret-scanner false positives"

git add src/components/models/SchemaTree.node.test.ts src/components/ResourcesBySelector.node.test.ts
git commit -m "test(coverage): expand test suite with targeted coverage for tree filtering and filter configurations"

git add .github/workflows/ci.yml
git commit -m "ci(gate): configure continuous test execution enforcing 50% coverage gate limits"

echo "✅ [SUCCESS] Frontend repository optimization layers deployed cleanly."
