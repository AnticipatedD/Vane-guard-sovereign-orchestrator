import { describe, expect, it, vi } from 'vitest';
import { log } from './log';

describe('Structured Logging Utility', () => {
  it('formats structured log payloads cleanly', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalCi = process.env.CI;
    const originalNodeEnv = process.env.NODE_ENV;

    process.env.CI = 'true';
    delete process.env.NODE_ENV;

    log('info', 'Catalog synchronization completed', { itemsProcessed: 42 });

    expect(spy).toHaveBeenCalledOnce();
    const parsedPayload = JSON.parse(spy.mock.calls[0][0]);
    expect(parsedPayload.level).toBe('info');
    expect(parsedPayload.message).toBe('Catalog synchronization completed');
    expect(parsedPayload.itemsProcessed).toBe(42);

    process.env.CI = originalCi;
    process.env.NODE_ENV = originalNodeEnv;
    spy.mockRestore();
  });
});
