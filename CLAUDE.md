# MCP GitHub Projects: Development Guide

## Commands
- Build: `npm run build`
- Run: `node build/index.js`
- No test commands defined yet

## Code Style Guidelines
- **Types**: Use Zod for schema validation, export type aliases for schema types
- **Imports**: Group by module source, explicit file extensions required
- **Naming**:
  - PascalCase: classes, interfaces, types
  - camelCase: variables, functions, methods
- **Error Handling**: Use custom error hierarchy from common/errors
- **Documentation**: JSDoc comments for public APIs
- **Async**: Use async/await pattern for asynchronous operations
- **Parameters**: Use named object parameters rather than positional

## Project Architecture
- `/src`: TypeScript source files
- `/build`: Compiled JavaScript output
- Uses Model Context Protocol SDK for server implementation
- GitHub API client handles authentication and resource operations

## MCP Implementation
- Server exposes GitHub data through Model Context Protocol
- Supports tools for operations like repository management, issues, and projects
- Tools require user confirmation before execution
- Implements error handling specific to GitHub API

## Environment
- Requires Node.js v23.9.0+
- Set GITHUB_TOKEN environment variable for API access
- Configure Claude Desktop to use this server via claude_desktop_config.json

For detailed examples, refer to the codebase operation implementations.
