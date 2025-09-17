# GitHub Projects MCP Server - Directory Structure

```
github-api-mcp-server/
├── .env                                    # Environment variables (GitHub token, owner, etc.)
├── .env.example                           # Template for environment configuration
├── .gitignore                             # Git ignore patterns for build artifacts and secrets
├── Dockerfile                             # Container configuration for deployment
├── LICENSE                                # MIT license file
├── README.md                              # Project documentation and setup instructions
├── bun.lock                               # Bun package manager lock file
├── package.json                           # Node.js project configuration and dependencies
├── tsconfig.json                          # TypeScript compiler configuration
├── build.ts                               # Build script for compiling the project
├── codegen.ts                             # GraphQL code generation configuration
├── smithery.yaml                          # Smithery MCP server registry configuration
├── schema.docs.graphql                    # GitHub GraphQL API schema documentation
├── comprehensive-directory-mapping.json   # Complete project structure mapping
├── project-structure-analysis.md          # Analysis of project architecture
├── llms-full.txt                          # Full project context for LLM analysis
│
├── .git/                                  # Git version control directory
│   ├── hooks/                             # Git hooks for automation
│   ├── objects/                           # Git object database
│   ├── refs/                              # Git references (branches, tags)
│   ├── logs/                              # Git operation logs
│   ├── info/                              # Git repository information
│   ├── config                             # Git repository configuration
│   ├── HEAD                               # Current branch reference
│   └── index                              # Git staging area index
│
├── .kiro/                                 # Kiro IDE configuration directory
│   └── specs/                             # Feature specifications
│       └── readme-project-structure/      # Current spec for README enhancement
│           ├── requirements.md            # Feature requirements document
│           ├── design.md                  # Technical design specification
│           └── tasks.md                   # Implementation task breakdown
│
├── build/                                 # Compiled JavaScript output
│   └── index.js                           # Main compiled MCP server entry point
│
├── node_modules/                          # NPM/Bun dependencies (auto-generated)
│   ├── @modelcontextprotocol/             # MCP SDK for server implementation
│   ├── @octokit/                          # GitHub API client libraries
│   ├── @graphql-codegen/                  # GraphQL code generation tools
│   ├── typescript/                        # TypeScript compiler
│   ├── zod/                               # Runtime type validation
│   └── [hundreds of other dependencies]   # Supporting libraries and tools
│
└── src/                                   # Source code directory
    ├── index.ts                           # MCP server entry point & tool registration
    │
    ├── common/                            # Shared utilities and helpers
    │   ├── errors.ts                      # Custom error classes and handling
    │   └── utils.ts                       # Common utility functions
    │
    ├── graphql/                           # GraphQL queries and mutations
    │   ├── index.ts                       # GraphQL exports barrel file
    │   │
    │   ├── issues/                        # Issue-related GraphQL operations
    │   │   ├── getIssue.graphql           # Query to fetch single issue details
    │   │   └── index.ts                   # Issue GraphQL exports
    │   │
    │   ├── projects/                      # Project-related GraphQL operations
    │   │   ├── addProjectV2DraftIssue.graphql        # Add draft issue to project
    │   │   ├── addProjectV2ItemById.graphql          # Add existing item to project
    │   │   ├── archiveProjectV2Item.graphql          # Archive project item
    │   │   ├── clearProjectV2ItemFieldValue.graphql  # Clear item field value
    │   │   ├── convertProjectV2DraftIssueToIssue.graphql # Convert draft to issue
    │   │   ├── copyProjectV2.graphql                 # Copy entire project
    │   │   ├── createProjectV2.graphql               # Create new project
    │   │   ├── createProjectV2Field.graphql          # Create custom project field
    │   │   ├── deleteProjectV2.graphql               # Delete project
    │   │   ├── deleteProjectV2Field.graphql          # Delete project field
    │   │   ├── deleteProjectV2Item.graphql           # Remove item from project
    │   │   ├── getProject.graphql                    # Fetch project details
    │   │   ├── getProjectColumns.graphql             # Get project status columns
    │   │   ├── getProjectFields.graphql              # Get project custom fields
    │   │   ├── getProjectItems.graphql               # Get all project items
    │   │   ├── listOrgProjects.graphql               # List organization projects
    │   │   ├── listProjects.graphql                  # List user projects
    │   │   ├── listUserProjects.graphql              # List user-specific projects
    │   │   ├── markProjectV2AsTemplate.graphql       # Mark project as template
    │   │   ├── unarchiveProjectV2Item.graphql        # Unarchive project item
    │   │   ├── unmarkProjectV2AsTemplate.graphql     # Remove template status
    │   │   ├── updateProjectItemFieldValue.graphql   # Update item field value
    │   │   ├── updateProjectV2.graphql               # Update project details
    │   │   ├── updateProjectV2Field.graphql          # Update project field
    │   │   ├── updateProjectV2ItemPosition.graphql   # Reorder project items
    │   │   ├── updateProjectV2StatusUpdate.graphql   # Update project status
    │   │   └── index.ts                              # Project GraphQL exports
    │   │
    │   └── repositories/                  # Repository-related GraphQL operations
    │       ├── getRepository.graphql      # Query to fetch repository details
    │       └── index.ts                   # Repository GraphQL exports
    │
    ├── operations/                        # Business logic layer
    │   ├── index.ts                       # Operations barrel exports
    │   ├── github-client.ts               # GitHub API client wrapper
    │   ├── issues.ts                      # Issue operations & Zod schemas
    │   ├── projects.ts                    # Project operations & Zod schemas
    │   └── repositories.ts                # Repository operations & Zod schemas
    │
    ├── types/                             # TypeScript type definitions
    │   ├── github-api-types.ts            # Auto-generated GitHub API types
    │   └── graphql.d.ts                   # GraphQL type declarations
    │
    └── utils/                             # Utility functions
        └── graphql-loader.ts              # GraphQL file loader utility
```

## Key Architecture Components

### MCP Server Layer (`src/index.ts`)
- **Entry Point**: Registers all MCP tools and prompts
- **Tool Registration**: Maps GraphQL operations to MCP tool interface
- **Prompt Templates**: Provides pre-built prompts for Agile workflows
- **Transport**: Uses stdio for communication with MCP clients

### Business Logic Layer (`src/operations/`)
- **GitHub Client**: Wraps Octokit with authentication and error handling
- **Operation Modules**: Encapsulate business logic for issues, projects, repositories
- **Zod Schemas**: Runtime validation for all input parameters
- **Type Safety**: Full TypeScript integration with auto-generated types

### GraphQL Layer (`src/graphql/`)
- **Query Organization**: Grouped by feature (issues, projects, repositories)
- **Mutation Support**: Full CRUD operations for GitHub Projects v2
- **Code Generation**: Auto-generates TypeScript types from GraphQL schema
- **Modular Structure**: Each operation in separate .graphql file

### Type System (`src/types/`)
- **Auto-Generated Types**: GitHub API types from GraphQL schema
- **Runtime Validation**: Zod schemas for input validation
- **Type Safety**: End-to-end type safety from GraphQL to MCP tools

### Build System
- **TypeScript Compilation**: Compiles to JavaScript for Node.js execution
- **GraphQL Codegen**: Generates types from GitHub's GraphQL schema
- **Bundle Output**: Single executable file in `build/` directory
- **Development Tools**: Hot reload and type checking during development
```
