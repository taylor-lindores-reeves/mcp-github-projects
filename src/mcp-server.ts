import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	GetPromptRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { IssueResource } from "./resources/issue.resource";
import { IterationResource } from "./resources/iteration.resource";
import { ProjectResource } from "./resources/project.resource";
import type { IssuePriority, IssueStatus } from "./types";

const PROMPTS = {
	"create-sprint": {
		name: "Create a new Sprint",
		description: "Create a new Sprint with an appropriate title and date range",
		template: `
Create a new Sprint for project {{projectId}} with the following details:

- Title: Sprint {{sprintNumber}}
- Start Date: {{startDate}}
- End Date: {{endDate}}

Use the 'create-iteration' tool to set up the Sprint.
`,
	},
	"plan-sprint": {
		name: "Plan a Sprint",
		description: "Plan a Sprint by creating and organizing issues",
		template: `
Plan Sprint {{sprintNumber}} for project {{projectId}} by following these steps:

1. Use 'list-issues' to see what issues are in the backlog
2. Create new issues using 'create-issue' with appropriate titles, descriptions, and priority levels
3. For each issue, make sure to:
   - Set a clear description
   - Assign story points based on complexity
   - Apply appropriate labels
   - Set the correct priority

Make sure the total story points are achievable within the Sprint timeframe.
`,
	},
	"move-ticket": {
		name: "Update ticket status",
		description: "Move a ticket to a different stage in the workflow",
		template: `
Update the status of issue #{{issueNumber}} in repository {{owner}}/{{repo}} to {{status}}.

Use the 'update-issue-status' tool to change the status.
`,
	},
};

export async function createMCPServer(authToken?: string) {
	// Initialize our resources with the provided auth token
	const projectResource = new ProjectResource(authToken);
	const iterationResource = new IterationResource(authToken);
	const issueResource = new IssueResource(authToken);

	// Create the MCP server
	const server = new Server(
		{
			id: "github-projects-mcp-server",
			name: "GitHub Projects MCP Server",
			description:
				"MCP server for creating and managing Agile Sprint-based projects with GitHub Projects",
			version: "1.0.0",
		},
		{
			capabilities: {
				prompts: {},
				tools: {},
				resources: {},
			},
		},
	);

	// Get specific prompt
	server.setRequestHandler(GetPromptRequestSchema, async (request) => {
		const prompt = PROMPTS[request.params.name as keyof typeof PROMPTS];
		if (!prompt) {
			throw new Error(`Prompt not found: ${request.params.name}`);
		}

		if (request.params.name === "create-sprint") {
			// Replace template variables with arguments
			let createSprintText = prompt.template;
			if (request.params.arguments) {
				for (const [key, value] of Object.entries(request.params.arguments)) {
					createSprintText = createSprintText.replace(
						new RegExp(`{{${key}}}`, "g"),
						String(value),
					);
				}
			}
			return {
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: createSprintText,
						},
					},
				],
			};
		}

		if (request.params.name === "plan-sprint") {
			// Replace template variables with arguments
			let planSprintText = prompt.template;
			if (request.params.arguments) {
				for (const [key, value] of Object.entries(request.params.arguments)) {
					planSprintText = planSprintText.replace(
						new RegExp(`{{${key}}}`, "g"),
						String(value),
					);
				}
			}
			return {
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: planSprintText,
						},
					},
				],
			};
		}

		if (request.params.name === "move-ticket") {
			// Replace template variables with arguments
			let moveTicketText = prompt.template;
			if (request.params.arguments) {
				for (const [key, value] of Object.entries(request.params.arguments)) {
					moveTicketText = moveTicketText.replace(
						new RegExp(`{{${key}}}`, "g"),
						String(value),
					);
				}
			}
			return {
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: moveTicketText,
						},
					},
				],
			};
		}

		throw new Error("Prompt implementation not found!");
	});

	server.setRequestHandler(ListToolsRequestSchema, async () => {
		return {
			tools: [
				{
					name: "calculate_sum",
					description: "Add two numbers together",
					inputSchema: {
						type: "object",
						properties: {
							a: { type: "number" },
							b: { type: "number" },
						},
						required: ["a", "b"],
					},
				},
				{
					name: "list-projects",
					description: "List all projects for a user or organization",
					inputSchema: {
						type: "object",
						properties: {
							owner: {
								type: "string",
								description: "GitHub username or organization name",
							},
						},
						required: ["owner"],
					},
				},
				{
					name: "create-project",
					description: "Create a new project",
					inputSchema: {
						type: "object",
						properties: {
							owner: {
								type: "string",
								description: "GitHub username or organization name",
							},
							title: {
								type: "string",
								description: "Title of the project",
							},
							description: {
								type: "string",
								description: "Description of the project",
							},
						},
						required: ["owner", "title"],
					},
				},
				{
					name: "create-iteration",
					description: "Create a new iteration (sprint)",
					inputSchema: {
						type: "object",
						properties: {
							owner: {
								type: "string",
								description: "GitHub username or organization name",
							},
							projectId: {
								type: "string",
								description: "ID of the project",
							},
							title: {
								type: "string",
								description: "Title of the iteration",
							},
							startDate: {
								type: "string",
								description: "Start date of the iteration (ISO format)",
							},
							endDate: {
								type: "string",
								description: "End date of the iteration (ISO format)",
							},
						},
						required: ["owner", "projectId", "title", "startDate", "endDate"],
					},
				},
				{
					name: "list-issues",
					description: "List all issues for a repository",
					inputSchema: {
						type: "object",
						properties: {
							owner: {
								type: "string",
								description: "GitHub username or organization name",
							},
							repo: {
								type: "string",
								description: "Repository name",
							},
						},
						required: ["owner", "repo"],
					},
				},
				{
					name: "create-issue",
					description: "Create a new issue",
					inputSchema: {
						type: "object",
						properties: {
							owner: {
								type: "string",
								description: "GitHub username or organization name",
							},
							repo: {
								type: "string",
								description: "Repository name",
							},
							title: {
								type: "string",
								description: "Title of the issue",
							},
							description: {
								type: "string",
								description: "Description of the issue",
							},
							labels: {
								type: "array",
								items: {
									type: "string",
								},
								description: "Labels for the issue",
							},
							priority: {
								type: "string",
								description:
									"Priority of the issue (low, medium, high, urgent)",
								enum: ["low", "medium", "high", "urgent"],
							},
							points: {
								type: "number",
								description: "Story points for the issue",
							},
						},
						required: ["owner", "repo", "title"],
					},
				},
				{
					name: "update-issue-status",
					description: "Update the status of an issue",
					inputSchema: {
						type: "object",
						properties: {
							owner: {
								type: "string",
								description: "GitHub username or organization name",
							},
							repo: {
								type: "string",
								description: "Repository name",
							},
							issueNumber: {
								type: "number",
								description: "Issue number",
							},
							status: {
								type: "string",
								description:
									"New status (backlog, todo, in_progress, in_review, done)",
								enum: ["backlog", "todo", "in_progress", "in_review", "done"],
							},
						},
						required: ["owner", "repo", "issueNumber", "status"],
					},
				},
			],
		};
	});

	// Handle tool execution
	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		if (request.params.name === "calculate_sum") {
			const args = request.params.arguments || {};
			const a = args.a as number;
			const b = args.b as number;
			return {
				content: [
					{
						type: "text",
						text: String(a + b),
					},
				],
			};
		}

		if (request.params.name === "list-projects") {
			const args = request.params.arguments || {};
			const owner = args.owner as string;
			try {
				const projects = await projectResource.listProjects(owner);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ projects }, null, 2),
						},
					],
				};
			} catch (error) {
				console.error("Error listing projects:", error);
				throw error;
			}
		}

		if (request.params.name === "create-project") {
			const args = request.params.arguments || {};
			const owner = args.owner as string;
			const title = args.title as string;
			const description = (args.description as string) || "";
			try {
				const project = await projectResource.createProject(
					owner,
					title,
					description,
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ project }, null, 2),
						},
					],
				};
			} catch (error) {
				console.error("Error creating project:", error);
				throw error;
			}
		}

		if (request.params.name === "create-iteration") {
			const args = request.params.arguments || {};
			const owner = args.owner as string;
			const projectId = args.projectId as string;
			const title = args.title as string;
			const startDate = args.startDate as string;
			const endDate = args.endDate as string;
			try {
				const iteration = await iterationResource.createIteration(
					owner,
					projectId,
					title,
					startDate,
					endDate,
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ iteration }, null, 2),
						},
					],
				};
			} catch (error) {
				console.error("Error creating iteration:", error);
				throw error;
			}
		}

		if (request.params.name === "list-issues") {
			const args = request.params.arguments || {};
			const owner = args.owner as string;
			const repo = args.repo as string;
			try {
				const issues = await issueResource.listIssues(owner, repo);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ issues }, null, 2),
						},
					],
				};
			} catch (error) {
				console.error("Error listing issues:", error);
				throw error;
			}
		}

		if (request.params.name === "create-issue") {
			const args = request.params.arguments || {};
			const owner = args.owner as string;
			const repo = args.repo as string;
			const title = args.title as string;
			const description = (args.description as string) || "";
			const labels = (args.labels as string[]) || [];
			const priority = (args.priority as IssuePriority) || "medium";
			const points = args.points as number;
			try {
				const issue = await issueResource.createIssue(
					owner,
					repo,
					title,
					description,
					labels,
					priority,
					points,
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ issue }, null, 2),
						},
					],
				};
			} catch (error) {
				console.error("Error creating issue:", error);
				throw error;
			}
		}

		if (request.params.name === "update-issue-status") {
			const args = request.params.arguments || {};
			const owner = args.owner as string;
			const repo = args.repo as string;
			const issueNumber = args.issueNumber as number;
			const status = args.status as IssueStatus;
			try {
				await issueResource.updateIssueStatus(owner, repo, issueNumber, status);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ success: true }, null, 2),
						},
					],
				};
			} catch (error) {
				console.error("Error updating issue status:", error);
				throw error;
			}
		}

		throw new Error(`Tool not found: ${request.params.name}`);
	});

	// Start the server with stdio transport (for Claude Desktop and other MCP hosts)
	const transport = new StdioServerTransport();
	await server.connect(transport);

	return server;
}

// If this file is executed directly, start the server
if (require.main === module) {
	// Get the GitHub token from environment variable
	const githubToken = process.env.GITHUB_TOKEN;

	createMCPServer(githubToken)
		.then(() => {
			console.log("MCP Server started successfully");
		})
		.catch((error) => {
			console.error("Failed to start MCP Server:", error);
			process.exit(1);
		});
}
