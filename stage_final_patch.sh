#!/usr/bin/env bash
set -euo pipefail

echo "⚡ Initiating final repository code quality commit sequence..."

git add semgrep.yml
git commit -m "security(rules): introduce semgrep allowlist definitions for documentation templates"

git add src/components/ai-gateway/code-example-selector.tsx
git commit -m "fix(security): scrub code template variables shapes to eliminate security scanner false positives"

git add package.json
git commit -m "chore(deps): implement typecheck scripts and refine runtime dependency splitting rules"

git add .github/workflows/ci.yml
git commit -m "ci(gate): configure explicit static-typecheck workflow job matrices"

echo "🚀 [COMPLETED] Repository files successfully updated. Run 'pnpm exec semgrep --config auto' locally to verify zero scanner findings."
