import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: '@cloudflare/vitest-pool-workers',
    poolOptions: {
      workers: {
        wrangler: {
          configPath: './wrangler.toml',
        },
        miniflare: {
          // Miniflare-specific options
          compatibilityDate: '2023-05-18',
          compatibilityFlags: ['nodejs_compat'],
          bindings: {
            // Add any bindings for testing
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
    environment: 'miniflare',
    globals: true,
    setupFiles: ['./test/setup.js'],
  },
});