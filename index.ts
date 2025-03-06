import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	type CallToolRequest,
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
	GitHubAuthenticationError,
	GitHubConflictError,
	type GitHubError,
	GitHubPermissionError,
	GitHubRateLimitError,
	GitHubResourceNotFoundError,
	GitHubValidationError,
	isGitHubError,
} from "./common/errors.js";
import {
	issueOperations,
	projectOperations,
	repositoryOperations,
} from "./operations/index.js";
import * as issues from "./operations/issues.js";
import * as projects from "./operations/projects.js";
import * as repositories from "./operations/repositories.js";

function formatGitHubError(error: GitHubError): string {
	let message = `GitHub API Error: ${error.message}`;

	if (error instanceof GitHubValidationError) {
		message = `Validation Error: ${error.message}`;
		if (error.response) {
			message += `\nDetails: ${JSON.stringify(error.response)}`;
		}
	} else if (error instanceof GitHubResourceNotFoundError) {
		message = `Not Found: ${error.message}`;
	} else if (error instanceof GitHubAuthenticationError) {
		message = `Authentication Failed: ${error.message}`;
	} else if (error instanceof GitHubPermissionError) {
		message = `Permission Denied: ${error.message}`;
	} else if (error instanceof GitHubRateLimitError) {
		message = `Rate Limit Exceeded: ${error.message}\nResets at: ${error.resetAt.toISOString()}`;
	} else if (error instanceof GitHubConflictError) {
		message = `Conflict: ${error.message}`;
	}

	return message;
}

const server = new Server(
	{
		name: "github-mcp-server",
		version: "1.0.0",
	},
	{
		capabilities: {
			prompts: {},
			tools: {},
		},
	},
);

// Define tools metadata
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: "get-repository",
				description: "Get a GitHub repository by owner and name",
				inputSchema: zodToJsonSchema(repositories.GetRepositorySchema),
			},
			{
				name: "list-repositories",
				description: "List repositories for a user or organization",
				inputSchema: zodToJsonSchema(repositories.ListRepositoriesSchema),
			},
			{
				name: "get-project",
				description: "Get a GitHub Project by ID",
				inputSchema: zodToJsonSchema(projects.GetProjectSchema),
			},
			{
				name: "list-projects",
				description: "List GitHub Projects for a user or organization",
				inputSchema: zodToJsonSchema(projects.ListProjectsSchema),
			},
			{
				name: "get-project-columns",
				description: "Get status columns for a GitHub Project",
				inputSchema: zodToJsonSchema(projects.GetProjectColumnsSchema),
			},
			{
				name: "get-project-fields",
				description: "Get fields for a GitHub Project",
				inputSchema: zodToJsonSchema(projects.GetProjectFieldsSchema),
			},
			{
				name: "get-project-items",
				description: "Get items (issues) from a GitHub Project",
				inputSchema: zodToJsonSchema(projects.GetProjectItemsSchema),
			},
			{
				name: "create-project-item",
				description: "Add an issue or PR to a GitHub Project",
				inputSchema: zodToJsonSchema(projects.CreateProjectItemSchema),
			},
			{
				name: "update-project-item-field",
				description: "Update a field value for a project item",
				inputSchema: zodToJsonSchema(
					projects.UpdateProjectItemFieldValueSchema,
				),
			},
			{
				name: "get-issue",
				description: "Get a GitHub issue by number",
				inputSchema: zodToJsonSchema(issues.GetIssueSchema),
			},
			{
				name: "list-issues",
				description: "List issues for a repository",
				inputSchema: zodToJsonSchema(issues.ListIssuesSchema),
			},
			{
				name: "create-issue",
				description: "Create a new GitHub issue",
				inputSchema: zodToJsonSchema(issues.CreateIssueSchema),
			},
			{
				name: "update-issue",
				description: "Update an existing GitHub issue",
				inputSchema: zodToJsonSchema(issues.UpdateIssueSchema),
			},
		],
	};
});


// Handle tool calls
server.setRequestHandler(
	CallToolRequestSchema,
	async (request: CallToolRequest) => {
		try {
			if (!request.params.arguments) {
				throw new Error("Arguments are required");
			}

			const args = request.params.arguments;
			let result: unknown;

			switch (request.params.name) {
				case "get-repository":
					result = await repositoryOperations.getRepository(
						args as z.infer<typeof repositories.GetRepositorySchema>,
					);
					break;

				case "list-repositories":
					result = await repositoryOperations.listRepositories(
						args as z.infer<typeof repositories.ListRepositoriesSchema>,
					);
					break;

				case "get-project":
					result = await projectOperations.getProject(
						args as z.infer<typeof projects.GetProjectSchema>,
					);
					break;

				case "list-projects":
					result = await projectOperations.listProjects(
						args as z.infer<typeof projects.ListProjectsSchema>,
					);
					break;

				case "get-project-columns":
					result = await projectOperations.getProjectColumns(
						args as z.infer<typeof projects.GetProjectColumnsSchema>,
					);
					break;

				case "get-project-fields":
					result = await projectOperations.getProjectFields(
						args as z.infer<typeof projects.GetProjectFieldsSchema>,
					);
					break;

				case "get-project-items":
					result = await projectOperations.getProjectItems(
						args as z.infer<typeof projects.GetProjectItemsSchema>,
					);
					break;

				case "create-project-item":
					result = await projectOperations.createProjectItem(
						args as z.infer<typeof projects.CreateProjectItemSchema>,
					);
					break;

				case "update-project-item-field":
					result = await projectOperations.updateProjectItemFieldValue(
						args as z.infer<typeof projects.UpdateProjectItemFieldValueSchema>,
					);
					break;

				case "get-issue":
					result = await issueOperations.getIssue(
						args as z.infer<typeof issues.GetIssueSchema>,
					);
					break;

				case "list-issues":
					result = await issueOperations.listIssues(
						args as z.infer<typeof issues.ListIssuesSchema>,
					);
					break;

				case "create-issue":
					result = await issueOperations.createIssue(
						args as z.infer<typeof issues.CreateIssueSchema>,
					);
					break;

				case "update-issue":
					result = await issueOperations.updateIssue(
						args as z.infer<typeof issues.UpdateIssueSchema>,
					);
					break;

				default:
					throw new Error(`Unknown tool: ${request.params.name}`);
			}

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			console.error("Error executing tool:", error);

			if (error instanceof z.ZodError) {
				throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
			}

			if (isGitHubError(error)) {
				throw new Error(formatGitHubError(error));
			}

			throw error;
		}
	},
);

async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

runServer().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
