import os

MATRIX_MARKDOWN = """
### File Inventory & Placement Matrix

| Target File Path | Purpose / Source | Replaces / Fixes |
| :--- | :--- | :--- |
| `src/util/logger.ts` | Structured JSON Logger | Raw `console.log` / `console.error` calls |
| `src/util/json-repair.ts` | Pattern-based JSON Parser & Fallback | Truncated model output crashes |
| `src/util/json-repair.test.ts` | Unit tests for JSON Repair | Broadens test ratio & coverage threshold |
| `docs/PROMPT_FRAMEWORK.md` | Prompt Documentation Schema | Fixes missing experiment reproducibility |
| `prompts/orchestrator_v1.json` | Separated Prompt Artifact | Solves prompt hardcoding (Image Step 2) |
"""

def update_readme(readme_path="README.md"):
    if not os.path.exists(readme_path):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write("# Repository Documentation\n")

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "### File Inventory & Placement Matrix" in content:
        print("Matrix already exists in README.md. Updating content...")
        # Split and replace existing section
        parts = content.split("### File Inventory & Placement Matrix")
        new_content = parts[0].rstrip() + "\n" + MATRIX_MARKDOWN.strip() + "\n"
    else:
        new_content = content.rstrip() + "\n\n" + MATRIX_MARKDOWN.strip() + "\n"

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Successfully updated {readme_path}")

if __name__ == "__main__":
    update_readme()
