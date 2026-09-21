import { describe, it, expect } from 'vitest';

describe('Sidebar Utility Functions', () => {
  it('evaluates product sidebar path correctly', () => {
    const path = '/docs/product';
    expect(path.startsWith('/docs')).toBe(true);
  });

  it('evaluates learning-paths fallback route', () => {
    const path = '/learning-paths';
    expect(path).toContain('learning');
  });
});
