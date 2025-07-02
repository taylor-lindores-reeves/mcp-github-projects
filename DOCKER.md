# Docker Setup for MCP GitHub Projects

This document describes how to set up and run the MCP GitHub Projects server using Docker.

## Prerequisites

- Docker and Docker Compose installed
- GitHub Personal Access Token with appropriate scopes

## Quick Start

1. **Clone and setup environment:**
   ```bash
   git clone <repository>
   cd mcp-github-projects
   cp .env.example .env
   ```

2. **Configure your GitHub token:**
   Edit `.env` and set your `GITHUB_TOKEN`

3. **Start development environment:**
   ```bash
   ./scripts/docker.sh dev
   ```

## Available Commands

Use the helper script `./scripts/docker.sh` for common operations:

- `./scripts/docker.sh dev` - Start development environment
- `./scripts/docker.sh prod` - Start production environment  
- `./scripts/docker.sh build` - Build Docker images
- `./scripts/docker.sh clean` - Clean up containers and images
- `./scripts/docker.sh logs` - Show container logs
- `./scripts/docker.sh shell` - Open shell in development container
- `./scripts/docker.sh test` - Run tests in container

### Alternative: Makefile Commands

For convenience, you can also use the included Makefile:

- `make dev` - Start development environment
- `make prod` - Start production environment
- `make build` - Build Docker images
- `make clean` - Clean up containers and images
- `make logs` - Show container logs
- `make shell` - Open shell in development container
- `make help` - Show all available commands

## Manual Docker Commands

### Development

```bash
# Build and start development environment
docker compose up -d mcp-github-dev

# View logs
docker compose logs -f mcp-github-dev

# Access container shell
docker compose exec mcp-github-dev /bin/bash
```

### Production

```bash
# Build and start production environment
docker compose --profile production up -d mcp-github-prod

# View logs
docker compose logs -f mcp-github-prod
```

## Docker Architecture

### Multi-stage Dockerfile

The Dockerfile uses a multi-stage build approach:

1. **Base Stage**: Sets up Node.js and Bun runtime
2. **Development Stage**: Includes dev dependencies and source code
3. **Build Stage**: Compiles TypeScript and bundles the application
4. **Production Stage**: Minimal image with only runtime dependencies

### Services

- **mcp-github-dev**: Development container with hot reloading
- **mcp-github-prod**: Production container (activated with `--profile production`)
- **redis**: Optional Redis service for caching (activated with `--profile cache`)

## Environment Variables

Required environment variables (set in `.env`):

- `GITHUB_TOKEN`: GitHub Personal Access Token
- `GITHUB_OWNER`: Your GitHub username or organization
- `NODE_ENV`: Environment (development/production)

Optional variables:

- `GITHUB_OWNER_TYPE`: "user" or "org" (defaults to "user")
- `ALLOWED_REPOS`: Comma-separated list of allowed repos
- `PORT`: Server port (defaults to 3000)

## Volumes and Data Persistence

- Development: Source code is mounted as a volume for hot reloading
- Production: Uses only built artifacts
- Redis: Data persisted in named volume `redis_data`

## Networking

All services run on the `mcp-network` Docker network:

- Development: `http://localhost:3000`
- Production: `http://localhost:3001`
- Redis: `localhost:6379` (if enabled)

## Troubleshooting

### Container won't start
- Verify `.env` file exists and contains valid `GITHUB_TOKEN`
- Check logs: `docker-compose logs mcp-github-dev`

### Build failures
- Clean Docker cache: `./scripts/docker.sh clean`
- Rebuild: `./scripts/docker.sh build`

### Permission issues
- Ensure scripts are executable: `chmod +x scripts/docker.sh`

### GitHub API issues
- Verify token has correct scopes (repo, project)
- Check rate limits in container logs

## Development Workflow

1. Start development environment: `./scripts/docker.sh dev`
2. Make code changes (automatically reflected due to volume mounting)
3. View logs: `./scripts/docker.sh logs`
4. Access shell if needed: `./scripts/docker.sh shell`
5. Run tests: `./scripts/docker.sh test`

## Production Deployment

1. Build production image: `./scripts/docker.sh build`
2. Start production environment: `./scripts/docker.sh prod`
3. Monitor logs: `./scripts/docker.sh logs`

The production image is optimized and contains only the compiled application and runtime dependencies.

## CI/CD and Container Registry

### GitHub Actions Workflows

The project includes several GitHub Actions workflows for automated building and deployment:

#### 1. CI Workflow (`.github/workflows/ci.yml`)
- Runs on every push to `main`/`develop` and pull requests
- Tests both local Bun build and Docker builds
- Validates TypeScript compilation
- Uses GitHub Actions cache for faster builds

#### 2. Docker Build Workflow (`.github/workflows/docker-build.yml`)
- Builds and pushes Docker images to GitHub Container Registry
- Supports multi-platform builds (linux/amd64, linux/arm64)
- Includes security scanning with Trivy
- Triggered on pushes to main branches and tags

#### 3. Release Workflow (`.github/workflows/release.yml`)
- Triggered when a GitHub release is published
- Builds both production and development images
- Publishes to GitHub Container Registry (and optionally Docker Hub)
- Creates versioned tags following semantic versioning

### Using Pre-built Images

Instead of building locally, you can use pre-built images from GitHub Container Registry:

```bash
# Pull and run latest production image
docker run -d --name mcp-github-projects \
  -e GITHUB_TOKEN=your_token \
  -e GITHUB_OWNER=your_username \
  -p 3000:3000 \
  ghcr.io/njdaniel/mcp-github-projects:latest

# Pull specific version
docker run -d --name mcp-github-projects \
  -e GITHUB_TOKEN=your_token \
  -e GITHUB_OWNER=your_username \
  -p 3000:3000 \
  ghcr.io/njdaniel/mcp-github-projects:v1.0.0
```

### Available Image Tags

- `latest` - Latest stable release (production build)
- `main` - Latest from main branch (production build)
- `v*` - Specific version releases (e.g., `v1.0.0`)
- `v*-dev` - Development builds for releases
- `develop` - Latest from develop branch

### Setting up Docker Hub Publishing (Optional)

To also publish to Docker Hub, add these secrets to your GitHub repository:

- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token
