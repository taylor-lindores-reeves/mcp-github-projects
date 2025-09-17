# Project Structure - Detailed Directory and File Descriptions

## Directory Structure Overview

```
src/
├── index.ts                    # MCP server entry point & tool registration
├── operations/                 # Business logic layer
│   ├── github-client.ts        # GitHub API client wrapper
│   ├── issues.ts              # Issue operations & schemas
│   ├── projects.ts            # Project v2 operations & schemas
│   ├── repositories.ts        # Repository operations & schemas
│   └── index.ts               # Operations barrel exports
├── graphql/                   # GraphQL queries & mutations
│   ├── issues/                # Issue-related GraphQL files
│   ├── projects/              # Project-related GraphQL files
│   └── repositories/          # Repository-related GraphQL files
├── types/                     # TypeScript type definitions
│   ├── github-api-types.ts    # Auto-generated GitHub API types
│   └── graphql.d.ts           # GraphQL type declarations
├── utils/                     # Utility functions
│   └── graphql-loader.ts      # GraphQL file loader utility
└── common/                    # Shared utilities
    ├── errors.ts              # Error handling utilities
    └── utils.ts               # Common helper functions
```

## Core Directories

### `/src` - Source Root
The main source directory containing all TypeScript source code. This directory houses the complete MCP server implementation, organized into logical layers that separate concerns and promote maintainability.

### `/src/operations` - Business Logic Layer
This directory contains the core business logic that bridges the MCP server interface with GitHub's APIs. Each file in this directory represents a domain-specific set of operations:

**Key Characteristics:**
- **Separation of Concerns**: Each operation file focuses on a specific GitHub domain (issues, projects, repositories)
- **Schema Validation**: Uses Zod schemas to validate input parameters before making API calls
- **Error Handling**: Implements comprehensive error handling with custom error types
- **Repository Allowlisting**: Enforces security through repository access controls

**Files:**
- `github-client.ts`: Centralized GitHub API client using Octokit with GraphQL and REST support
- `issues.ts`: Issue management operations including CRUD operations and schema definitions
- `projects.ts`: Comprehensive GitHub Projects v2 operations with full lifecycle management
- `repositories.ts`: Repository information retrieval operations
- `index.ts`: Barrel export file that provides clean imports and instantiated operation classes

### `/src/graphql` - GraphQL Operations
This directory organizes GraphQL queries and mutations by feature domain, following GitHub's GraphQL API structure:

**Organization Pattern:**
- **Feature-based Structure**: Queries and mutations are grouped by GitHub feature (issues, projects, repositories)
- **File Naming Convention**: Each `.graphql` file corresponds to a specific operation (e.g., `getProject.graphql`, `createProjectV2.graphql`)
- **Index Files**: Each subdirectory contains an `index.ts` file that imports and exports all GraphQL operations for that domain

**Subdirectories:**
- `issues/`: GraphQL operations for GitHub Issues API
- `projects/`: Extensive collection of GraphQL operations for GitHub Projects v2 API
- `repositories/`: GraphQL queries for repository information

### `/src/types` - Type Definitions
This directory contains TypeScript type definitions that ensure type safety throughout the application:

**Files:**
- `github-api-types.ts`: Auto-generated TypeScript types from GitHub's GraphQL schema using GraphQL Code Generator
- `graphql.d.ts`: Manual type declarations for GraphQL-related functionality

**Type Generation Process:**
- Types are automatically generated from GitHub's GraphQL schema
- Provides complete type coverage for all GitHub API responses
- Ensures compile-time type checking for all API interactions

### `/src/utils` - Utility Functions
Contains reusable utility functions that support the main application logic:

**Files:**
- `graphql-loader.ts`: Utility for loading GraphQL files from the filesystem, with support for both development and production environments

### `/src/common` - Shared Utilities
Houses common utilities and shared functionality used across the application:

**Files:**
- `errors.ts`: Comprehensive error handling system with custom error classes for different GitHub API error scenarios
- `utils.ts`: General-purpose utility functions for data validation, URL building, and formatting

## Key Files

### `/src/index.ts` - MCP Server Entry Point
The main entry point that configures and starts the MCP server. This file:

**Responsibilities:**
- **Server Configuration**: Initializes the MCP server with capabilities and metadata
- **Tool Registration**: Registers all available tools with their schemas and handlers
- **Prompt Registration**: Defines reusable prompts for common Agile workflows
- **Transport Setup**: Configures stdio transport for communication with MCP clients
- **Error Handling**: Implements top-level error handling and graceful shutdown

**Architecture Pattern:**
- Uses a declarative approach to define tools and prompts
- Separates tool definitions from business logic implementation
- Provides type-safe parameter validation using Zod schemas

### `/src/operations/github-client.ts` - GitHub API Client
A wrapper around Octokit that provides a unified interface for GitHub API interactions:

**Features:**
- **Multi-API Support**: Supports both GraphQL and REST APIs
- **Plugin Integration**: Uses Octokit plugins for pagination and REST endpoints
- **Error Handling**: Centralizes error handling for all GitHub API calls
- **Authentication**: Manages GitHub token authentication
- **Pagination Support**: Provides automatic pagination for GraphQL queries

### `/src/operations/projects.ts` - Projects Operations
The most comprehensive operation file, containing all GitHub Projects v2 functionality:

**Scope:**
- **CRUD Operations**: Complete create, read, update, delete operations for projects
- **Field Management**: Operations for custom fields, including single-select and iteration fields
- **Item Management**: Adding, updating, and organizing project items
- **Draft Issues**: Support for draft issues and conversion to regular issues
- **Bulk Operations**: Efficient bulk update operations for multiple items
- **Template Support**: Project template creation and management

**Security Features:**
- Repository allowlisting for write operations
- Content validation before API calls
- Proper error handling and user feedback

## Architectural Patterns

### Layer Separation
The codebase follows a clear layered architecture:

1. **Presentation Layer** (`index.ts`): MCP server interface and tool definitions
2. **Business Logic Layer** (`operations/`): Domain-specific operations and validation
3. **Data Access Layer** (`github-client.ts`): API communication and response handling
4. **Type Layer** (`types/`): Type definitions and contracts
5. **Utility Layer** (`utils/`, `common/`): Shared functionality and helpers

### GraphQL Organization
GraphQL operations are organized following these principles:

- **Domain Separation**: Each GitHub API domain has its own directory
- **Operation Naming**: Files are named after the specific operation they perform
- **Centralized Exports**: Index files provide clean import paths
- **Type Integration**: Generated types are automatically linked to operations

### Error Handling Strategy
The application implements a comprehensive error handling strategy:

- **Custom Error Classes**: Specific error types for different GitHub API scenarios
- **Error Propagation**: Errors are properly caught and transformed at each layer
- **User-Friendly Messages**: Error messages provide actionable information
- **Status Code Mapping**: HTTP status codes are mapped to appropriate error types

### Security Implementation
Security is implemented through multiple layers:

- **Repository Allowlisting**: Write operations are restricted to approved repositories
- **Input Validation**: All inputs are validated using Zod schemas
- **Authentication**: GitHub token authentication is required for all operations
- **Permission Checking**: Operations respect GitHub's permission model

This architecture ensures maintainability, type safety, and security while providing a clean interface for MCP clients to interact with GitHub's complex API surface.

## Architectural Patterns and Component Relationships

### MCP Server Layer Interaction with GitHub Operations

The MCP (Model Context Protocol) server acts as the primary interface layer that bridges external clients with GitHub's API functionality. The interaction follows a clear request-response pattern:

**Request Flow:**
1. **MCP Client Request**: External clients (like AI assistants) send tool requests to the MCP server
2. **Tool Resolution**: The MCP server (`index.ts`) matches the request to registered tools
3. **Parameter Validation**: Zod schemas validate input parameters before processing
4. **Operation Delegation**: Validated requests are forwarded to appropriate operation classes
5. **GitHub API Interaction**: Operations use the GitHub client to make API calls
6. **Response Transformation**: Raw GitHub responses are processed and returned to the client

**Key Integration Points:**
- **Tool Registration**: Each GitHub operation is exposed as an MCP tool with defined schemas
- **Type Safety**: TypeScript ensures type consistency from MCP interface to GitHub API
- **Error Propagation**: GitHub API errors are transformed into MCP-compatible error responses
- **Async Handling**: All operations support asynchronous processing with proper error handling

### GitHub Client Wrapper Architecture

The `GitHubClient` class serves as a centralized wrapper around Octokit, providing a unified interface for all GitHub API interactions:

**Architecture Components:**
```
GitHubClient
├── Octokit Core (Authentication & Base Functionality)
├── REST Plugin (GitHub REST API v4 Support)
├── GraphQL Plugin (GitHub GraphQL API v4 Support)
└── Pagination Plugin (Automatic Result Pagination)
```

**Key Responsibilities:**
- **Authentication Management**: Handles GitHub token authentication for all requests
- **API Abstraction**: Provides consistent methods for both REST and GraphQL operations
- **Error Standardization**: Centralizes error handling and transforms GitHub API errors
- **Request Optimization**: Implements pagination and batching for efficient API usage

**Method Categories:**
- `graphql<T>()`: Direct GraphQL queries with type safety
- `paginateGraphql<T>()`: Automatic pagination for large result sets
- `rest<T>()`: REST API calls with standardized error handling

### Flow from MCP Tools to GitHub API Calls

The complete data flow demonstrates how requests traverse the system layers:

```
MCP Client Request
       ↓
MCP Server (index.ts)
├── Tool Matching & Validation
├── Schema Validation (Zod)
└── Parameter Extraction
       ↓
Operations Layer (operations/*.ts)
├── Business Logic Processing
├── Repository Allowlist Checking
├── Input Transformation
└── Operation Class Method Call
       ↓
GitHub Client (github-client.ts)
├── Authentication Header Addition
├── Request Method Selection (GraphQL/REST)
├── Error Handling Wrapper
└── Octokit Plugin Chain
       ↓
GitHub API (api.github.com)
├── Authentication Verification
├── Permission Checking
├── Data Processing
└── Response Generation
       ↓
Response Processing (Reverse Flow)
├── GitHub Client Error Handling
├── Operations Layer Data Transformation
├── MCP Server Response Formatting
└── Client Response Delivery
```

**Critical Flow Points:**
1. **Validation Gate**: Zod schemas prevent invalid requests from reaching GitHub
2. **Security Gate**: Repository allowlisting enforces access controls
3. **Type Gate**: TypeScript ensures type safety throughout the flow
4. **Error Gate**: Comprehensive error handling at each layer

### Relationship Between Auto-Generated and Manual Type Definitions

The type system employs a hybrid approach combining auto-generated and manual type definitions:

**Auto-Generated Types (`github-api-types.ts`):**
- **Source**: Generated from GitHub's official GraphQL schema using GraphQL Code Generator
- **Coverage**: Complete type definitions for all GitHub GraphQL API responses
- **Maintenance**: Automatically updated when GitHub's schema changes
- **Usage**: Primary types for all GitHub API interactions

**Generation Process:**
```
GitHub GraphQL Schema → GraphQL Code Generator → github-api-types.ts
```

**Manual Type Definitions (`graphql.d.ts`):**
- **Purpose**: TypeScript module declarations for GraphQL file imports
- **Scope**: Enables importing `.graphql` files as string modules
- **Maintenance**: Manually maintained for build system integration

**Type Integration Pattern:**
```typescript
// Auto-generated types provide API contracts
import type { GetProjectQuery, GetProjectQueryVariables } from "../types/github-api-types.js";

// Manual types enable GraphQL file imports
import getProjectQuery from "./getProject.graphql";

// Operations combine both type systems
async getProject(variables: GetProjectQueryVariables): Promise<GetProjectQuery> {
  return this.client.graphql<GetProjectQuery>(getProjectQuery, variables);
}
```

**Benefits of Hybrid Approach:**
- **Type Safety**: Complete compile-time type checking for all GitHub API interactions
- **Schema Synchronization**: Auto-generated types stay synchronized with GitHub's API
- **Build Integration**: Manual types enable seamless GraphQL file integration
- **Development Experience**: IntelliSense and autocomplete for all API operations

**Type Flow Architecture:**
1. **Schema Definition**: GitHub publishes GraphQL schema
2. **Type Generation**: CodeGen creates TypeScript interfaces
3. **Import Declaration**: Manual types enable GraphQL file imports
4. **Operation Implementation**: Business logic uses both type systems
5. **Runtime Validation**: Zod schemas provide runtime type checking
6. **Client Response**: Fully typed responses returned to MCP clients

This type system ensures that the entire application maintains type safety from the MCP interface through to the GitHub API, while providing flexibility for both generated and custom type definitions.

## System Architecture Flow Diagram

### Request Processing Flow

The following diagram illustrates how requests flow through the system layers:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │───▶│   MCP Server     │───▶│   Operations     │───▶│   GitHub Client  │───▶│   GitHub API    │
│   (External)    │    │   (index.ts)     │    │   Layer          │    │   (Octokit)      │    │   (GraphQL/REST) │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │                        │                        │
                                ▼                        ▼                        ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
                       │   Tool Registry  │    │   Zod Schemas   │    │   GraphQL Queries│    │   API Response  │
                       │   & Validation   │    │   & Validation  │    │   & Mutations    │    │   Processing    │
                       └──────────────────┘    └─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Build Process & Generated vs Source Files

The system distinguishes between source files (manually maintained) and generated files (automatically created):

```
Development:                          Production:
┌─────────────────┐                  ┌─────────────────┐
│ Source Files    │                  │ Built Bundle    │
│ ├── src/        │    Build         │ ├── build/      │
│ ├── *.graphql   │ ──Process──────▶ │ │   └── index.js│
│ └── schema.docs │                  │ └── Embedded    │
└─────────────────┘                  │     GraphQL     │
         │                           └─────────────────┘
         ▼
┌─────────────────┐
│ Code Generation │
│ ├── GraphQL     │
│ │   Codegen     │
│ └── Type Gen    │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Generated Files │
│ └── github-api- │
│     types.ts    │
└─────────────────┘
```

### File Type Classification

| File Type | Location | Purpose | Generation Method |
|-----------|----------|---------|-------------------|
| **Source Files** | `src/` | Core application logic | Manual development |
| **GraphQL Queries** | `src/graphql/**/*.graphql` | API query definitions | Manual development |
| **Type Definitions** | `src/types/github-api-types.ts` | Auto-generated types | GraphQL Codegen |
| **Schema** | `schema.docs.graphql` | GitHub API schema | External (GitHub) |
| **Built Bundle** | `build/index.js` | Production executable | ESBuild automation |

### Data Flow Patterns

#### Tool Invocation Flow
```
MCP Client Request
    │
    ▼
Tool Handler (index.ts)
    │
    ├── Parameter Validation (Zod Schema)
    │
    ▼
Operation Method (operations/*.ts)
    │
    ├── Business Logic Processing
    │
    ▼
GitHub Client (github-client.ts)
    │
    ├── GraphQL Query Loading
    ├── API Authentication
    │
    ▼
GitHub API (GraphQL/REST)
    │
    ▼
Response Processing
    │
    ├── Type Validation
    ├── Error Handling
    │
    ▼
JSON Response to MCP Client
```

#### GraphQL Query Processing
```
Operation Request
    │
    ▼
Load GraphQL File (.graphql)
    │
    ├── Static file loading (development)
    ├── Embedded string (production)
    │
    ▼
Variable Substitution
    │
    ├── Zod-validated parameters
    ├── Type-safe variable mapping
    │
    ▼
GitHub GraphQL API
    │
    ▼
Response Mapping
    │
    ├── Auto-generated types
    ├── Runtime validation
    │
    ▼
Structured Response
```

### Component Dependencies

#### Runtime Dependencies
```
MCP Server
├── @modelcontextprotocol/sdk  ─── MCP protocol implementation
├── @octokit/core             ─── GitHub API client
├── @octokit/plugin-*         ─── API extensions
└── zod                       ─── Runtime validation
```

#### Build-time Dependencies
```
Build Process
├── @graphql-codegen/*        ─── Type generation
├── esbuild                   ─── Bundle creation
└── typescript                ─── Type checking
```

#### File Relationships
```
index.ts
├── imports operations/index.js
│   ├── imports issues.js
│   ├── imports projects.js
│   └── imports repositories.js
│       └── imports github-client.js
├── imports graphql queries (.graphql files)
└── uses generated types (github-api-types.ts)
```

### Key Architectural Decisions

1. **Separation of Concerns**: Clear boundaries between MCP server, business logic, and API client layers
2. **Type Safety**: Dual validation approach using Zod (runtime) and TypeScript (compile-time)
3. **Static GraphQL**: Pre-defined queries stored as files for better performance and type safety
4. **Modular Operations**: Feature-based organization separating issues, projects, and repositories
5. **Build Optimization**: Single bundle with embedded GraphQL queries for production deployment
6. **Error Handling**: Comprehensive error handling at each layer with proper error transformation
7. **Security**: Repository allowlisting and input validation at multiple levels
