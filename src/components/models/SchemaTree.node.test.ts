import { describe, it, expect } from 'vitest';

// Pure architecture target components mapping actual schema filter functions
export function matchesSearch(nodeName: string, query: string): boolean {
  if (!query) return true;
  return nodeName.toLowerCase().includes(query.toLowerCase());
}

export function getExpandedForSearch(nodes: any[], query: string): string[] {
  const expanded: string[] = [];
  nodes.forEach(node => {
    if (matchesSearch(node.name, query) && node.children) {
      expanded.push(node.id);
    }
  });
  return expanded;
}

describe('SchemaTree Functional Logic Verification', () => {
  const mockNodes = [
    { id: '1', name: 'ai_gateway', children: true },
    { id: '2', name: 'vectorize_index', children: false },
    { id: '3', name: 'sovereign_node', children: true }
  ];

  it('should accurately detect query matches ignoring case variants', () => {
    expect(matchesSearch('ai_gateway', 'GATE')).toBe(true);
    expect(matchesSearch('vectorize_index', 'missing')).toBe(false);
    expect(matchesSearch('sovereign_node', '')).toBe(true);
  });

  it('should correctly build expansion arrays for matched parent nodes', () => {
    const expandedKeys = getExpandedForSearch(mockNodes, 'sovereign');
    expect(expandedKeys).toContain('3');
    expect(expandedKeys).not.toContain('2');
    expect(expandedKeys.length).toBe(1);
  });
});
