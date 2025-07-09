import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: '@cloudflare/vitest-pool-workers',
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          compatibilityDate: '2024-01-01',
          compatibilityFlags: ['nodejs_compat'],
          bindings: {
            ENVIRONMENT: 'test'
          },
          kvNamespaces: {
            // Add KV namespaces for testing
          },
          durableObjects: {
            // Add Durable Objects for testing
          },
        },
      },
    },
    globals: true,
    setupFiles: ['./test/setup.js'],
  },
});