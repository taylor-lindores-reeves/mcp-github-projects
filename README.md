# GitHub Projects MCP Server

A TypeScript server implementing the Model Context Protocol (MCP) to interact with GitHub's Projects v2 API for Agile project management.

## Features

- **GitHub Projects v2 API**: Full support for GitHub's GraphQL Projects v2 API
- **GitHub Issues**: Create, read, and update GitHub issues
- **GitHub Repositories**: Fetch repository details
- **Type Safety**: Built with TypeScript for maximum type safety

## Installation

1. Install packages and build the server:

```bash
bun install
bun run build
```

2. Configure your MCP client with the following settings:

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
        "GITHUB_OWNER": "your_github_username_or_org"
      }
    }
  }
}
```

## Environment Variables

- `GITHUB_TOKEN`: GitHub Personal Access Token with appropriate permissions
- `GITHUB_OWNER`: GitHub username or organization name

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

## Project Structure

This project is a MCP Server for GitHub's GraphQL API, with focus on Project V2 operations.
The codebase provides typed access to GitHub projects functionality through GraphQL.

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

## License
MIT
