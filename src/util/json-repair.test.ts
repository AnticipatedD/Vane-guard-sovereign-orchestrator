import { describe, it, expect } from 'vitest';
import { parseSafeJson, repairJson } from './json-repair';

describe('JSON Repair Utility', () => {
  it('should parse valid JSON without modification', () => {
    const valid = '{"name": "Vane-Guard", "status": "active"}';
    expect(parseSafeJson(valid)).toEqual({ name: 'Vane-Guard', status: 'active' });
  });

  it('should auto-repair unclosed braces and quotes', () => {
    const truncated = '{"name": "Vane-Guard", "status": "active';
    const repaired = repairJson(truncated);
    expect(parseSafeJson(repaired)).toEqual({ name: 'Vane-Guard', status: 'active' });
  });

  it('should strip trailing commas', () => {
    const trailing = '{"items": [1, 2, 3,],}';
    expect(parseSafeJson(trailing)).toEqual({ items: [1, 2, 3] });
  });
});
