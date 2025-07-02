#!/bin/bash

# Docker Development Scripts for MCP GitHub Projects

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: $0 {dev|prod|build|clean|logs|shell|test}"
    echo ""
    echo "Commands:"
    echo "  dev    - Start development environment"
    echo "  prod   - Start production environment"
    echo "  build  - Build all Docker images"
    echo "  clean  - Clean up containers and images"
    echo "  logs   - Show container logs"
    echo "  shell  - Open shell in development container"
    echo "  test   - Run tests in container"
    echo ""
}

check_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Warning: .env file not found. Copying from .env.example${NC}"
        cp .env.example .env
        echo -e "${RED}Please edit .env file with your GitHub token before continuing${NC}"
        exit 1
    fi
}

case "$1" in
    dev)
        echo -e "${GREEN}Starting development environment...${NC}"
        check_env
        docker compose up -d mcp-github-dev
        echo -e "${GREEN}Development environment started. Access at http://localhost:3000${NC}"
        ;;
    prod)
        echo -e "${GREEN}Starting production environment...${NC}"
        check_env
        docker compose --profile production up -d mcp-github-prod
        echo -e "${GREEN}Production environment started. Access at http://localhost:3001${NC}"
        ;;
    build)
        echo -e "${GREEN}Building Docker images...${NC}"
        docker compose build
        echo -e "${GREEN}Build completed${NC}"
        ;;
    clean)
        echo -e "${YELLOW}Cleaning up containers and images...${NC}"
        docker compose down -v
        docker system prune -f
        echo -e "${GREEN}Cleanup completed${NC}"
        ;;
    logs)
        docker compose logs -f
        ;;
    shell)
        echo -e "${GREEN}Opening shell in development container...${NC}"
        docker compose exec mcp-github-dev /bin/bash
        ;;
    test)
        echo -e "${GREEN}Running tests in container...${NC}"
        docker compose exec mcp-github-dev bun test
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
