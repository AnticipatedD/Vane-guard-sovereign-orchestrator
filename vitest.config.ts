import { defineConfig } from 'vitest/config';
import astroConfig from './astro.config.mjs'; // Adjust if naming patterns vary slightly

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 65,
        branches: 65,
        functions: 65,
        lines: 65
      }
    }
  }
});
