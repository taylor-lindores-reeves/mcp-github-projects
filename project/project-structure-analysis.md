# Project Structure Analysis

## Overview
This is a GitHub API MCP (Model Context Protocol) Server built with TypeScript and Bun. It provides a comprehensive interface for managing GitHub Projects v2, Issues, and Repositories through GraphQL and REST APIs.

## Root Directory Structure

```
github-api-mcp-server/
├── .env                        # Environment variables (not in repo)
├── .env.example               # Environment variables template
├── .git/                      # Git repository metadata
├── .gitignore                 # Git ignore patterns
├── .kiro/                     # Kiro IDE configuration
│   └── specs/                 # Feature specifications
├── Dockerfile                 # Docker container configuration
├── LICENSE                    # MIT license file
├── README.md                  # Project documentation
├── build/                     # Compiled output directory
│   └── index.js              # Built executable MCP server
├── build.ts                   # ESBuild configuration script
├── bun.lock                   # Bun package lock file
├── codegen.ts                 # GraphQL code generation config
├── llms-full.txt             # LLM context file
├── node_modules/             # Dependencies (managed by Bun)
├── package.json              # Project metadata and dependencies
├── schema.docs.graphql       # GitHub GraphQL schema documentation
├── smithery.yaml             # Smithery deployment configuration
├── src/                      # Source code directory
└── tsconfig.json             # TypeScript configuration
```

## Source Code Architecture (`src/`)

### Entry Point
- **`src/index.ts`** - Main MCP server entry point
  - Registers MCP tools and prompts
  - Configures server capabilities
  - Handles stdio transport communication
  - Defines all available operations (projects, issues, repositories)

### Operations Layer (`src/operations/`)
Business logic layer that wraps GitHub API calls:

- **`src/operations/index.ts`** - Barrel exports for all operations
- **`src/operations/github-client.ts`** - GitHub API client wrapper
  - Octokit configuration with plugins
  - GraphQL and REST API methods
  - Error handling and authentication
- **`src/operations/projects.ts`** - GitHub Projects v2 operations
  - CRUD operations for projects
  - Field management
  - Item management (issues, draft issues)
  - Status and position updates
- **`src/operations/issues.ts`** - GitHub Issues operations
  - Issue creation, reading, updating
  - Issue management within projects
- **`src/operations/repositories.ts`** - Repository operations
  - Repository information retrieval

### GraphQL Layer (`src/graphql/`)
GraphQL queries and mutations organized by feature:

- **`src/graphql/index.ts`** - GraphQL operations barrel export
- **`src/graphql/issues/`** - Issue-related GraphQL operations
  - `getIssue.graphql` - Fetch single issue details
  - `index.ts` - Issue operations exports
- **`src/graphql/projects/`** - Project-related GraphQL operations
  - `getProject.graphql` - Fetch project details
  - `createProjectV2.graphql` - Create new project
  - `updateProjectV2.graphql` - Update project
  - `deleteProjectV2.graphql` - Delete project
  - `getProjectItems.graphql` - Fetch project items
  - `addProjectV2ItemById.graphql` - Add items to project
  - `updateProjectItemFieldValue.graphql` - Update item fields
  - Plus 20+ other project management operations
  - `index.ts` - Project operations exports
- **`src/graphql/repositories/`** - Repository GraphQL operations
  - `getRepository.graphql` - Fetch repository details
  - `index.ts` - Repository operations exports

### Type Definitions (`src/types/`)
- **`src/types/github-api-types.ts`** - Auto-generated TypeScript types
  - Generated from GitHub GraphQL schema
  - Provides type safety for all API operations
- **`src/types/graphql.d.ts`** - GraphQL type declarations

### Utilities (`src/utils/`)
- **`src/utils/graphql-loader.ts`** - GraphQL file loading utilities
  - Loads .graphql files at runtime
  - Handles development vs production paths

### Common Utilities (`src/common/`)
- **`src/common/errors.ts`** - Error handling utilities
- **`src/common/utils.ts`** - Shared utility functions

## Key Files Analysis

### Configuration Files
- **`package.json`** - Node.js project configuration
  - MCP server binary definition
  - TypeScript and GraphQL dependencies
  - Build scripts configuration
- **`tsconfig.json`** - TypeScript compiler configuration
- **`codegen.ts`** - GraphQL code generation setup
  - Generates types from GitHub schema
  - Configures type generation options
- **`build.ts`** - ESBuild configuration
  - Bundles TypeScript to single executable
  - Handles GraphQL file imports
  - Sets up production build

### Documentation
- **`README.md`** - Comprehensive project documentation
  - Installation and setup instructions
  - Environment variable configuration
  - GitHub token permissions
  - Usage examples
- **`schema.docs.graphql`** - GitHub GraphQL schema
  - Complete GitHub API schema for type generation

### Deployment
- **`smithery.yaml`** - Smithery deployment configuration
  - MCP server deployment settings
  - Configuration schema definition
- **`Dockerfile`** - Container configuration for deployment

## Architecture Patterns

### Layered Architecture
1. **MCP Layer** (`src/index.ts`) - Protocol interface
2. **Operations Layer** (`src/operations/`) - Business logic
3. **GraphQL Layer** (`src/graphql/`) - API queries/mutations
4. **Client Layer** (`src/operations/github-client.ts`) - API communication

### Type Safety
- Auto-generated types from GraphQL schema
- Zod schemas for runtime validation
- TypeScript throughout for compile-time safety

### Modular Organization
- Feature-based directory structure
- Barrel exports for clean imports
- Separation of concerns between layers

## Build Process
1. **GraphQL Codegen** - Generates TypeScript types from schema
2. **ESBuild** - Bundles and minifies TypeScript code
3. **Output** - Single executable JavaScript file in `build/`

## Key Dependencies
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **@octokit/core** - GitHub API client
- **@octokit/graphql** - GraphQL API support
- **zod** - Runtime type validation
- **esbuild** - Fast TypeScript bundler
- **@graphql-codegen/cli** - GraphQL type generation

This architecture provides a robust, type-safe interface for GitHub API operations through the MCP protocol, with clear separation of concerns and comprehensive error handling.
