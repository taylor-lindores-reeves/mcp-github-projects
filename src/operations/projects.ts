import { z } from "zod";
// Import GraphQL operations
import {
	addProjectV2DraftIssue,
	addProjectV2ItemById,
	archiveProjectV2Item,
	clearProjectV2ItemFieldValue,
	convertProjectV2DraftIssueToIssue,
	copyProjectV2,
	createProjectV2,
	createProjectV2Field,
	deleteProjectV2,
	deleteProjectV2Field,
	deleteProjectV2Item,
	getProject,
	getProjectColumns,
	getProjectFields,
	getProjectItems,
	listProjects,
	markProjectV2AsTemplate,
	unarchiveProjectV2Item,
	unmarkProjectV2AsTemplate,
	updateProjectItemFieldValue,
	updateProjectV2,
	updateProjectV2Field,
	updateProjectV2ItemPosition,
	updateProjectV2StatusUpdate,
} from "../graphql/projects/index.js";
import {
	type AddProjectItemMutation,
	type AddProjectItemMutationVariables,
	type AddProjectV2DraftIssueInput,
	type AddProjectV2DraftIssueMutation,
	type AddProjectV2DraftIssueMutationVariables,
	type AddProjectV2ItemByIdInput,
	type ArchiveProjectV2ItemInput,
	type ArchiveProjectV2ItemMutation,
	type ArchiveProjectV2ItemMutationVariables,
	type ClearProjectV2ItemFieldValueInput,
	type ClearProjectV2ItemFieldValueMutation,
	type ClearProjectV2ItemFieldValueMutationVariables,
	type ConvertProjectV2DraftIssueItemToIssueInput,
	type ConvertProjectV2DraftIssueItemToIssueMutation,
	type ConvertProjectV2DraftIssueItemToIssueMutationVariables,
	type CopyProjectV2Input,
	type CopyProjectV2Mutation,
	type CopyProjectV2MutationVariables,
	type CreateProjectV2FieldInput,
	type CreateProjectV2FieldMutation,
	type CreateProjectV2FieldMutationVariables,
	type CreateProjectV2Input,
	type CreateProjectV2Mutation,
	type CreateProjectV2MutationVariables,
	type DeleteProjectV2FieldInput,
	type DeleteProjectV2FieldMutation,
	type DeleteProjectV2FieldMutationVariables,
	type DeleteProjectV2Input,
	type DeleteProjectV2ItemInput,
	type DeleteProjectV2ItemMutation,
	type DeleteProjectV2ItemMutationVariables,
	type DeleteProjectV2Mutation,
	type DeleteProjectV2MutationVariables,
	type GetProjectColumnsQuery,
	type GetProjectColumnsQueryVariables,
	type GetProjectFieldsQuery,
	type GetProjectFieldsQueryVariables,
	type GetProjectItemsQuery,
	type GetProjectItemsQueryVariables,
	type GetProjectQuery,
	type GetProjectQueryVariables,
	type ListProjectsQuery,
	type ListProjectsQueryVariables,
	type MarkProjectV2AsTemplateInput,
	type MarkProjectV2AsTemplateMutation,
	type MarkProjectV2AsTemplateMutationVariables,
	ProjectV2CustomFieldType,
	type ProjectV2FieldValue,
	ProjectV2SingleSelectFieldOptionColor,
	ProjectV2StatusUpdateStatus,
	type UnarchiveProjectV2ItemInput,
	type UnarchiveProjectV2ItemMutation,
	type UnarchiveProjectV2ItemMutationVariables,
	type UnmarkProjectV2AsTemplateInput,
	type UnmarkProjectV2AsTemplateMutation,
	type UnmarkProjectV2AsTemplateMutationVariables,
	type UpdateProjectItemFieldMutation,
	type UpdateProjectItemFieldMutationVariables,
	type UpdateProjectV2FieldInput,
	type UpdateProjectV2FieldMutation,
	type UpdateProjectV2FieldMutationVariables,
	type UpdateProjectV2Input,
	type UpdateProjectV2ItemFieldValueInput,
	type UpdateProjectV2ItemPositionInput,
	type UpdateProjectV2ItemPositionMutation,
	type UpdateProjectV2ItemPositionMutationVariables,
	type UpdateProjectV2Mutation,
	type UpdateProjectV2MutationVariables,
	type UpdateProjectV2StatusUpdateInput,
	type UpdateProjectV2StatusUpdateMutation,
	type UpdateProjectV2StatusUpdateMutationVariables,
} from "../types/github-api-types.js";
import { GitHubClient } from "./github-client.js";

// Schema definitions for tool input validation
export const GetProjectSchema = {
	id: z.string().describe("GitHub Project ID"),
};

export const ListProjectsSchema = {
	login: z
		.string()
		.describe("GitHub user or organization login")
		.default(process.env.GITHUB_OWNER as string),
	first: z.number().describe("Number of projects to return (max 100)"),
	after: z.string().describe("Cursor for pagination"),
};

export const GetProjectColumnsSchema = {
	id: z.string().describe("GitHub Project ID"),
};

export const GetProjectFieldsSchema = {
	id: z.string().describe("GitHub Project ID"),
};

export const GetProjectItemsSchema = {
	id: z.string().describe("GitHub Project ID"),
	first: z.number().describe("Number of items to return (max 100)"),
	after: z.string().describe("Cursor for pagination"),
	filter: z
		.string()

		.describe("Filter for items (e.g., status field value)"),
};

export const FieldValueSchema = z
	.object({
		singleSelectOptionId: z
			.string()
			.optional()
			.describe("The id of the single select option to set on the field."),
		iterationId: z
			.string()
			.optional()
			.describe("The id of the iteration to set on the field."),
		date: z
			.string()
			.optional()
			.describe("The ISO 8601 date to set on the field."),
		number: z.number().optional().describe("The number to set on the field."),
		text: z.string().optional().describe("The text to set on the field."),
	})
	.refine(
		(data) => {
			// Count defined values (not undefined, not null, and not empty string)
			const definedCount = Object.values(data).filter(
				(value) => value !== undefined && value !== null && value !== "",
			).length;

			// Exactly one value must be provided
			return definedCount === 1;
		},
		{
			message: "Exactly one value must be provided.",
		},
	)
	.transform((data) => {
		// Create a new object with only defined values
		const result = {} as ProjectV2FieldValue;

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				result[key as keyof ProjectV2FieldValue] = value;
			}
		}

		return result;
	});

export const UpdateProjectItemFieldValueSchema = {
	projectId: z.string().describe("The ID of the Project."),
	itemId: z.string().describe("The ID of the item to be updated."),
	fieldId: z.string().describe("The ID of the field to be updated."),
	value: FieldValueSchema.describe(
		"The values that can be used to update a field of an item inside a Project. Only 1 value can be updated at a time.",
	),
	clientMutationId: z
		.string()

		.describe(
			"A unique string identifier for the client performing the mutation.",
		)
		.default(Date.now().toString()),
};

export const BulkUpdateProjectItemFieldValueSchema = {
	projectId: z.string().describe("The ID of the Project."),
	itemIds: z.array(z.string()).describe("The IDs of the items to be updated."),
	fieldId: z.string().describe("The ID of the field to be updated."),
	value: FieldValueSchema.describe(
		"The values that can be used to update a field of an item inside a Project. Only 1 value can be updated at a time.",
	),
	clientMutationId: z
		.string()
		.describe(
			"A unique string identifier for the client performing the mutation.",
		)
		.default(Date.now().toString()),
};

// New schema definitions for Project V2 operations
export const CreateProjectV2Schema = {
	ownerId: z.string().describe("The owner ID to create the project under."),
	title: z.string().describe("The title of the project."),
	clientMutationId: z.string().default(Date.now().toString()),
	repositoryId: z.string().describe("The repository to link the project to."),
	teamId: z
		.string()
		.describe(
			"The team to link the project to. The team will be granted read permissions.",
		),
};

export const UpdateProjectV2Schema = {
	projectId: z.string().describe("The ID of the Project to update."),
	title: z.string().describe("Set the title of the project."),
	shortDescription: z
		.string()

		.describe("Set the short description of the project."),
	public: z
		.boolean()

		.describe("Set the project to public or private."),
	closed: z.boolean().describe("Set the project to closed or open."),
	clientMutationId: z.string().default(Date.now().toString()),
	readme: z
		.string()

		.describe("Set the readme description of the project."),
};

export const DeleteProjectV2Schema = {
	projectId: z.string().describe("The ID of the Project to delete."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const CopyProjectV2Schema = {
	projectId: z.string().describe("The ID of the source Project to copy."),
	ownerId: z.string().describe("The owner ID of the new project."),
	title: z.string().describe("The title of the project."),
	includeDraftIssues: z
		.boolean()

		.describe("Include draft issues in the new project"),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const AddProjectV2DraftIssueSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project to add the draft issue to."),
	title: z
		.string()
		.describe(
			"The title of the draft issue. A project item can also be created by providing the URL of an Issue or Pull Request if you have access.",
		),
	body: z.string().describe("The body of the draft issue."),
	assigneeIds: z
		.array(z.string())

		.describe("The IDs of the assignees of the draft issue."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const ConvertProjectV2DraftIssueToIssueSchema = {
	itemId: z
		.string()
		.describe("The ID of the draft issue ProjectV2Item to convert."),
	repositoryId: z
		.string()
		.describe("The ID of the repository to create the issue in."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const AddProjectV2ItemByIdSchema = {
	projectId: z.string().describe("The ID of the Project to add the item to."),
	contentId: z.string().describe("The id of the Issue or Pull Request to add."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const UpdateProjectV2ItemPositionSchema = {
	projectId: z.string().describe("The ID of the Project."),
	itemId: z.string().describe("The ID of the item to be moved."),
	afterId: z
		.string()

		.describe(
			"The ID of the item to position this item after. If omitted or set to null the item will be moved to top.",
		),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const DeleteProjectV2ItemSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project from which the item should be removed."),
	itemId: z.string().describe("The ID of the item to be removed."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const CreateProjectV2FieldSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project to create the field in."),
	dataType: z
		.nativeEnum(ProjectV2CustomFieldType)
		.describe("The data type of the field."),
	name: z.string().describe("The name of the field."),
	singleSelectOptions: z
		.array(
			z.object({
				name: z.string().describe("The name of the option"),
				description: z.string().describe("The description text of the option"),
				color: z
					.nativeEnum(ProjectV2SingleSelectFieldOptionColor)
					.describe("The display color of the option"),
			}),
		)

		.describe(
			"Options for a single select field. At least one value is required if data_type is SINGLE_SELECT",
		),
	clientMutationId: z.string().default(Date.now().toString()),
	iterationConfiguration: z.object({
		startDate: z
			.string()

			.describe("The start date for the first iteration."),
		duration: z.number().describe("The duration of each iteration, in days."),
		iterations: z
			.array(
				z.object({
					duration: z
						.number()
						.describe("The duration of the iteration, in days."),
					startDate: z.string().describe("The start date for the iteration."),
					title: z.string().describe("The title for the iteration."),
				}),
			)
			.describe("Zero or more iterations for the field."),
	}),
};

export const UpdateProjectV2FieldSchema = {
	fieldId: z.string().describe("The ID of the field to update."),
	name: z.string().describe("The name to update."),
	singleSelectOptions: z
		.array(
			z.object({
				name: z.string().describe("The name of the option"),
				description: z.string().describe("The description text of the option"),
				color: z
					.nativeEnum(ProjectV2SingleSelectFieldOptionColor)
					.describe("The display color of the option"),
			}),
		)

		.describe(
			"Options for a field of type SINGLE_SELECT. If empty, no changes will be made to the options. If values are present, they will overwrite the existing options for the field.",
		),
	clientMutationId: z.string().default(Date.now().toString()),
	iterationConfiguration: z
		.object({
			duration: z.number().describe("The duration of each iteration, in days."),
			iterations: z
				.array(
					z.object({
						duration: z
							.number()
							.describe("The duration of the iteration, in days."),
						startDate: z.string().describe("The start date for the iteration."),
						title: z.string().describe("The title for the iteration."),
					}),
				)
				.describe("Zero or more iterations for the field."),
			startDate: z.string().describe("The start date for the first iteration."),
		})
		.describe("Configuration for an iteration field."),
};

export const DeleteProjectV2FieldSchema = {
	fieldId: z.string().describe("The ID of the field to delete."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const UpdateProjectV2StatusUpdateSchema = {
	statusUpdateId: z
		.string()
		.describe("The ID of the status update to be updated."),
	clientMutationId: z.string().default(Date.now().toString()),
	body: z.string().describe("The body of the status update."),
	startDate: z
		.string()

		.describe("The start date of the status update."),
	targetDate: z
		.string()

		.describe("The target date of the status update."),
	status: z
		.nativeEnum(ProjectV2StatusUpdateStatus)

		.describe("The status of the status update."),
};

export const ArchiveProjectV2ItemSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project to archive the item from."),
	itemId: z.string().describe("The ID of the ProjectV2Item to archive."),
	clientMutationId: z
		.string()

		.describe(
			"A unique string identifier for the client performing the mutation.",
		),
};

export const UnarchiveProjectV2ItemSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project to archive the item from."),
	itemId: z.string().describe("The ID of the ProjectV2Item to unarchive."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const ClearProjectV2ItemFieldValueSchema = {
	projectId: z.string().describe("The ID of the Project."),
	itemId: z.string().describe("The ID of the item to be cleared."),
	fieldId: z.string().describe("The ID of the field to be cleared."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const MarkProjectV2AsTemplateSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project to mark as a template."),
	clientMutationId: z.string().default(Date.now().toString()),
};

export const UnmarkProjectV2AsTemplateSchema = {
	projectId: z
		.string()
		.describe("The ID of the Project to unmark as a template."),
	clientMutationId: z.string().default(Date.now().toString()),
};

interface BulkUpdateProjectV2ItemFieldValueInput
	extends Omit<UpdateProjectV2ItemFieldValueInput, "itemId"> {
	itemIds: string[];
}

// Project operations class
export class ProjectOperations {
	private client: GitHubClient;
	private owner: string;

	constructor() {
		this.client = new GitHubClient();
		this.owner = process.env.GITHUB_OWNER as string;
	}

	async getProject(params: GetProjectQueryVariables) {
		return this.client.graphql<GetProjectQuery, GetProjectQueryVariables>(
			getProject,
			params,
		);
	}

	async listProjects(params: ListProjectsQueryVariables) {
		const result = await this.client.graphql<
			ListProjectsQuery,
			ListProjectsQueryVariables
		>(listProjects, {
			login: this.owner,
			first: params?.first || 20,
			after: params?.after || null,
		});

		// Determine if the response contains user data
		const projectData = result.user?.projectsV2;

		if (!projectData) {
			return {
				projects: [],
				pageInfo: { hasNextPage: false, endCursor: null },
			};
		}

		return {
			projects: projectData.nodes,
			pageInfo: projectData.pageInfo,
		};
	}

	/**
	 * Get status columns (fields) for a GitHub Project
	 */
	async getProjectColumns(params: GetProjectColumnsQueryVariables) {
		const result = await this.client.graphql<
			GetProjectColumnsQuery,
			GetProjectColumnsQueryVariables
		>(getProjectColumns, params);

		if (!result.node?.fields?.nodes) {
			return { columns: [] };
		}

		// Extract only the single select fields (as these are usually columns/statuses)
		const statusColumns = result.node.fields.nodes
			.filter((field) => field?.options)
			.map((field) => ({
				id: field?.id,
				name: field?.name,
				options: field?.options,
			}));

		return { columns: statusColumns };
	}

	/**
	 * Get all fields for a GitHub Project
	 */
	async getProjectFields(params: GetProjectFieldsQueryVariables) {
		const result = await this.client.graphql<
			GetProjectFieldsQuery,
			GetProjectFieldsQueryVariables
		>(getProjectFields, { id: params.id });

		if (!result.node) {
			return { fields: [] };
		}

		return { fields: result.node.fields.nodes };
	}

	/**
	 * Get items from a GitHub Project
	 */
	async getProjectItems(params: GetProjectItemsQueryVariables) {
		const result = await this.client.graphql<
			GetProjectItemsQuery,
			GetProjectItemsQueryVariables
		>(getProjectItems, {
			id: params.id,
			first: params.first || 20,
			after: params.after,
		});

		if (!result.node) {
			return { items: [], pageInfo: { hasNextPage: false, endCursor: null } };
		}

		return {
			items: result.node.items.nodes,
			pageInfo: result.node.items.pageInfo,
		};
	}

	/**
	 * Update a field value for a project item
	 */
	async updateProjectItemFieldValue(input: UpdateProjectV2ItemFieldValueInput) {
		// The value format depends on the field type
		const result = await this.client.graphql<
			UpdateProjectItemFieldMutation,
			UpdateProjectItemFieldMutationVariables
		>(updateProjectItemFieldValue, { input });

		return {
			success: true,
			itemId: result.updateProjectV2ItemFieldValue?.projectV2Item?.id,
		};
	}

	async bulkUpdateProjectItemFieldValue(
		input: BulkUpdateProjectV2ItemFieldValueInput,
	) {
		const results = [];
		const { itemIds, ...singleItemInput } = input; // Remove itemIds from the input

		for (const itemId of itemIds) {
			try {
				const result = await this.updateProjectItemFieldValue({
					...singleItemInput,
					itemId,
					clientMutationId: `bulk-update-${Date.now()}-${itemId}`,
				});
				results.push({ itemId, success: result.success });
			} catch (error) {
				results.push({ itemId, success: false, error });
			}
		}

		return results;
	}

	/**
	 * Create a new GitHub Project V2
	 */
	async createProjectV2(input: CreateProjectV2Input) {
		return this.client.graphql<
			CreateProjectV2Mutation,
			CreateProjectV2MutationVariables
		>(createProjectV2, { input });
	}

	/**
	 * Update an existing GitHub Project V2
	 */
	async updateProjectV2(input: UpdateProjectV2Input) {
		return this.client.graphql<
			UpdateProjectV2Mutation,
			UpdateProjectV2MutationVariables
		>(updateProjectV2, { input });
	}

	/**
	 * Delete a GitHub Project V2
	 */
	async deleteProjectV2(input: DeleteProjectV2Input) {
		return this.client.graphql<
			DeleteProjectV2Mutation,
			DeleteProjectV2MutationVariables
		>(deleteProjectV2, { input });
	}

	/**
	 * Copy a GitHub Project V2
	 */
	async copyProjectV2(input: CopyProjectV2Input) {
		return this.client.graphql<
			CopyProjectV2Mutation,
			CopyProjectV2MutationVariables
		>(copyProjectV2, { input });
	}

	/**
	 * Add draft issue to a GitHub Project V2
	 */
	async addProjectV2DraftIssue(input: AddProjectV2DraftIssueInput) {
		return this.client.graphql<
			AddProjectV2DraftIssueMutation,
			AddProjectV2DraftIssueMutationVariables
		>(addProjectV2DraftIssue, {
			input,
		});
	}

	/**
	 * Convert draft issue to a regular issue
	 */
	async convertProjectV2DraftIssueToIssue(
		input: ConvertProjectV2DraftIssueItemToIssueInput,
	) {
		return await this.client.graphql<
			ConvertProjectV2DraftIssueItemToIssueMutation,
			ConvertProjectV2DraftIssueItemToIssueMutationVariables
		>(convertProjectV2DraftIssueToIssue, { input });
	}

	/**
	 * Add an existing issue or PR to a project
	 */
	async addProjectV2ItemById(input: AddProjectV2ItemByIdInput) {
		return this.client.graphql<
			AddProjectItemMutation,
			AddProjectItemMutationVariables
		>(addProjectV2ItemById, { input });
	}

	/**
	 * Update position of a project item
	 */
	async updateProjectV2ItemPosition(input: UpdateProjectV2ItemPositionInput) {
		return this.client.graphql<
			UpdateProjectV2ItemPositionMutation,
			UpdateProjectV2ItemPositionMutationVariables
		>(updateProjectV2ItemPosition, { input });
	}

	/**
	 * Delete a project item
	 */
	async deleteProjectV2Item(input: DeleteProjectV2ItemInput) {
		return this.client.graphql<
			DeleteProjectV2ItemMutation,
			DeleteProjectV2ItemMutationVariables
		>(deleteProjectV2Item, { input });
	}

	/**
	 * Create a new field in a project
	 */
	async createProjectV2Field(input: CreateProjectV2FieldInput) {
		const singleSelectOptions = input.singleSelectOptions?.map((option) => ({
			name: option.name,
			description: option.description,
			color: option.color,
		}));

		return this.client.graphql<
			CreateProjectV2FieldMutation,
			CreateProjectV2FieldMutationVariables
		>(createProjectV2Field, {
			input: {
				...input,
				singleSelectOptions: singleSelectOptions || [],
			},
		});
	}

	/**
	 * Update a project field
	 */
	async updateProjectV2Field(input: UpdateProjectV2FieldInput) {
		const singleSelectOptions = input.singleSelectOptions?.map((option) => ({
			name: option.name,
			description: option.description,
			color: option.color,
		}));

		return this.client.graphql<
			UpdateProjectV2FieldMutation,
			UpdateProjectV2FieldMutationVariables
		>(updateProjectV2Field, {
			input: {
				...input,
				singleSelectOptions: singleSelectOptions || [],
			},
		});
	}

	/**
	 * Delete a project field
	 */
	async deleteProjectV2Field(input: DeleteProjectV2FieldInput) {
		return this.client.graphql<
			DeleteProjectV2FieldMutation,
			DeleteProjectV2FieldMutationVariables
		>(deleteProjectV2Field, { input });
	}

	/**
	 * Update project status update
	 */
	async updateProjectV2StatusUpdate(input: UpdateProjectV2StatusUpdateInput) {
		return this.client.graphql<
			UpdateProjectV2StatusUpdateMutation,
			UpdateProjectV2StatusUpdateMutationVariables
		>(updateProjectV2StatusUpdate, { input });
	}

	/**
	 * Archive a project item
	 */
	async archiveProjectV2Item(input: ArchiveProjectV2ItemInput) {
		return this.client.graphql<
			ArchiveProjectV2ItemMutation,
			ArchiveProjectV2ItemMutationVariables
		>(archiveProjectV2Item, { input });
	}

	/**
	 * Unarchive a project item
	 */
	async unarchiveProjectV2Item(input: UnarchiveProjectV2ItemInput) {
		return this.client.graphql<
			UnarchiveProjectV2ItemMutation,
			UnarchiveProjectV2ItemMutationVariables
		>(unarchiveProjectV2Item, { input });
	}

	/**
	 * Clear a field value for a project item
	 */
	async clearProjectV2ItemFieldValue(input: ClearProjectV2ItemFieldValueInput) {
		return this.client.graphql<
			ClearProjectV2ItemFieldValueMutation,
			ClearProjectV2ItemFieldValueMutationVariables
		>(clearProjectV2ItemFieldValue, { input });
	}

	/**
	 * Mark a project as a template
	 */
	async markProjectV2AsTemplate(input: MarkProjectV2AsTemplateInput) {
		return this.client.graphql<
			MarkProjectV2AsTemplateMutation,
			MarkProjectV2AsTemplateMutationVariables
		>(markProjectV2AsTemplate, {
			input,
		});
	}

	/**
	 * Unmark a project as a template
	 */
	async unmarkProjectV2AsTemplate(input: UnmarkProjectV2AsTemplateInput) {
		return this.client.graphql<
			UnmarkProjectV2AsTemplateMutation,
			UnmarkProjectV2AsTemplateMutationVariables
		>(unmarkProjectV2AsTemplate, { input });
	}
}
