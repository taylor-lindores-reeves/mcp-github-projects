# GitHub Projects MCP Server

[![smithery badge](https://smithery.ai/badge/mcp-github-projects)](https://smithery.ai/server/taylor-lindores-reeves/mcp-github-projects)

An MCP (Model Context Protocol) server that enables AI agents to create and manage Agile Sprint-based projects using GitHub Projects.

<a href="https://glama.ai/mcp/servers/86aw338aa5">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/86aw338aa5/badge" alt="GitHub Projects Server MCP server" />
</a>

## Features

- **GitHub Projects v2 API**: Full support for GitHub's GraphQL Projects v2 API
- **GitHub Issues**: Create, read, and update GitHub issues
- **GitHub Repositories**: Fetch repository details
- **Type Safety**: Built with TypeScript for maximum type safety

## Project Structure

This MCP server is built with a layered architecture that separates concerns and promotes maintainability. The codebase provides typed access to GitHub's GraphQL API with comprehensive error handling and security features.

### Directory Overview

```
├── src/                       # Source code directory
│   ├── index.ts               # MCP server entry point & tool registration
│   ├── operations/            # Business logic layer
│   │   ├── github-client.ts   # GitHub API client wrapper
│   │   ├── issues.ts          # Issue operations & schemas
│   │   ├── projects.ts        # Project v2 operations & schemas
│   │   ├── repositories.ts    # Repository operations & schemas
│   │   └── index.ts           # Operations barrel exports
│   ├── graphql/               # GraphQL queries & mutations
│   │   ├── issues/            # Issue-related GraphQL files
│   │   ├── projects/          # Project-related GraphQL files
│   │   └── repositories/      # Repository-related GraphQL files
│   ├── types/                 # TypeScript type definitions
│   │   ├── github-api-types.ts # Auto-generated GitHub API types
│   │   └── graphql.d.ts       # GraphQL type declarations
│   ├── utils/                 # Utility functions
│   │   └── graphql-loader.ts  # GraphQL file loader utility
│   └── common/                # Shared utilities
│       ├── errors.ts          # Error handling utilities
│       └── utils.ts           # Common helper functions
├── build/                     # Compiled output directory
├── package.json               # Project configuration & dependencies
├── tsconfig.json              # TypeScript compiler configuration
├── codegen.ts                 # GraphQL code generation configuration
├── build.ts                   # Custom build script with GraphQL plugin
├── smithery.yaml              # Smithery package configuration
├── schema.docs.graphql        # GitHub GraphQL schema for code generation
├── .env.example               # Environment variable template
└── .gitignore                 # Git ignore patterns
```

### Key Components

#### MCP Server Layer (`src/index.ts`)
The main entry point that configures and starts the MCP server. Registers all available tools with their schemas and handlers, defines reusable prompts for Agile workflows, and manages communication with MCP clients.

#### Business Logic Layer (`src/operations/`)
Contains the core business logic that bridges the MCP server interface with GitHub's APIs. Each file focuses on a specific GitHub domain with comprehensive error handling and security through repository allowlisting.

- **`github-client.ts`**: Centralized GitHub API client using Octokit with GraphQL and REST support
- **`issues.ts`**: Issue management operations with CRUD functionality
- **`projects.ts`**: Comprehensive GitHub Projects v2 operations with full lifecycle management
- **`repositories.ts`**: Repository information retrieval operations

#### GraphQL Layer (`src/graphql/`)
Organizes GraphQL queries and mutations by feature domain, following GitHub's GraphQL API structure. Each `.graphql` file corresponds to a specific operation, with index files providing clean imports.

#### Type System (`src/types/`)
Ensures type safety throughout the application using a hybrid approach:
- **Auto-generated types**: Created from GitHub's GraphQL schema using GraphQL Code Generator
- **Manual declarations**: Enable importing `.graphql` files as TypeScript modules

#### Configuration Files
Essential configuration files that control the build process and project setup:

- **`package.json`**: Project metadata, dependencies, and build scripts
- **`tsconfig.json`**: TypeScript compiler settings for ES2022 target with NodeNext modules
- **`codegen.ts`**: GraphQL Code Generator configuration for auto-generating types from GitHub's schema
- **`build.ts`**: Custom esbuild configuration with GraphQL file handling plugin
- **`smithery.yaml`**: Package configuration for Smithery MCP server registry
- **`schema.docs.graphql`**: GitHub's GraphQL schema used for type generation
- **`.env.example`**: Template showing required environment variables

### Architectural Flow

```
MCP Client Request → MCP Server → Operations Layer → GitHub Client → GitHub API
                                       ↓
                               Type Validation (Zod Schemas)
                                       ↓
                               GraphQL Queries/Mutations
```

The system follows a clear request-response pattern with validation gates at each layer, ensuring type safety from the MCP interface through to the GitHub API while maintaining security through repository allowlisting and comprehensive error handling.

## Installation

### Installing via Smithery

To install GitHub Projects MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/taylor-lindores-reeves/mcp-github-projects):

```bash
npx -y @smithery/cli install taylor-lindores-reeves/mcp-github-projects --client claude
```

## Usage

### Manual Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/taylor-lindores-reeves/mcp-github-projects.git
   cd mcp-github-projects
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file with your GitHub token:

   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_OWNER_TYPE=org
   ALLOWED_REPOS=owner/repo,another/repo
   ```

4. Build the server:

   ```bash
   bun run build
   ```

5. Configure your MCP client with the following settings:

```json
{
  "mcpServers": {
    "GitHubProjects": {
      "command": "bun",
      "args": [
        "/path/to/your/directory/mcp-github-projects-main/build/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_personal_access_token",
        "GITHUB_OWNER": "your_github_username_or_org",
        "GITHUB_OWNER_TYPE": "org",
        "ALLOWED_REPOS": "owner/repo,another/repo"
      }
    }
  }
}
```

## Environment Variables

- `GITHUB_TOKEN`: GitHub Personal Access Token with appropriate permissions
- `GITHUB_OWNER`: GitHub username or organization name
- `GITHUB_OWNER_TYPE`: (Optional) Set to `user` (default) or `org`. Controls whether project listing and management is done for a user or an organization. Set to `org` if your projects live in a GitHub organization.
- `ALLOWED_REPOS`: (Optional) Comma-separated list of allowed repository slugs (e.g. `owner/repo,another/repo`). All write operations (creating/updating issues, adding items to projects, etc.) are restricted to these repositories. If not set or empty, all repositories are allowed by default.

**Example:**

```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=the-troops
GITHUB_OWNER_TYPE=org
ALLOWED_REPOS=the-troops/sms-troopers,manuelbiermann/convo-run
```

If you try to perform a write operation on a repository not in this list, the server will throw an error and block the action.

## GitHub Token Permissions

This MCP server requires a GitHub Personal Access Token (classic) with the following permissions:

- `project` - Full control of projects
- `read:project` - Read access of projects
- `repo` - Full control of private repositories
- `repo:status` - Access commit status
- `repo_deployment` - Access deployment status
- `public_repo` - Access public repositories
- `repo:invite` - Access repository invitations
- `security_events` - Read and write security events

## Development

### Commands

- Build: `bun run build`
- Generate GraphQL types: `bun run graphql-codegen`

## Available Operations

### Projects

- Create, read, update, and delete GitHub Projects
- Manage project fields, items, and status updates
- Convert draft issues to actual issues
- Archive and unarchive project items

### Issues

- Get issue details
- Add issues to projects

### Repositories

- Get repository information
