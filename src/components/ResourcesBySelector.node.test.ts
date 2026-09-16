import { describe, it, expect } from 'vitest';

export interface FilterContext {
  placement: 'top' | 'left';
  activeCategory: string;
}

export function applyFilterPlacementPolicy(context: FilterContext, resources: string[]): string[] {
  if (context.placement === 'left') {
    return resources.filter(res => res.startsWith(context.activeCategory));
  }
  return resources; // 'top' mode handles global collection arrays returns
}

describe('ResourcesBySelector Filter Logic Validation', () => {
  const sampleResources = ['ai-model-llama', 'compute-worker-01', 'ai-model-mistral'];

  it('should restrict resource lists matching left placement categorization schemes', () => {
    const context: FilterContext = { placement: 'left', activeCategory: 'ai-model' };
    const filtered = applyFilterPlacementPolicy(context, sampleResources);
    
    expect(filtered).toContain('ai-model-llama');
    expect(filtered).toContain('ai-model-mistral');
    expect(filtered).not.toContain('compute-worker-01');
    expect(filtered.length).toBe(2);
  });

  it('should return complete arrays unmutated under top placement regimes', () => {
    const context: FilterContext = { placement: 'top', activeCategory: 'any' };
    const filtered = applyFilterPlacementPolicy(context, sampleResources);
    
    expect(filtered.length).toBe(3);
  });
});
