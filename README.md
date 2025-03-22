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
