# GitHub Projects API Test Suite

This test suite provides comprehensive testing for all the GitHub Projects API endpoints implemented in the MCP server.

## Running Tests

You can run the tests using Bun:

```bash
# Run all tests
bun test

# Run only GitHub API tests
bun run test:github

# Run in dry-run mode (no actual API calls)
bun run test:github:dry

# Run only project tests
bun run test:github:projects
```

## Configuration

The test suite can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub personal access token | From `.env` file |
| `GITHUB_USERNAME` | GitHub username | From `.env` file |
| `TEST_REPO` | Repository name to use for testing | `"test-repo"` |
| `DRY_RUN` | If `true`, simulates API calls without making them | `false` |
| `SKIP_CREATION` | If `true`, skips tests that create new resources | `false` |
| `CLEANUP_AFTER_TESTS` | If `true`, attempts to clean up test resources | `true` |
| `RUN_ONLY_TESTS` | Comma-separated list of test names to run | All tests |

Example:

```bash
# Run only specific tests in dry-run mode
DRY_RUN=true RUN_ONLY_TESTS=list-projects,list-issues bun test

# Test with a specific repository
TEST_REPO=my-repo bun test
```

## Available Tests

### Projects

- `list-projects`: Lists projects for the authenticated user
- `create-project`: Creates a new project
- `project-resource-format`: Tests the MCP resource format for projects

### Issues

- `list-issues`: Lists issues in a repository
- `create-issue`: Creates a new issue
- `update-issue-status`: Updates an issue's status
- `issue-resource-format`: Tests the MCP resource format for issues

### Iterations (Sprints)

- `create-iteration`: Creates a new iteration (sprint)
- `iteration-resource-format`: Tests the MCP resource format for iterations

## Requirements

- A valid GitHub personal access token with appropriate permissions
- For issue tests: A repository that the authenticated user has access to
- For iteration tests: At least one GitHub project, or permission to create one

## Troubleshooting

- **Authentication errors**: Ensure your `GITHUB_TOKEN` has the correct scopes
- **Not Found errors**: Check that the repository exists and is accessible
- **Rate limit issues**: GitHub API has rate limits. Use `DRY_RUN=true` for development
