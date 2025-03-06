import { z } from "zod";
import { GitHubClient } from "./github-client.js";

// Schema definitions for tool input validation
export const GetProjectSchema = {
	projectId: z.string().describe("GitHub Project ID"),
};

export const ListProjectsSchema = {
	owner: z.string().describe("GitHub username"),
	first: z
		.number()
		.optional()
		.describe("Number of projects to return (max 100)"),
	after: z.string().optional().describe("Cursor for pagination"),
};

export const GetProjectColumnsSchema = {
	projectId: z.string().describe("GitHub Project ID"),
};

export const GetProjectFieldsSchema = {
	projectId: z.string().describe("GitHub Project ID"),
};

export const GetProjectItemsSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	first: z.number().optional().describe("Number of items to return (max 100)"),
	after: z.string().optional().describe("Cursor for pagination"),
	filter: z
		.string()
		.optional()
		.describe("Filter for items (e.g., status field value)"),
};

// Type for field values in projects
export const FieldValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.object({
		singleSelectOptionId: z.string().describe("ID of the single select option"),
	}),
	z.object({
		iterationId: z.string().describe("ID of the iteration"),
	}),
	z.object({
		date: z.string().describe("ISO date string"),
	}),
]);

export const CreateProjectItemSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	contentId: z.string().describe("ID of the content to add (issue or PR ID)"),
	fieldValues: z
		.array(
			z.object({
				fieldId: z.string().describe("ID of the field"),
				value: FieldValueSchema.describe("Value to set for the field"),
			}),
		)
		.optional()
		.describe("Field values to set for the item"),
};

export const UpdateProjectItemFieldValueSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item"),
	fieldId: z.string().describe("ID of the field to update"),
	value: FieldValueSchema.describe("New value for the field"),
};

// New schema definitions for Project V2 operations
export const CreateProjectV2Schema = {
	ownerId: z.string().describe("Owner ID (user or organization)"),
	title: z.string().describe("Project title"),
	description: z.string().optional().describe("Project description"),
	repositoryId: z
		.string()
		.optional()
		.describe("Repository ID to link the project to"),
};

export const UpdateProjectV2Schema = {
	projectId: z.string().describe("GitHub Project ID"),
	title: z.string().optional().describe("New project title"),
	description: z.string().optional().describe("New project description"),
	shortDescription: z.string().optional().describe("New short description"),
	public: z.boolean().optional().describe("Project visibility"),
	closed: z.boolean().optional().describe("Project closed status"),
};

export const DeleteProjectV2Schema = {
	projectId: z.string().describe("GitHub Project ID to delete"),
};

export const CopyProjectV2Schema = {
	projectId: z.string().describe("Source GitHub Project ID to copy"),
	ownerId: z.string().describe("New owner ID"),
	title: z.string().optional().describe("Title for the new project"),
	includeFields: z
		.boolean()
		.optional()
		.describe("Whether to include fields in the copied project")
		.default(true),
	includeItems: z
		.boolean()
		.optional()
		.describe("Whether to include items in the copied project")
		.default(false),
};

export const AddProjectV2DraftIssueSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	title: z.string().describe("Draft issue title"),
	body: z.string().optional().describe("Draft issue body"),
	assigneeIds: z
		.array(z.string())
		.optional()
		.describe("IDs of users to assign"),
};

export const ConvertProjectV2DraftIssueToIssueSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	draftIssueId: z.string().describe("Draft issue ID to convert"),
	repositoryId: z.string().describe("Repository ID where to create the issue"),
	title: z.string().optional().describe("Title for the new issue"),
	body: z.string().optional().describe("Body for the new issue"),
};

export const AddProjectV2ItemByIdSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	contentId: z.string().describe("ID of the content to add (issue or PR ID)"),
};

export const UpdateProjectV2ItemPositionSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item to reposition"),
	afterId: z.string().optional().describe("ID of the item to position after"),
};

export const DeleteProjectV2ItemSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item to delete"),
};

export const CreateProjectV2FieldSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	dataType: z
		.enum(["TEXT", "NUMBER", "DATE", "SINGLE_SELECT", "ITERATION"])
		.describe("Field data type"),
	name: z.string().describe("Field name"),
	singleSelectOptions: z
		.array(
			z.object({
				name: z.string().describe("Option name"),
				description: z.string().optional().describe("Option description"),
				color: z
					.string()
					.optional()
					.describe("Option color (e.g., BLUE, GREEN, RED)"),
			}),
		)
		.optional()
		.describe("Options for single select field"),
};

export const UpdateProjectV2FieldSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	fieldId: z.string().describe("ID of the field to update"),
	name: z.string().optional().describe("New field name"),
	dataType: z
		.enum(["TEXT", "NUMBER", "DATE", "SINGLE_SELECT", "ITERATION"])
		.optional()
		.describe("New field data type"),
	singleSelectOptions: z
		.array(
			z.object({
				optionId: z.string().optional().describe("Option ID to update"),
				name: z.string().optional().describe("New option name"),
				description: z.string().optional().describe("New option description"),
				color: z.string().optional().describe("New option color"),
			}),
		)
		.optional()
		.describe("Updated options for single select field"),
};
export const DeleteProjectV2FieldSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	fieldId: z.string().describe("ID of the field to delete"),
};

export const UpdateProjectV2StatusUpdateSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	updateId: z.string().optional().describe("ID of the status update to modify"),
	text: z.string().describe("Status update text"),
};

export const ArchiveProjectV2ItemSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item to archive"),
};

export const UnarchiveProjectV2ItemSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item to unarchive"),
};

export const ClearProjectV2ItemFieldValueSchema = {
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item"),
	fieldId: z.string().describe("ID of the field to clear"),
};

export const MarkProjectV2AsTemplateSchema = {
	projectId: z.string().describe("GitHub Project ID to mark as template"),
};

export const UnmarkProjectV2AsTemplateSchema = {
	projectId: z.string().describe("GitHub Project ID to unmark as template"),
};

const GetProjectZodObject = z.object(GetProjectSchema);
const ListProjectsZodObject = z.object(ListProjectsSchema);
const GetProjectColumnsZodObject = z.object(GetProjectColumnsSchema);
const GetProjectFieldsZodObject = z.object(GetProjectFieldsSchema);
const GetProjectItemsZodObject = z.object(GetProjectItemsSchema);
const CreateProjectItemZodObject = z.object(CreateProjectItemSchema);
const UpdateProjectItemFieldValueZodObject = z.object(
	UpdateProjectItemFieldValueSchema,
);
const CreateProjectV2ZodObject = z.object(CreateProjectV2Schema);
const UpdateProjectV2ZodObject = z.object(UpdateProjectV2Schema);
const DeleteProjectV2ZodObject = z.object(DeleteProjectV2Schema);
const CopyProjectV2ZodObject = z.object(CopyProjectV2Schema);
const AddProjectV2DraftIssueZodObject = z.object(AddProjectV2DraftIssueSchema);
const ConvertProjectV2DraftIssueToIssueZodObject = z.object(
	ConvertProjectV2DraftIssueToIssueSchema,
);
const AddProjectV2ItemByIdZodObject = z.object(AddProjectV2ItemByIdSchema);
const UpdateProjectV2ItemPositionZodObject = z.object(
	UpdateProjectV2ItemPositionSchema,
);
const DeleteProjectV2ItemZodObject = z.object(DeleteProjectV2ItemSchema);
const CreateProjectV2FieldZodObject = z.object(CreateProjectV2FieldSchema);
const UpdateProjectV2FieldZodObject = z.object(UpdateProjectV2FieldSchema);
const DeleteProjectV2FieldZodObject = z.object(DeleteProjectV2FieldSchema);
const UpdateProjectV2StatusUpdateZodObject = z.object(
	UpdateProjectV2StatusUpdateSchema,
);
const ArchiveProjectV2ItemZodObject = z.object(ArchiveProjectV2ItemSchema);
const UnarchiveProjectV2ItemZodObject = z.object(UnarchiveProjectV2ItemSchema);
const ClearProjectV2ItemFieldValueZodObject = z.object(
	ClearProjectV2ItemFieldValueSchema,
);
const MarkProjectV2AsTemplateZodObject = z.object(
	MarkProjectV2AsTemplateSchema,
);
const UnmarkProjectV2AsTemplateZodObject = z.object(
	UnmarkProjectV2AsTemplateSchema,
);

type GetProjectParams = z.infer<typeof GetProjectZodObject>;
type ListProjectsParams = z.infer<typeof ListProjectsZodObject>;
type GetProjectColumnsParams = z.infer<typeof GetProjectColumnsZodObject>;
type GetProjectFieldsParams = z.infer<typeof GetProjectFieldsZodObject>;
type GetProjectItemsParams = z.infer<typeof GetProjectItemsZodObject>;
type CreateProjectItemParams = z.infer<typeof CreateProjectItemZodObject>;
type UpdateProjectItemFieldValueParams = z.infer<
	typeof UpdateProjectItemFieldValueZodObject
>;
type CreateProjectV2Params = z.infer<typeof CreateProjectV2ZodObject>;
type UpdateProjectV2Params = z.infer<typeof UpdateProjectV2ZodObject>;
type DeleteProjectV2Params = z.infer<typeof DeleteProjectV2ZodObject>;
type CopyProjectV2Params = z.infer<typeof CopyProjectV2ZodObject>;
type AddProjectV2DraftIssueParams = z.infer<
	typeof AddProjectV2DraftIssueZodObject
>;
type ConvertProjectV2DraftIssueToIssueParams = z.infer<
	typeof ConvertProjectV2DraftIssueToIssueZodObject
>;
type AddProjectV2ItemByIdParams = z.infer<typeof AddProjectV2ItemByIdZodObject>;
type UpdateProjectV2ItemPositionParams = z.infer<
	typeof UpdateProjectV2ItemPositionZodObject
>;
type DeleteProjectV2ItemParams = z.infer<typeof DeleteProjectV2ItemZodObject>;
type CreateProjectV2FieldParams = z.infer<typeof CreateProjectV2FieldZodObject>;
type UpdateProjectV2FieldParams = z.infer<typeof UpdateProjectV2FieldZodObject>;
type DeleteProjectV2FieldParams = z.infer<typeof DeleteProjectV2FieldZodObject>;
type UpdateProjectV2StatusUpdateParams = z.infer<
	typeof UpdateProjectV2StatusUpdateZodObject
>;
type ArchiveProjectV2ItemParams = z.infer<typeof ArchiveProjectV2ItemZodObject>;
type UnarchiveProjectV2ItemParams = z.infer<
	typeof UnarchiveProjectV2ItemZodObject
>;
type ClearProjectV2ItemFieldValueParams = z.infer<
	typeof ClearProjectV2ItemFieldValueZodObject
>;
type MarkProjectV2AsTemplateParams = z.infer<
	typeof MarkProjectV2AsTemplateZodObject
>;
type UnmarkProjectV2AsTemplateParams = z.infer<
	typeof UnmarkProjectV2AsTemplateZodObject
>;

// Project operations class
export class ProjectOperations {
	private client: GitHubClient;

	constructor() {
		this.client = new GitHubClient();
	}

	/**
	 * Get a GitHub Project by ID
	 */
	async getProject(params: GetProjectParams) {
		const query = `
      query GetProject($id: ID!) {
        node(id: $id) {
          ... on ProjectV2 {
            id
            title
            shortDescription
            url
            creator {
              login
            }
            public
            closed
            createdAt
            updatedAt
            number
          }
        }
      }
    `;

		return this.client.graphql<{
			node: {
				id: string;
				title: string;
				shortDescription: string;
				url: string;
				creator: { login: string };
				public: boolean;
				closed: boolean;
				createdAt: string;
				updatedAt: string;
				number: number;
			} | null;
		}>(query, { id: params.projectId });
	}

	/**
	 * List GitHub Projects for a user
	 */
	async listProjects(params: ListProjectsParams) {
		const query = `
      query ListProjects($login: String!, $first: Int, $after: String) {
        user(login: $login) {
          projectsV2(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              title
              shortDescription
              url
              number
              createdAt
              updatedAt
              closed
            }
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			user?: {
				projectsV2: {
					pageInfo: {
						hasNextPage: boolean;
						endCursor: string;
					};
					nodes: Array<{
						id: string;
						title: string;
						shortDescription: string;
						url: string;
						number: number;
						createdAt: string;
						updatedAt: string;
						closed: boolean;
					}>;
				};
			};
		}>(query, {
			login: params.owner,
			first: params.first || 20,
			after: params.after,
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
	async getProjectColumns(params: GetProjectColumnsParams) {
		const query = `
      query GetProjectColumns($id: ID!) {
        node(id: $id) {
          ... on ProjectV2 {
            fields(first: 20) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			node?: {
				fields: {
					nodes: Array<{
						id: string;
						name: string;
						options?: Array<{
							id: string;
							name: string;
							color: string;
						}>;
					}>;
				};
			};
		}>(query, { id: params.projectId });

		if (!result.node) {
			return { columns: [] };
		}

		// Extract only the single select fields (as these are usually columns/statuses)
		const statusColumns = result.node.fields.nodes
			.filter((field) => field.options)
			.map((field) => ({
				id: field.id,
				name: field.name,
				options: field.options,
			}));

		return { columns: statusColumns };
	}

	/**
	 * Get all fields for a GitHub Project
	 */
	async getProjectFields(params: GetProjectFieldsParams) {
		const query = `
      query GetProjectFields($id: ID!) {
        node(id: $id) {
          ... on ProjectV2 {
            fields(first: 50) {
              nodes {
                __typename
                ... on ProjectV2Field {
                  id
                  name
                }
                ... on ProjectV2IterationField {
                  id
                  name
                  configuration {
                    iterations {
                      startDate
                      duration
                    }
                  }
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                    color
                  }
                }
                ... on ProjectV2NumberField {
                  id
                  name
                }
                ... on ProjectV2DateField {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			node?: {
				fields: {
					nodes: Array<{
						__typename: string;
						id: string;
						name: string;
						options?: Array<{
							id: string;
							name: string;
							color: string;
						}>;
						configuration?: {
							iterations: Array<{
								startDate: string;
								duration: number;
							}>;
						};
					}>;
				};
			};
		}>(query, { id: params.projectId });

		if (!result.node) {
			return { fields: [] };
		}

		return { fields: result.node.fields.nodes };
	}

	/**
	 * Get items from a GitHub Project
	 */
	async getProjectItems(params: GetProjectItemsParams) {
		const query = `
      query GetProjectItems($id: ID!, $first: Int, $after: String) {
        node(id: $id) {
          ... on ProjectV2 {
            items(first: $first, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                id
                type
                fieldValues(first: 20) {
                  nodes {
                    __typename
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field { ... on ProjectV2FieldCommon { name id } }
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field { ... on ProjectV2FieldCommon { name id } }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field { ... on ProjectV2FieldCommon { name id } }
                    }
                    ... on ProjectV2ItemFieldNumberValue {
                      number
                      field { ... on ProjectV2FieldCommon { name id } }
                    }
                    ... on ProjectV2ItemFieldIterationValue {
                      title
                      startDate
                      duration
                      field { ... on ProjectV2FieldCommon { name id } }
                    }
                  }
                }
                content {
                  __typename
                  ... on Issue {
                    id
                    title
                    number
                    state
                    url
                    repository {
                      name
                      owner {
                        login
                      }
                    }
                  }
                  ... on PullRequest {
                    id
                    title
                    number
                    state
                    url
                    repository {
                      name
                      owner {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			node?: {
				items: {
					pageInfo: {
						hasNextPage: boolean;
						endCursor: string;
					};
					nodes: Array<{
						id: string;
						type: string;
						fieldValues: {
							nodes: Array<{
								__typename: string;
								text?: string;
								date?: string;
								name?: string;
								number?: number;
								title?: string;
								startDate?: string;
								duration?: number;
								field: {
									name: string;
									id: string;
								};
							}>;
						};
						content: {
							__typename: string;
							id: string;
							title: string;
							number: number;
							state: string;
							url: string;
							repository: {
								name: string;
								owner: {
									login: string;
								};
							};
						};
					}>;
				};
			};
		}>(query, {
			id: params.projectId,
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
	 * Create a new item in a GitHub Project
	 */
	async createProjectItem(params: CreateProjectItemParams) {
		const query = `
      mutation AddProjectItem($input: AddProjectV2ItemByIdInput!) {
        addProjectV2ItemById(input: $input) {
          item {
            id
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			addProjectV2ItemById: {
				item: {
					id: string;
				};
			};
		}>(query, {
			input: {
				projectId: params.projectId,
				contentId: params.contentId,
			},
		});

		if (params.fieldValues && params.fieldValues.length > 0) {
			// After creating the item, update any provided field values
			const itemId = result.addProjectV2ItemById.item.id;

			for (const fieldValue of params.fieldValues) {
				await this.updateProjectItemFieldValue({
					projectId: params.projectId,
					itemId,
					fieldId: fieldValue.fieldId,
					value: fieldValue.value,
				});
			}
		}

		return {
			itemId: result.addProjectV2ItemById.item.id,
		};
	}

	/**
	 * Update a field value for a project item
	 */
	async updateProjectItemFieldValue(params: UpdateProjectItemFieldValueParams) {
		const query = `
      mutation UpdateProjectItemField($input: UpdateProjectV2ItemFieldValueInput!) {
        updateProjectV2ItemFieldValue(input: $input) {
          projectV2Item {
            id
          }
        }
      }
    `;

		// The value format depends on the field type
		const result = await this.client.graphql<{
			updateProjectV2ItemFieldValue: {
				projectV2Item: {
					id: string;
				};
			};
		}>(query, {
			input: {
				projectId: params.projectId,
				itemId: params.itemId,
				fieldId: params.fieldId,
				value: params.value,
			},
		});

		return {
			success: true,
			itemId: result.updateProjectV2ItemFieldValue.projectV2Item.id,
		};
	}

	/**
	 * Create a new GitHub Project V2
	 */
	async createProjectV2(params: CreateProjectV2Params) {
		const mutation = `
      mutation CreateProjectV2($ownerId: ID!, $title: String!, $description: String, $repositoryId: ID) {
        createProjectV2(input: {
          ownerId: $ownerId,
          title: $title,
          description: $description,
          repositoryId: $repositoryId
        }) {
          projectV2 {
            id
            title
            url
            number
            createdAt
          }
        }
      }
    `;

		return await this.client.graphql<{
			createProjectV2: {
				projectV2: {
					id: string;
					title: string;
					url: string;
					number: number;
					createdAt: string;
				};
			};
		}>(mutation, {
			ownerId: params.ownerId,
			title: params.title,
			description: params.description,
			repositoryId: params.repositoryId,
		});
	}

	/**
	 * Update an existing GitHub Project V2
	 */
	async updateProjectV2(params: UpdateProjectV2Params) {
		const mutation = `
      mutation UpdateProjectV2($projectId: ID!, $title: String, $description: String, $shortDescription: String, $public: Boolean, $closed: Boolean) {
        updateProjectV2(input: {
          projectId: $projectId,
          title: $title,
          description: $description,
          shortDescription: $shortDescription,
          public: $public,
          closed: $closed
        }) {
          projectV2 {
            id
            title
            description
            shortDescription
            public
            closed
            updatedAt
          }
        }
      }
    `;

		return await this.client.graphql<{
			updateProjectV2: {
				projectV2: {
					id: string;
					title: string;
					description: string;
					shortDescription: string;
					public: boolean;
					closed: boolean;
					updatedAt: string;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			title: params.title,
			description: params.description,
			shortDescription: params.shortDescription,
			public: params.public,
			closed: params.closed,
		});
	}

	/**
	 * Delete a GitHub Project V2
	 */
	async deleteProjectV2(params: DeleteProjectV2Params) {
		const mutation = `
      mutation DeleteProjectV2($projectId: ID!) {
        deleteProjectV2(input: {
          projectId: $projectId
        }) {
          clientMutationId
        }
      }
    `;

		return await this.client.graphql<{
			deleteProjectV2: {
				clientMutationId: string | null;
			};
		}>(mutation, {
			projectId: params.projectId,
		});
	}

	/**
	 * Copy a GitHub Project V2
	 */
	async copyProjectV2(params: CopyProjectV2Params) {
		const mutation = `
      mutation CopyProjectV2($projectId: ID!, $ownerId: ID!, $title: String, $includeFields: Boolean, $includeItems: Boolean) {
        copyProjectV2(input: {
          projectId: $projectId,
          ownerId: $ownerId,
          title: $title,
          includeFields: $includeFields,
          includeItems: $includeItems
        }) {
          projectV2 {
            id
            title
            url
            number
          }
        }
      }
    `;

		return await this.client.graphql<{
			copyProjectV2: {
				projectV2: {
					id: string;
					title: string;
					url: string;
					number: number;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			ownerId: params.ownerId,
			title: params.title,
			includeFields: params.includeFields,
			includeItems: params.includeItems,
		});
	}

	/**
	 * Add draft issue to a GitHub Project V2
	 */
	async addProjectV2DraftIssue(params: AddProjectV2DraftIssueParams) {
		const mutation = `
      mutation AddProjectV2DraftIssue($projectId: ID!, $title: String!, $body: String, $assigneeIds: [ID!]) {
        addProjectV2DraftIssue(input: {
          projectId: $projectId,
          title: $title,
          body: $body,
          assigneeIds: $assigneeIds
        }) {
          projectItem {
            id
            type
            draftIssue {
              title
              body
            }
          }
        }
      }
    `;

		return await this.client.graphql<{
			addProjectV2DraftIssue: {
				projectItem: {
					id: string;
					type: string;
					draftIssue: {
						title: string;
						body: string;
					};
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			title: params.title,
			body: params.body,
			assigneeIds: params.assigneeIds,
		});
	}

	/**
	 * Convert draft issue to a regular issue
	 */
	async convertProjectV2DraftIssueToIssue(
		params: ConvertProjectV2DraftIssueToIssueParams,
	) {
		const mutation = `
      mutation ConvertProjectV2DraftIssueToIssue($projectId: ID!, $draftIssueId: ID!, $repositoryId: ID!, $title: String, $body: String) {
        convertProjectV2DraftIssueToIssue(input: {
          projectId: $projectId,
          draftIssueId: $draftIssueId,
          repositoryId: $repositoryId,
          title: $title,
          body: $body
        }) {
          projectItem {
            id
            content {
              __typename
              ... on Issue {
                id
                title
                number
                url
              }
            }
          }
        }
      }
    `;

		return await this.client.graphql<{
			convertProjectV2DraftIssueToIssue: {
				projectItem: {
					id: string;
					content: {
						__typename: string;
						id: string;
						title: string;
						number: number;
						url: string;
					};
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			draftIssueId: params.draftIssueId,
			repositoryId: params.repositoryId,
			title: params.title,
			body: params.body,
		});
	}

	/**
	 * Add an existing issue or PR to a project
	 */
	async addProjectV2ItemById(params: AddProjectV2ItemByIdParams) {
		const mutation = `
      mutation AddProjectV2ItemById($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: {
          projectId: $projectId,
          contentId: $contentId
        }) {
          item {
            id
            content {
              __typename
              ... on Issue {
                id
                title
                number
              }
              ... on PullRequest {
                id
                title
                number
              }
            }
          }
        }
      }
    `;

		return await this.client.graphql<{
			addProjectV2ItemById: {
				item: {
					id: string;
					content: {
						__typename: string;
						id: string;
						title: string;
						number: number;
					};
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			contentId: params.contentId,
		});
	}

	/**
	 * Update position of a project item
	 */
	async updateProjectV2ItemPosition(params: UpdateProjectV2ItemPositionParams) {
		const mutation = `
      mutation UpdateProjectV2ItemPosition($projectId: ID!, $itemId: ID!, $afterId: ID) {
        updateProjectV2ItemPosition(input: {
          projectId: $projectId,
          itemId: $itemId,
          afterId: $afterId
        }) {
          clientMutationId
        }
      }
    `;

		return await this.client.graphql<{
			updateProjectV2ItemPosition: {
				clientMutationId: string | null;
			};
		}>(mutation, {
			projectId: params.projectId,
			itemId: params.itemId,
			afterId: params.afterId,
		});
	}

	/**
	 * Delete a project item
	 */
	async deleteProjectV2Item(params: DeleteProjectV2ItemParams) {
		const mutation = `
      mutation DeleteProjectV2Item($projectId: ID!, $itemId: ID!) {
        deleteProjectV2Item(input: {
          projectId: $projectId,
          itemId: $itemId
        }) {
          deletedItemId
        }
      }
    `;

		return await this.client.graphql<{
			deleteProjectV2Item: {
				deletedItemId: string;
			};
		}>(mutation, {
			projectId: params.projectId,
			itemId: params.itemId,
		});
	}

	/**
	 * Create a new field in a project
	 */
	async createProjectV2Field(params: CreateProjectV2FieldParams) {
		const mutation = `
      mutation CreateProjectV2Field($projectId: ID!, $dataType: ProjectV2FieldType!, $name: String!, $singleSelectOptions: [ProjectV2SingleSelectFieldOptionInput!]) {
        createProjectV2Field(input: {
          projectId: $projectId,
          dataType: $dataType,
          name: $name,
          singleSelectOptions: $singleSelectOptions
        }) {
          projectV2Field {
            id
            name
            dataType
          }
        }
      }
    `;

		const singleSelectOptions = params.singleSelectOptions?.map((option) => ({
			name: option.name,
			description: option.description,
			color: option.color,
		}));

		return await this.client.graphql<{
			createProjectV2Field: {
				projectV2Field: {
					id: string;
					name: string;
					dataType: string;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			dataType: params.dataType,
			name: params.name,
			singleSelectOptions,
		});
	}

	/**
	 * Update a project field
	 */
	async updateProjectV2Field(params: UpdateProjectV2FieldParams) {
		const mutation = `
      mutation UpdateProjectV2Field($projectId: ID!, $fieldId: ID!, $name: String, $dataType: ProjectV2FieldType, $singleSelectOptions: [ProjectV2SingleSelectFieldOptionInput!]) {
        updateProjectV2Field(input: {
          projectId: $projectId,
          fieldId: $fieldId,
          name: $name,
          dataType: $dataType,
          singleSelectOptions: $singleSelectOptions
        }) {
          projectV2Field {
            id
            name
            dataType
          }
        }
      }
    `;

		const singleSelectOptions = params.singleSelectOptions?.map((option) => ({
			optionId: option.optionId,
			name: option.name,
			description: option.description,
			color: option.color,
		}));

		return await this.client.graphql<{
			updateProjectV2Field: {
				projectV2Field: {
					id: string;
					name: string;
					dataType: string;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			fieldId: params.fieldId,
			name: params.name,
			dataType: params.dataType,
			singleSelectOptions,
		});
	}

	/**
	 * Delete a project field
	 */
	async deleteProjectV2Field(params: DeleteProjectV2FieldParams) {
		const mutation = `
      mutation DeleteProjectV2Field($projectId: ID!, $fieldId: ID!) {
        deleteProjectV2Field(input: {
          projectId: $projectId,
          fieldId: $fieldId
        }) {
          clientMutationId
        }
      }
    `;

		return await this.client.graphql<{
			deleteProjectV2Field: {
				clientMutationId: string | null;
			};
		}>(mutation, {
			projectId: params.projectId,
			fieldId: params.fieldId,
		});
	}

	/**
	 * Update project status update
	 */
	async updateProjectV2StatusUpdate(params: UpdateProjectV2StatusUpdateParams) {
		const mutation = `
      mutation UpdateProjectV2StatusUpdate($projectId: ID!, $updateId: ID, $text: String!) {
        updateProjectV2StatusUpdate(input: {
          projectId: $projectId,
          statusUpdateId: $updateId,
          text: $text
        }) {
          statusUpdate {
            id
            text
            createdAt
            updatedAt
          }
        }
      }
    `;

		return await this.client.graphql<{
			updateProjectV2StatusUpdate: {
				statusUpdate: {
					id: string;
					text: string;
					createdAt: string;
					updatedAt: string;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			updateId: params.updateId,
			text: params.text,
		});
	}

	/**
	 * Archive a project item
	 */
	async archiveProjectV2Item(params: ArchiveProjectV2ItemParams) {
		const mutation = `
      mutation ArchiveProjectV2Item($projectId: ID!, $itemId: ID!) {
        archiveProjectV2Item(input: {
          projectId: $projectId,
          itemId: $itemId
        }) {
          clientMutationId
        }
      }
    `;

		return await this.client.graphql<{
			archiveProjectV2Item: {
				clientMutationId: string | null;
			};
		}>(mutation, {
			projectId: params.projectId,
			itemId: params.itemId,
		});
	}

	/**
	 * Unarchive a project item
	 */
	async unarchiveProjectV2Item(params: UnarchiveProjectV2ItemParams) {
		const mutation = `
      mutation UnarchiveProjectV2Item($projectId: ID!, $itemId: ID!) {
        unarchiveProjectV2Item(input: {
          projectId: $projectId,
          itemId: $itemId
        }) {
          clientMutationId
        }
      }
    `;

		return await this.client.graphql<{
			unarchiveProjectV2Item: {
				clientMutationId: string | null;
			};
		}>(mutation, {
			projectId: params.projectId,
			itemId: params.itemId,
		});
	}

	/**
	 * Clear a field value for a project item
	 */
	async clearProjectV2ItemFieldValue(
		params: ClearProjectV2ItemFieldValueParams,
	) {
		const mutation = `
      mutation ClearProjectV2ItemFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!) {
        clearProjectV2ItemFieldValue(input: {
          projectId: $projectId,
          itemId: $itemId,
          fieldId: $fieldId
        }) {
          projectV2Item {
            id
          }
        }
      }
    `;

		return await this.client.graphql<{
			clearProjectV2ItemFieldValue: {
				projectV2Item: {
					id: string;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
			itemId: params.itemId,
			fieldId: params.fieldId,
		});
	}

	/**
	 * Mark a project as a template
	 */
	async markProjectV2AsTemplate(params: MarkProjectV2AsTemplateParams) {
		const mutation = `
      mutation MarkProjectV2AsTemplate($projectId: ID!) {
        markProjectV2AsTemplate(input: {
          projectId: $projectId
        }) {
          projectV2 {
            id
            isTemplate
          }
        }
      }
    `;

		return await this.client.graphql<{
			markProjectV2AsTemplate: {
				projectV2: {
					id: string;
					isTemplate: boolean;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
		});
	}

	/**
	 * Unmark a project as a template
	 */
	async unmarkProjectV2AsTemplate(params: UnmarkProjectV2AsTemplateParams) {
		const mutation = `
      mutation UnmarkProjectV2AsTemplate($projectId: ID!) {
        unmarkProjectV2AsTemplate(input: {
          projectId: $projectId
        }) {
          projectV2 {
            id
            isTemplate
          }
        }
      }
    `;

		return await this.client.graphql<{
			unmarkProjectV2AsTemplate: {
				projectV2: {
					id: string;
					isTemplate: boolean;
				};
			};
		}>(mutation, {
			projectId: params.projectId,
		});
	}
}
