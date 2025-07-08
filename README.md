# Cloudflare Worker Template

A production-ready Cloudflare Worker template with centralized CI/CD pipeline, comprehensive testing, and security best practices.

## Features

- ✅ **Centralized CI/CD**: Uses `batumi-works/cf-pipeline` for consistent deployments
- ✅ **Testing**: Vitest with Miniflare integration for local testing
- ✅ **Security**: CORS handling, input validation, error boundaries
- ✅ **Observability**: Datadog integration for deployment tracking
- ✅ **Multiple Environments**: Production, staging, and development configurations
- ✅ **TypeScript Support**: Optional TypeScript support with type checking
- ✅ **Local Development**: Sub-10s local testing with workerd runtime

## Quick Start

### 1. Create New Project

```bash
# Clone this template
git clone https://github.com/batumi-works/cloudflare-worker-template.git my-worker
cd my-worker

# Install dependencies
npm install

# Install Wrangler globally if not already installed
npm install -g wrangler
```

### 2. Configure Your Worker

Edit `wrangler.toml`:
```toml
name = "my-worker"  # Change this to your worker name
main = "src/index.js"
compatibility_date = "2023-05-18"

[env.production]
name = "my-worker"
routes = [
  { pattern = "myapp.com/*", zone_name = "myapp.com" }
]
```

Edit `package.json`:
```json
{
  "name": "my-worker",
  "description": "My awesome Cloudflare Worker"
}
```

### 3. Set Up Authentication

```bash
# Authenticate with Cloudflare
wrangler auth login

# Test authentication
wrangler whoami
```

### 4. Development

```bash
# Start local development server
npm run dev

# Run tests
npm run test

# Validate configuration
npm run validate
```

### 5. Deploy

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Project Structure

```
my-worker/
├── .github/
│   └── workflows/
│       └── ci.yml              # 5-line CI/CD configuration
├── src/
│   └── index.js                # Worker code
├── test/
│   ├── index.test.js           # Test suite
│   └── setup.js                # Test setup
├── package.json                # Dependencies and scripts
├── wrangler.toml               # Cloudflare configuration
├── vitest.config.js            # Test configuration
└── README.md                   # This file
```

## Available Scripts

- `npm run dev` - Start local development server
- `npm run test` - Run tests with Miniflare
- `npm run deploy` - Deploy to production
- `npm run deploy:staging` - Deploy to staging
- `npm run deploy:production` - Deploy to production
- `npm run validate` - Validate configuration
- `npm run lint` - Lint code (if configured)
- `npm run typecheck` - Type check (if using TypeScript)

## API Endpoints

The template includes these example endpoints:

- `GET /` - HTML landing page
- `GET /health` - Health check endpoint
- `GET /api/hello?name=World` - Hello API
- `GET /api/time` - Current time API

## Environment Variables

Set these secrets using `wrangler secret put`:

```bash
# Example secrets
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put DATABASE_URL
```

Configure non-sensitive variables in `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
API_VERSION = "v1"
```

## Testing

Tests use Vitest with Miniflare for accurate Cloudflare Workers runtime simulation:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

## GitHub Actions Setup

The template includes a minimal 5-line GitHub Actions workflow that uses the centralized pipeline:

```yaml
jobs:
  ci:
    uses: batumi-works/cf-pipeline/.github/workflows/ci.yml@v1
    # ... configuration
```

### Required Secrets

Add these secrets to your GitHub repository:

1. `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Workers permissions
2. `DATADOG_API_KEY` - (Optional) Datadog API key for observability
3. `DATADOG_APP_KEY` - (Optional) Datadog application key

### Repository Setup

1. Create repository from this template
2. Add required secrets in repository settings
3. Push to main branch to trigger deployment

## Security Best Practices

- ✅ No hardcoded secrets in code
- ✅ CORS headers configured
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Security scanning in CI/CD
- ✅ Dependency vulnerability checks

## Performance Optimizations

- ✅ Minimal bundle size
- ✅ ES modules for tree shaking
- ✅ Efficient request routing
- ✅ Caching headers where appropriate
- ✅ Sub-10s local test execution

## Troubleshooting

### Common Issues

**Local development not starting:**
```bash
# Check wrangler authentication
wrangler whoami

# Validate configuration
npm run validate
```

**Tests failing:**
```bash
# Install test dependencies
npm install

# Check test configuration
cat vitest.config.js
```

**Deployment failing:**
```bash
# Check wrangler configuration
wrangler validate

# Test deployment dry run
npm run deploy -- --dry-run
```

### Getting Help

- Check the [troubleshooting guide](https://github.com/batumi-works/cf-pipeline/docs/troubleshooting.md)
- Review [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- Open an issue in the [template repository](https://github.com/batumi-works/cloudflare-worker-template/issues)

## Advanced Usage

### Adding TypeScript

```bash
# Install TypeScript dependencies
npm install --save-dev typescript @types/node

# Create tsconfig.json
# Update wrangler.toml main to point to built JS
```

### Adding KV Storage

```toml
# In wrangler.toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

### Adding Durable Objects

```toml
# In wrangler.toml
[[durable_objects.bindings]]
name = "MY_DO"
class_name = "MyDurableObject"
```

## License

MIT License - see [LICENSE](LICENSE) for details.