# GitHub Projects MCP Server

A TypeScript server implementing the Model Context Protocol (MCP) to interact with GitHub's Projects v2 API for Agile project management.

## Features

- **GitHub Projects v2 API**: Full support for GitHub's GraphQL Projects v2 API
- **GitHub Issues**: Create, read, and update GitHub issues
- **GitHub Repositories**: Fetch repository details
- **Error Handling**: Comprehensive error handling for all GitHub API interactions
- **Type Safety**: Built with TypeScript and Zod for maximum type safety

## Directory Structure

```
.
├── common/
│   └── errors.ts          # Error handling for GitHub API
├── operations/
│   ├── github-client.ts   # GitHub API client for GraphQL and REST
│   ├── issues.ts          # GitHub Issues operations
│   ├── projects.ts        # GitHub Projects v2 operations
│   ├── repositories.ts    # GitHub Repository operations
│   └── index.ts           # Operations exports
├── index.ts               # Main server entry point
├── config.ts              # Application configuration
├── package.json
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file with your GitHub token:

```
GITHUB_TOKEN=your_github_personal_access_token
```

## Usage

### Start the server

```bash
bun start
```

For development with auto-reload:

```bash
bun dev
```

## Available Tools

The MCP server exposes the following tools:

### Repositories

- **get-repository**: Get a GitHub repository by owner and name
- **list-repositories**: List repositories for a user

### Projects

- **get-project**: Get a GitHub Project by ID
- **list-projects**: List GitHub Projects for a user
- **get-project-columns**: Get status columns for a GitHub Project
- **get-project-fields**: Get fields for a GitHub Project
- **get-project-items**: Get items (issues) from a GitHub Project
- **create-project-item**: Add an issue or PR to a GitHub Project
- **update-project-item-field**: Update a field value for a project item

### Issues

- **get-issue**: Get a GitHub issue by number
- **list-issues**: List issues for a repository
- **create-issue**: Create a new GitHub issue
- **update-issue**: Update an existing GitHub issue

## Environment Variables

- `GITHUB_TOKEN`: GitHub Personal Access Token with appropriate permissions
- `PORT` (optional): Port to run the server on (default: 3000)
- `NODE_ENV`: Environment mode (development, production, test)

## GitHub Token Permissions

The GitHub token requires the following permissions:

- `repo` - Full control of private repositories
- `project` - Full control of user projects
- `read:org` - Read organization membership

## Development

### Building

```bash
bun build
```

### Testing

```bash
bun test
```

## GitHub Projects v2 GraphQL API

This MCP server is built on top of GitHub's GraphQL API v2 for Projects. It uses the following GraphQL endpoints:

- Projects Query: Fetch projects and project details
- Project Field Query: Get field definitions from a project
- Project Items Query: Get items within a project
- Add Project Item Mutation: Add items to a project
- Update Project Item Field Mutation: Update field values for project items

For more information on GitHub's GraphQL API, see the [official documentation](https://docs.github.com/en/graphql).

## License

MIT
