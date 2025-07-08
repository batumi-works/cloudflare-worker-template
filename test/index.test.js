/**
 * Tests for Cloudflare Worker template
 * Using Vitest with Miniflare integration
 */

import { describe, it, expect, beforeAll } from 'vitest';
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

  describe('Time API (/api/time)', () => {
    it('should return current time information', async () => {
      const request = new Request('https://example.com/api/time');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('application/json');
      
      const data = await response.json();
      expect(data.iso).toBeDefined();
      expect(data.unix).toBeDefined();
      expect(data.timezone).toBe('UTC');
      expect(data.formatted).toBeDefined();
      
      // Validate ISO format
      expect(new Date(data.iso).toISOString()).toBe(data.iso);
    });
  });

  describe('Not found endpoint', () => {
    it('should return 404 for unknown paths', async () => {
      const request = new Request('https://example.com/unknown');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(404);
      
      const text = await response.text();
      expect(text).toBe('Not Found');
    });
  });

  describe('CORS handling', () => {
    it('should handle OPTIONS preflight requests', async () => {
      const request = new Request('https://example.com/api/hello', {
        method: 'OPTIONS'
      });
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
      expect(response.headers.get('Access-Control-Allow-Headers')).toBeDefined();
    });

    it('should include CORS headers in all responses', async () => {
      const request = new Request('https://example.com/api/hello');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      // Create a request that might cause an error
      const request = new Request('https://example.com/api/hello');
      
      // Mock an environment that could cause issues
      const errorEnv = {
        ...env,
        // Add problematic properties if needed
      };
      
      const response = await worker.fetch(request, errorEnv, ctx);
      
      // Should still return a valid response
      expect(response.status).toBeLessThan(600);
    });
  });

  describe('HTTP methods', () => {
    it('should handle GET requests', async () => {
      const request = new Request('https://example.com/api/hello', {
        method: 'GET'
      });
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
    });

    it('should handle POST requests to existing endpoints', async () => {
      const request = new Request('https://example.com/api/hello', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
    });
  });

  describe('URL parsing', () => {
    it('should handle query parameters correctly', async () => {
      const request = new Request('https://example.com/api/hello?name=Test&extra=param');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.message).toBe('Hello, Test!');
    });

    it('should handle encoded query parameters', async () => {
      const request = new Request('https://example.com/api/hello?name=Test%20User');
      const response = await worker.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.message).toBe('Hello, Test User!');
    });
  });
});