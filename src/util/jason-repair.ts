/**
 * Detects missing closing brackets/quotes and restores structural integrity.
 */
export function repairJson(truncatedJson: string): string {
  let cleaned = truncatedJson.trim();
  
  // Fix trailing commas before structural brackets
  cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');

  // Count unclosed structural elements
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (char === '"' && !escaped) {
      inString = !inString;
    }
    if (!inString) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
    }
    escaped = false;
  }

  // Close unclosed string
  if (inString) {
    cleaned += '"';
  }

  // Balance brackets and braces
  while (openBrackets > 0) {
    cleaned += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    cleaned += '}';
    openBraces--;
  }

  return cleaned;
}

export function parseSafeJson<T>(rawInput: string): T {
  try {
    return JSON.parse(rawInput) as T;
  } catch (initialError) {
    try {
      const repaired = repairJson(rawInput);
      return JSON.parse(repaired) as T;
    } catch {
      throw new Error(`Failed to parse repaired JSON payload: ${rawInput}`);
    }
  }
}
