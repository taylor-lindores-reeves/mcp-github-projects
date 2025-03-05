# GitHub Projects MCP Server

[![smithery badge](https://smithery.ai/badge/mcp-github-projects)](https://smithery.ai/server/taylor-lindores-reeves/mcp-github-projects)

An MCP (Model Context Protocol) server that enables AI agents to create and manage Agile Sprint-based projects using GitHub Projects.

## Features

- **Project Management**: Create and manage GitHub Projects
- **Sprint Planning**: Define iterations (sprints) with start and end dates
- **Issue Tracking**: Create and update issues with Agile-focused metadata
- **Workflow Automation**: Move tickets through different stages of your workflow
- **AI-Friendly Interface**: Designed to work seamlessly with AI agents like Claude

## Prerequisites

- [Bun.js](https://bun.sh/) (v1.0.0+)
- [Node.js](https://nodejs.org/) (v18+)
- GitHub account with a Personal Access Token (PAT)
- MCP-compatible host (like Claude for Desktop)

## Installation

### Installing via Smithery

To install GitHub Projects MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/taylor-lindores-reeves/mcp-github-projects):

```bash
npx -y @smithery/cli install taylor-lindores-reeves/mcp-github-projects --client claude
```

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mcp-github-projects.git
   cd mcp-github-projects
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

## Usage

### Starting the Server

Run the server using Bun:

```bash
bun run src/cli.ts
```

Or use the npm script:

```bash
bun start
```

### Connecting to Claude for Desktop

1. Open Claude for Desktop
2. Go to Settings > MCP Servers
3. Add a new server with the following configuration:
   - Name: GitHub Projects
   - Command: `bun`
   - Arguments: `run ${path_to_project}/src/cli.ts`
   - Environment Variables: Add your GitHub token as `GITHUB_TOKEN`

### Available Tools

- `list-projects`: List all projects for a user or organization
- `create-project`: Create a new project
- `create-iteration`: Create a new iteration (sprint)
- `list-issues`: List all issues for a repository
- `create-issue`: Create a new issue
- `update-issue-status`: Update the status of an issue

### Example Prompts

The server provides helpful prompt templates for common Agile workflows:

- **Create Sprint**: Set up a new Sprint with a title and date range
- **Plan Sprint**: Organize issues for an upcoming Sprint
- **Move Ticket**: Update the status of an issue in the workflow

## Development

### Project Structure

```
mcp-github-projects/
├── src/
│   ├── types/             # TypeScript type definitions
│   ├── services/          # Service integrations (GitHub API)
│   ├── resources/         # MCP resources
│   ├── mcp-server.ts      # Main MCP server implementation
│   └── cli.ts             # Command-line interface
├── index.ts               # Entry point
├── package.json           # Project metadata
└── README.md              # This file
```

### Adding New Features

To add new tools or capabilities:

1. Update the appropriate service in `src/services/`
2. Add a new resource handler in `src/resources/`
3. Register the tool in `src/mcp-server.ts`

## Security Considerations

- The server runs with the permissions of the provided GitHub token
- All operations are performed through the GitHub API
- No data is stored locally outside of the current session
- Consider using a token with limited scope for production use

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GitHub Projects API for providing the underlying project management capabilities
- Model Context Protocol (MCP) for creating a standardized way to extend AI agent functionality
