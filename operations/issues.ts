import { z } from "zod";
import { GitHubClient } from "./github-client.js";

// Schema definitions for tool input validation
export const GetIssueSchema = z.object({
	owner: z.string().describe("Repository owner (username or organization)"),
	repo: z.string().describe("Repository name"),
	issueNumber: z.number().describe("Issue number"),
});

export const ListIssuesSchema = z.object({
	owner: z.string().describe("Repository owner (username or organization)"),
	repo: z.string().describe("Repository name"),
	state: z
		.enum(["open", "closed", "all"])
		.optional()
		.describe("Issue state (open, closed, all)")
		.default("open"),
	labels: z.array(z.string()).optional().describe("Filter by labels"),
	assignee: z.string().optional().describe("Filter by assignee username"),
	milestone: z
		.string()
		.optional()
		.describe("Filter by milestone number or '*'"),
	sort: z
		.enum(["created", "updated", "comments"])
		.optional()
		.describe("Sort field")
		.default("created"),
	direction: z
		.enum(["asc", "desc"])
		.optional()
		.describe("Sort direction")
		.default("desc"),
	per_page: z
		.number()
		.optional()
		.describe("Items per page (max 100)")
		.default(30),
	page: z.number().optional().describe("Page number").default(1),
});

export const CreateIssueSchema = z.object({
	owner: z.string().describe("Repository owner (username or organization)"),
	repo: z.string().describe("Repository name"),
	title: z.string().describe("Issue title"),
	body: z.string().optional().describe("Issue body/description"),
	assignees: z.array(z.string()).optional().describe("Usernames to assign"),
	milestone: z.number().optional().describe("Milestone ID"),
	labels: z.array(z.string()).optional().describe("Labels to apply"),
});

export const UpdateIssueSchema = z.object({
	owner: z.string().describe("Repository owner (username or organization)"),
	repo: z.string().describe("Repository name"),
	issueNumber: z.number().describe("Issue number"),
	title: z.string().optional().describe("New title"),
	body: z.string().optional().describe("New body"),
	state: z
		.enum(["open", "closed"])
		.optional()
		.describe("State (open or closed)"),
	assignees: z
		.array(z.string())
		.optional()
		.describe("Usernames to assign (replaces existing)"),
	labels: z
		.array(z.string())
		.optional()
		.describe("Labels to apply (replaces existing)"),
	milestone: z
		.number()
		.nullable()
		.optional()
		.describe("Milestone ID (null to clear)"),
});

export class IssueOperations {
	private client: GitHubClient;

	constructor() {
		this.client = new GitHubClient();
	}

	/**
	 * Get an issue by owner, repo, and issue number
	 */
	async getIssue(params: z.infer<typeof GetIssueSchema>) {
		const { owner, repo, issueNumber } = params;
		const query = `
      query GetIssue($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          issue(number: $number) {
            id
            number
            title
            body
            state
            createdAt
            updatedAt
            closedAt
            url
            author {
              login
              url
            }
            assignees(first: 10) {
              nodes {
                login
                url
              }
            }
            labels(first: 10) {
              nodes {
                name
                color
              }
            }
            milestone {
              title
              dueOn
              state
            }
            comments(first: 0) {
              totalCount
            }
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			repository: {
				issue: {
					id: string;
					number: number;
					title: string;
					body: string;
					state: string;
					createdAt: string;
					updatedAt: string;
					closedAt: string | null;
					url: string;
					author: {
						login: string;
						url: string;
					};
					assignees: {
						nodes: Array<{
							login: string;
							url: string;
						}>;
					};
					labels: {
						nodes: Array<{
							name: string;
							color: string;
						}>;
					};
					milestone: {
						title: string;
						dueOn: string | null;
						state: string;
					} | null;
					comments: {
						totalCount: number;
					};
				};
			};
		}>(query, {
			owner,
			name: repo,
			number: issueNumber,
		});

		return result.repository.issue;
	}

	/**
	 * List issues for a repository
	 */
	async listIssues(params: z.infer<typeof ListIssuesSchema>) {
		const {
			owner,
			repo,
			state,
			labels,
			assignee,
			milestone,
			sort,
			direction,
			per_page,
			page,
		} = params;

		// Use REST API for this operation as it has better filtering options
		const path = `/repos/${owner}/${repo}/issues`;
		const queryParams: Record<string, string> = {
			state,
			sort,
			direction,
			per_page: per_page.toString(),
			page: page.toString(),
		};

		if (labels && labels.length > 0) {
			queryParams.labels = labels.join(",");
		}

		if (assignee) {
			queryParams.assignee = assignee;
		}

		if (milestone) {
			queryParams.milestone = milestone;
		}

		// Build the query string
		const queryString = Object.entries(queryParams)
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join("&");

		const result = await this.client.rest<
			Array<{
				id: number;
				node_id: string;
				number: number;
				title: string;
				state: string;
				created_at: string;
				updated_at: string;
				closed_at: string | null;
				html_url: string;
				body: string;
				user: {
					login: string;
					html_url: string;
				};
				assignees: Array<{
					login: string;
					html_url: string;
				}>;
				labels: Array<{
					name: string;
					color: string;
				}>;
				milestone: {
					title: string;
					due_on: string | null;
					state: string;
				} | null;
				comments: number;
			}>
		>("GET", `${path}?${queryString}`);

		return result;
	}

	/**
	 * Create a new issue
	 */
	async createIssue(params: z.infer<typeof CreateIssueSchema>) {
		const { owner, repo, title, body, assignees, milestone, labels } = params;
		const path = `/repos/${owner}/${repo}/issues`;

		const payload: Record<string, unknown> = {
			title,
		};

		if (body !== undefined) {
			payload.body = body;
		}

		if (assignees && assignees.length > 0) {
			payload.assignees = assignees;
		}

		if (milestone !== undefined) {
			payload.milestone = milestone;
		}

		if (labels && labels.length > 0) {
			payload.labels = labels;
		}

		const result = await this.client.rest<{
			id: number;
			node_id: string;
			number: number;
			title: string;
			state: string;
			html_url: string;
		}>("POST", path, payload);

		return result;
	}

	/**
	 * Update an existing issue
	 */
	async updateIssue(params: z.infer<typeof UpdateIssueSchema>) {
		const {
			owner,
			repo,
			issueNumber,
			title,
			body,
			state,
			assignees,
			labels,
			milestone,
		} = params;
		const path = `/repos/${owner}/${repo}/issues/${issueNumber}`;

		const payload: Record<string, unknown> = {};

		if (title !== undefined) {
			payload.title = title;
		}

		if (body !== undefined) {
			payload.body = body;
		}

		if (state !== undefined) {
			payload.state = state;
		}

		if (assignees !== undefined) {
			payload.assignees = assignees;
		}

		if (labels !== undefined) {
			payload.labels = labels;
		}

		if (milestone !== undefined) {
			payload.milestone = milestone;
		}

		const result = await this.client.rest<{
			id: number;
			node_id: string;
			number: number;
			title: string;
			state: string;
			html_url: string;
		}>("PATCH", path, payload);

		return result;
	}
}
