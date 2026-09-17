import json
import os
import sys

def evaluate_prompt_schema(file_path: str) -> bool:
    """Validates prompt template structural completeness per AMD guidelines."""
    required_keys = ["id", "version", "goal", "model_details", "prompt_text", "temperature"]
    
    if not os.path.exists(file_path):
        print(f"Error: Prompt artifact {file_path} not found.")
        return False

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    missing = [k for k in required_keys if k not in data]
    if missing:
        print(f"Validation Failed: Missing keys {missing} in {file_path}")
        return False
        
    print(f"Success: {file_path} complies with Prompt Documentation Spec.")
    return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "prompts/orchestrator_v1.json"
    success = evaluate_prompt_schema(target)
    sys.exit(0 if success else 1)
