import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
	issueOperations,
	projectOperations,
	repositoryOperations,
} from "./operations/index.js";
import {
	CreateIssueSchema,
	GetIssueSchema,
	ListIssuesSchema,
	UpdateIssueSchema,
} from "./operations/issues.js";
import {
	AddProjectV2DraftIssueSchema,
	AddProjectV2ItemByIdSchema,
	ArchiveProjectV2ItemSchema,
	ClearProjectV2ItemFieldValueSchema,
	ConvertProjectV2DraftIssueToIssueSchema,
	CopyProjectV2Schema,
	CreateProjectItemSchema,
	CreateProjectV2FieldSchema,
	CreateProjectV2Schema,
	DeleteProjectV2FieldSchema,
	DeleteProjectV2ItemSchema,
	DeleteProjectV2Schema,
	GetProjectColumnsSchema,
	GetProjectFieldsSchema,
	GetProjectItemsSchema,
	GetProjectSchema,
	ListProjectsSchema,
	MarkProjectV2AsTemplateSchema,
	UnarchiveProjectV2ItemSchema,
	UnmarkProjectV2AsTemplateSchema,
	UpdateProjectItemFieldValueSchema,
	UpdateProjectV2FieldSchema,
	UpdateProjectV2ItemPositionSchema,
	UpdateProjectV2Schema,
	UpdateProjectV2StatusUpdateSchema,
} from "./operations/projects.js";
import {
	GetRepositorySchema,
	ListRepositoriesSchema,
} from "./operations/repositories.js";

type GetIssueParams = typeof GetIssueSchema;
type ListIssuesParams = typeof ListIssuesSchema;
type CreateIssueParams = typeof CreateIssueSchema;
type UpdateIssueParams = typeof UpdateIssueSchema;
type ListRepositoriesParams = typeof ListRepositoriesSchema;
type GetRepositoryParams = typeof GetRepositorySchema;
type GetProjectParams = typeof GetProjectSchema;
type ListProjectsParams = typeof ListProjectsSchema;
type GetProjectColumnsParams = typeof GetProjectColumnsSchema;
type GetProjectFieldsParams = typeof GetProjectFieldsSchema;
type GetProjectItemsParams = typeof GetProjectItemsSchema;
type UpdateProjectItemFieldValueParams =
	typeof UpdateProjectItemFieldValueSchema;
type CreateProjectV2Params = typeof CreateProjectV2Schema;
type UpdateProjectV2Params = typeof UpdateProjectV2Schema;
type DeleteProjectV2Params = typeof DeleteProjectV2Schema;
type CopyProjectV2Params = typeof CopyProjectV2Schema;
type AddProjectV2DraftIssueParams = typeof AddProjectV2DraftIssueSchema;
type ConvertProjectV2DraftIssueToIssueParams =
	typeof ConvertProjectV2DraftIssueToIssueSchema;
type AddProjectV2ItemByIdParams = typeof AddProjectV2ItemByIdSchema;
type UpdateProjectV2ItemPositionParams =
	typeof UpdateProjectV2ItemPositionSchema;
type DeleteProjectV2ItemParams = typeof DeleteProjectV2ItemSchema;
type CreateProjectV2FieldParams = typeof CreateProjectV2FieldSchema;
type UpdateProjectV2FieldParams = typeof UpdateProjectV2FieldSchema;
type DeleteProjectV2FieldParams = typeof DeleteProjectV2FieldSchema;
type UpdateProjectV2StatusUpdateParams =
	typeof UpdateProjectV2StatusUpdateSchema;
type ArchiveProjectV2ItemParams = typeof ArchiveProjectV2ItemSchema;
type UnarchiveProjectV2ItemParams = typeof UnarchiveProjectV2ItemSchema;
type ClearProjectV2ItemFieldValueParams =
	typeof ClearProjectV2ItemFieldValueSchema;
type MarkProjectV2AsTemplateParams = typeof MarkProjectV2AsTemplateSchema;
type UnmarkProjectV2AsTemplateParams = typeof UnmarkProjectV2AsTemplateSchema;
type CreateProjectItemParams = typeof CreateProjectItemSchema;

const server = new McpServer(
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

// Register all prompts with the server
server.prompt(
	"create-sprint-project",
	{
		sprintName: z
			.string()
			.describe("Name of the sprint (e.g., 'Sprint 23', 'Q2 Sprint 1')"),
		startDate: z.string().describe("Start date of the sprint (ISO format)"),
		duration: z
			.string()
			.describe("Duration of sprint in days (typically 7, 14, or 30)"),
		goals: z.string().optional().describe("Primary goals for this sprint"),
	},
	({ sprintName, startDate, duration, goals }) => ({
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `Create a new Sprint (iteration) project for Agile development with the following details:
                - Sprint Name: ${sprintName}
                - Start Date: ${startDate}
                - Duration: ${duration} days${goals ? `\n- Goals: ${goals}` : ""}`,
				},
			},
		],
	}),
);

server.prompt(
	"manage-sprint-backlog",
	{
		projectId: z.string().describe("GitHub Project ID to manage"),
		filterStatus: z
			.string()
			.optional()
			.describe("Filter issues by status (e.g., 'Todo', 'In Progress')"),
		prioritizationStrategy: z
			.string()
			.optional()
			.describe(
				"Strategy for prioritization (e.g., 'value-based', 'effort-based')",
			),
	},
	({ projectId, filterStatus, prioritizationStrategy }) => ({
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `Organize and prioritize issues in the sprint backlog:
                - Project ID: ${projectId}${filterStatus ? `\n- Filter Status: ${filterStatus}` : ""}${prioritizationStrategy ? `\n- Prioritization Strategy: ${prioritizationStrategy}` : ""}`,
				},
			},
		],
	}),
);

server.prompt(
	"track-sprint-progress",
	{
		projectId: z.string().describe("GitHub Project ID to track"),
		includeBurndown: z
			.string()
			.optional()
			.describe("Whether to include burndown metrics"),
		highlightBlockers: z
			.string()
			.optional()
			.describe("Whether to highlight blocked issues"),
	},
	({ projectId, includeBurndown, highlightBlockers }) => ({
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `Generate a status report of the current sprint progress:
                 - Project ID: ${projectId}${includeBurndown ? "\n- Include burndown metrics" : ""}${highlightBlockers ? "\n- Highlight blocked issues" : ""}`,
				},
			},
		],
	}),
);

server.prompt(
	"prepare-sprint-retrospective",
	{
		completedProjectId: z
			.string()
			.describe("GitHub Project ID of the completed sprint"),
		includeMetrics: z
			.string()
			.optional()
			.describe("Include completion metrics and statistics"),
		createNextSprint: z
			.string()
			.optional()
			.describe("Automatically create next sprint project"),
	},
	({ completedProjectId, includeMetrics, createNextSprint }) => ({
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `Prepare a retrospective report and plan for the next sprint:
- Completed Project ID: ${completedProjectId}${includeMetrics ? "\n- Include completion metrics and statistics" : ""}${createNextSprint ? "\n- Automatically create next sprint project" : ""}`,
				},
			},
		],
	}),
);

server.prompt(
	"create-project-template",
	{
		templateName: z.string().describe("Name for the template"),
		customFields: z
			.string()
			.optional()
			.describe("Custom fields to include (e.g., 'Story Points', 'Priority')"),
		statusColumns: z
			.string()
			.optional()
			.describe(
				"Status columns to create (e.g., 'Todo,In Progress,Review,Done')",
			),
	},
	({ templateName, customFields, statusColumns }) => ({
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `Create a reusable project template for future sprints:
- Template Name: ${templateName}${customFields ? `\n- Custom Fields: ${customFields}` : ""}${statusColumns ? `\n- Status Columns: ${statusColumns}` : ""}`,
				},
			},
		],
	}),
);

server.prompt(
	"review-code",
	{
		code: z.string().describe("Code to review"),
	},
	({ code }) => ({
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `Please review this code:\n\n${code}`,
				},
			},
		],
	}),
);

// Define tools metadata
server.tool<GetRepositoryParams>(
	"get-repository",
	"Get a GitHub repository by owner and name",
	GetRepositorySchema,
	async (params) => {
		const result = await repositoryOperations.getRepository(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<ListRepositoriesParams>(
	"list-repositories",
	"List repositories for a user",
	ListRepositoriesSchema,
	async (params) => {
		const result = await repositoryOperations.listRepositories(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<GetProjectParams>(
	"get-project",
	"Get a GitHub Project by ID",
	GetProjectSchema,
	async (params) => {
		const result = await projectOperations.getProject(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<ListProjectsParams>(
	"list-projects",
	"List GitHub Projects for a user",
	ListProjectsSchema,
	async (params) => {
		const result = await projectOperations.listProjects(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<GetProjectColumnsParams>(
	"get-project-columns",
	"Get status columns for a GitHub Project",
	GetProjectColumnsSchema,
	async (params) => {
		const result = await projectOperations.getProjectColumns(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<GetProjectFieldsParams>(
	"get-project-fields",
	"Get fields for a GitHub Project",
	GetProjectFieldsSchema,
	async (params) => {
		const result = await projectOperations.getProjectFields(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<GetProjectItemsParams>(
	"get-project-items",
	"Get items (issues) from a GitHub Project",
	GetProjectItemsSchema,
	async (params) => {
		const result = await projectOperations.getProjectItems(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<CreateProjectItemParams>(
	"create-project-item",
	"Add an issue or PR to a GitHub Project",
	CreateProjectItemSchema,
	async (params) => {
		const result = await projectOperations.createProjectItem(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UpdateProjectItemFieldValueParams>(
	"update-project-item-field",
	"Update a field value for a project item",
	UpdateProjectItemFieldValueSchema,
	async (params) => {
		const result = await projectOperations.updateProjectItemFieldValue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<CreateProjectV2Params>(
	"create-project",
	"Create a new GitHub Project",
	CreateProjectV2Schema,
	async (params) => {
		const result = await projectOperations.createProjectV2(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UpdateProjectV2Params>(
	"update-project",
	"Update an existing GitHub Project",
	UpdateProjectV2Schema,
	async (params) => {
		const result = await projectOperations.updateProjectV2(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<DeleteProjectV2Params>(
	"delete-project",
	"Delete a GitHub Project",
	DeleteProjectV2Schema,
	async (params) => {
		const result = await projectOperations.deleteProjectV2(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<CopyProjectV2Params>(
	"copy-project",
	"Copy a GitHub Project",
	CopyProjectV2Schema,
	async (params) => {
		const result = await projectOperations.copyProjectV2(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<AddProjectV2DraftIssueParams>(
	"add-draft-issue",
	"Add a draft issue to a GitHub Project",
	AddProjectV2DraftIssueSchema,
	async (params) => {
		const result = await projectOperations.addProjectV2DraftIssue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<ConvertProjectV2DraftIssueToIssueParams>(
	"convert-draft-issue",
	"Convert a draft issue to a regular issue",
	ConvertProjectV2DraftIssueToIssueSchema,
	async (params) => {
		const result =
			await projectOperations.convertProjectV2DraftIssueToIssue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<AddProjectV2ItemByIdParams>(
	"add-item-to-project",
	"Add an existing issue or PR to a GitHub Project",
	AddProjectV2ItemByIdSchema,
	async (params) => {
		const result = await projectOperations.addProjectV2ItemById(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UpdateProjectV2ItemPositionParams>(
	"update-item-position",
	"Update the position of an item in a GitHub Project",
	UpdateProjectV2ItemPositionSchema,
	async (params) => {
		const result = await projectOperations.updateProjectV2ItemPosition(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<DeleteProjectV2ItemParams>(
	"delete-project-item",
	"Remove an item from a GitHub Project",
	DeleteProjectV2ItemSchema,
	async (params) => {
		const result = await projectOperations.deleteProjectV2Item(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<CreateProjectV2FieldParams>(
	"create-project-field",
	"Create a new field in a GitHub Project",
	CreateProjectV2FieldSchema,
	async (params) => {
		const result = await projectOperations.createProjectV2Field(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UpdateProjectV2FieldParams>(
	"update-project-field",
	"Update a field in a GitHub Project",
	UpdateProjectV2FieldSchema,
	async (params) => {
		const result = await projectOperations.updateProjectV2Field(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<DeleteProjectV2FieldParams>(
	"delete-project-field",
	"Delete a field from a GitHub Project",
	DeleteProjectV2FieldSchema,
	async (params) => {
		const result = await projectOperations.deleteProjectV2Field(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UpdateProjectV2StatusUpdateParams>(
	"update-project-status",
	"Update the status of a GitHub Project",
	UpdateProjectV2StatusUpdateSchema,
	async (params) => {
		const result = await projectOperations.updateProjectV2StatusUpdate(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<ArchiveProjectV2ItemParams>(
	"archive-project-item",
	"Archive an item in a GitHub Project",
	ArchiveProjectV2ItemSchema,
	async (params) => {
		const result = await projectOperations.archiveProjectV2Item(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UnarchiveProjectV2ItemParams>(
	"unarchive-project-item",
	"Unarchive an item in a GitHub Project",
	UnarchiveProjectV2ItemSchema,
	async (params) => {
		const result = await projectOperations.unarchiveProjectV2Item(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<ClearProjectV2ItemFieldValueParams>(
	"clear-item-field-value",
	"Clear a field value for an item in a GitHub Project",
	ClearProjectV2ItemFieldValueSchema,
	async (params) => {
		const result = await projectOperations.clearProjectV2ItemFieldValue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<MarkProjectV2AsTemplateParams>(
	"mark-project-as-template",
	"Mark a GitHub Project as a template",
	MarkProjectV2AsTemplateSchema,
	async (params) => {
		const result = await projectOperations.markProjectV2AsTemplate(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UnmarkProjectV2AsTemplateParams>(
	"unmark-project-as-template",
	"Unmark a GitHub Project as a template",
	UnmarkProjectV2AsTemplateSchema,
	async (params) => {
		const result = await projectOperations.unmarkProjectV2AsTemplate(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<GetIssueParams>(
	"get-issue",
	"Get a GitHub issue by number",
	GetIssueSchema,
	async (params) => {
		const result = await issueOperations.getIssue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<ListIssuesParams>(
	"list-issues",
	"List issues for a repository",
	ListIssuesSchema,
	async (params) => {
		const result = await issueOperations.listIssues(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<CreateIssueParams>(
	"create-issue",
	"Create a new GitHub issue",
	CreateIssueSchema,
	async (params) => {
		const result = await issueOperations.createIssue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

server.tool<UpdateIssueParams>(
	"update-issue",
	"Update an existing GitHub issue",
	UpdateIssueSchema,
	async (params) => {
		const result = await issueOperations.updateIssue(params);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
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
