# Makefile for MCP GitHub Projects
.PHONY: help dev prod build clean logs shell test install docker-build docker-clean ci check

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment with Docker"
	@echo "  make prod         - Start production environment with Docker"
	@echo "  make build        - Build Docker images"
	@echo "  make clean        - Clean up Docker containers and images"
	@echo "  make logs         - Show Docker container logs"
	@echo "  make shell        - Open shell in development container"
	@echo "  make test         - Run tests in Docker container"
	@echo "  make install      - Install dependencies locally with Bun"
	@echo "  make local-build  - Build application locally"
	@echo "  make local-dev    - Run development server locally"
	@echo "  make ci           - Run CI checks locally"
	@echo "  make check        - Run type checking"

# Docker commands
dev:
	./scripts/docker.sh dev

prod:
	./scripts/docker.sh prod

build:
	./scripts/docker.sh build

clean:
	./scripts/docker.sh clean

logs:
	./scripts/docker.sh logs

shell:
	./scripts/docker.sh shell

test:
	./scripts/docker.sh test

# Local development commands
install:
	bun install

local-build:
	bun run build

local-dev:
	bun run dev

# CI and validation commands
ci: install check local-build

check:
	bunx tsc --noEmit

# Aliases for compatibility
docker-build: build
docker-clean: clean
