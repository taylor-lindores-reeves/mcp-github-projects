import { z } from "zod";
import { GitHubClient } from "./github-client.js";

// Schema definitions for tool input validation
export const GetProjectSchema = z.object({
	projectId: z.string().describe("GitHub Project ID"),
});

export const ListProjectsSchema = z.object({
	owner: z.string().describe("GitHub user or organization name"),
	first: z
		.number()
		.optional()
		.describe("Number of projects to return (max 100)"),
	after: z.string().optional().describe("Cursor for pagination"),
});

export const GetProjectColumnsSchema = z.object({
	projectId: z.string().describe("GitHub Project ID"),
});

export const GetProjectFieldsSchema = z.object({
	projectId: z.string().describe("GitHub Project ID"),
});

export const GetProjectItemsSchema = z.object({
	projectId: z.string().describe("GitHub Project ID"),
	first: z.number().optional().describe("Number of items to return (max 100)"),
	after: z.string().optional().describe("Cursor for pagination"),
	filter: z
		.string()
		.optional()
		.describe("Filter for items (e.g., status field value)"),
});

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

export const CreateProjectItemSchema = z.object({
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
});

export const UpdateProjectItemFieldValueSchema = z.object({
	projectId: z.string().describe("GitHub Project ID"),
	itemId: z.string().describe("ID of the project item"),
	fieldId: z.string().describe("ID of the field to update"),
	value: FieldValueSchema.describe("New value for the field"),
});

// Project operations class
export class ProjectOperations {
	private client: GitHubClient;

	constructor() {
		this.client = new GitHubClient();
	}

	/**
	 * Get a GitHub Project by ID
	 */
	async getProject(params: z.infer<typeof GetProjectSchema>) {
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

		console.error({ params });

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
	 * List GitHub Projects for a user or organization
	 */
	async listProjects(params: z.infer<typeof ListProjectsSchema>) {
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
        organization(login: $login) {
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
			organization?: {
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

		// Determine if the response contains user or organization data
		const projectData =
			result.user?.projectsV2 || result.organization?.projectsV2;

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
	async getProjectColumns(params: z.infer<typeof GetProjectColumnsSchema>) {
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
	async getProjectFields(params: z.infer<typeof GetProjectFieldsSchema>) {
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
	async getProjectItems(params: z.infer<typeof GetProjectItemsSchema>) {
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
	async createProjectItem(params: z.infer<typeof CreateProjectItemSchema>) {
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
	async updateProjectItemFieldValue(
		params: z.infer<typeof UpdateProjectItemFieldValueSchema>,
	) {
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
}
