/**
 * Cloudflare Worker - Template
 * 
 * A minimal Cloudflare Worker template with:
 * - Request/response handling
 * - Environment variable access
 * - Error handling
 * - CORS support
 * - Basic routing
 */

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

/**
 * Handle incoming requests
 * @param {Request} request - The incoming request
 * @param {Object} env - Environment variables and bindings
 * @param {Object} ctx - Execution context
 * @returns {Response} The response
 */
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;
  
  // Add CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Basic routing
  switch (pathname) {
    case '/':
      return handleRoot(request, env, corsHeaders);
    
    case '/health':
      return handleHealth(request, env, corsHeaders);
    
    case '/api/hello':
      return handleHello(request, env, corsHeaders);
    
    case '/api/time':
      return handleTime(request, env, corsHeaders);
    
    default:
      return new Response('Not Found', {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
  }
}

/**
 * Handle root path
 */
function handleRoot(request, env, corsHeaders) {
  const environment = env.ENVIRONMENT || 'unknown';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Cloudflare Worker Template</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
        .status { background: #e7f3ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        .endpoints { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        code { background: #f1f3f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🚀 Cloudflare Worker Template</h1>
    
    <div class="status">
        <h2>Status</h2>
        <p><strong>Environment:</strong> ${environment}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Worker URL:</strong> ${request.url}</p>
    </div>
    
    <div class="endpoints">
        <h2>Available Endpoints</h2>
        <ul>
            <li><code>GET /</code> - This page</li>
            <li><code>GET /health</code> - Health check</li>
            <li><code>GET /api/hello</code> - Hello API</li>
            <li><code>GET /api/time</code> - Current time API</li>
        </ul>
    </div>
    
    <h2>Next Steps</h2>
    <ol>
        <li>Customize this Worker for your use case</li>
        <li>Add environment variables in wrangler.toml</li>
        <li>Set up secrets with <code>wrangler secret put</code></li>
        <li>Add KV, Durable Objects, or R2 bindings as needed</li>
        <li>Deploy with <code>npm run deploy</code></li>
    </ol>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

/**
 * Handle health check
 */
function handleHealth(request, env, corsHeaders) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT || 'unknown',
    version: '1.0.0'
  };
  
  return new Response(JSON.stringify(health, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Handle hello API
 */
function handleHello(request, env, corsHeaders) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'World';
  
  const response = {
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT || 'unknown'
  };
  
  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Handle time API
 */
function handleTime(request, env, corsHeaders) {
  const now = new Date();
  
  const response = {
    iso: now.toISOString(),
    unix: Math.floor(now.getTime() / 1000),
    timezone: 'UTC',
    formatted: now.toUTCString()
  };
  
  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}