/**
 * Tests for Cloudflare Worker template
 * Using Vitest with @cloudflare/vitest-pool-workers
 */

import { describe, it, expect } from 'vitest';
import worker from '../src/index.js';

// Mock environment for testing
const env = {
  ENVIRONMENT: 'test'
};

// Mock execution context
const ctx = {
  waitUntil: (promise) => promise,
  passThroughOnException: () => {}
};

describe('Cloudflare Worker Template', () => {
  describe('Root endpoint (/)', () => {
    it('should return HTML page', async () => {
      const request = new Request('https://example.com/');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('text/html');
      
      const html = await response.text();
      expect(html).toContain('Cloudflare Worker Template');
      expect(html).toContain('test'); // Environment should be included
    });
  });

  describe('Health endpoint (/health)', () => {
    it('should return health status', async () => {
      const request = new Request('https://example.com/health');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('application/json');
      
      const health = await response.json();
      expect(health.status).toBe('healthy');
      expect(health.environment).toBe('test');
      expect(health.version).toBe('1.0.0');
      expect(health.timestamp).toBeDefined();
    });
  });

  describe('Hello API (/api/hello)', () => {
    it('should return default hello message', async () => {
      const request = new Request('https://example.com/api/hello');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('application/json');
      
      const data = await response.json();
      expect(data.message).toBe('Hello, World!');
      expect(data.environment).toBe('test');
    });

    it('should return personalized hello message', async () => {
      const request = new Request('https://example.com/api/hello?name=Alice');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.message).toBe('Hello, Alice!');
    });
  });

  describe('Basic functionality', () => {
    it('should handle basic requests', async () => {
      const request = new Request('https://example.com/');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBeLessThan(500);
    });
  });
});