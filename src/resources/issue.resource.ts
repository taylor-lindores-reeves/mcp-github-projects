import { GitHubService } from "../services/github.service";
import type { Issue, IssuePriority, IssueStatus, MCPResource } from "../types";

/**
 * Format an Issue as an MCP Resource
 */
export function formatIssueResource(issue: Issue): MCPResource {
	return {
		id: issue.id,
		type: "issue",
		attributes: {
			title: issue.title,
			description: issue.description,
			status: issue.status,
			assignees: issue.assignees,
			labels: issue.labels,
			createdAt: issue.createdAt,
			updatedAt: issue.updatedAt,
			priority: issue.priority,
			points: issue.points,
		},
	};
}

/**
 * MCP Issue Resource
 * Provides methods for creating, listing, and manipulating issues (tickets)
 */
export class IssueResource {
	private githubService: GitHubService;

	constructor(userToken?: string) {
		this.githubService = new GitHubService({ token: userToken });
	}

	/**
	 * List issues for a repository
	 */
	async listIssues(owner: string, repo: string): Promise<MCPResource[]> {
		try {
			const issues = await this.githubService.getIssues(owner, repo);
			return issues.map(formatIssueResource);
		} catch (error) {
			console.error("Error listing issues:", error);
			throw error;
		}
	}

	/**
	 * Create a new issue
	 */
	async createIssue(
		owner: string,
		repo: string,
		title: string,
		description: string,
		labels?: string[],
		priority: IssuePriority = IssuePriority.MEDIUM,
		points?: number,
	): Promise<MCPResource> {
		try {
			const issue = await this.githubService.createIssue(
				owner,
				repo,
				title,
				description,
				labels,
			);

			// GitHub API doesn't directly support priority and points, but we add them
			// to our internal representation
			issue.priority = priority;
			if (points !== undefined) {
				issue.points = points;
			}

			return formatIssueResource(issue);
		} catch (error) {
			console.error("Error creating issue:", error);
			throw error;
		}
	}

	/**
	 * Update an issue's status
	 */
	async updateIssueStatus(
		owner: string,
		repo: string,
		issueNumber: number,
		status: IssueStatus,
	): Promise<void> {
		try {
			await this.githubService.updateIssueStatus(
				owner,
				repo,
				issueNumber,
				status,
			);
		} catch (error) {
			console.error("Error updating issue status:", error);
			throw error;
		}
	}

	/**
	 * Get MCP actions available for issues
	 */
	getActions(): Record<string, unknown> {
		return {
			"list-issues": {
				description: "List all issues for a repository",
				parameters: {
					owner: {
						type: "string",
						description: "GitHub username or organization name",
						required: true,
					},
					repo: {
						type: "string",
						description: "Repository name",
						required: true,
					},
				},
			},
			"create-issue": {
				description: "Create a new issue",
				parameters: {
					owner: {
						type: "string",
						description: "GitHub username or organization name",
						required: true,
					},
					repo: {
						type: "string",
						description: "Repository name",
						required: true,
					},
					title: {
						type: "string",
						description: "Title of the issue",
						required: true,
					},
					description: {
						type: "string",
						description: "Description of the issue",
						required: false,
					},
					labels: {
						type: "array",
						items: {
							type: "string",
						},
						description: "Labels for the issue",
						required: false,
					},
					priority: {
						type: "string",
						description: "Priority of the issue (low, medium, high, urgent)",
						required: false,
					},
					points: {
						type: "number",
						description: "Story points for the issue",
						required: false,
					},
				},
			},
			"update-issue-status": {
				description: "Update the status of an issue",
				parameters: {
					owner: {
						type: "string",
						description: "GitHub username or organization name",
						required: true,
					},
					repo: {
						type: "string",
						description: "Repository name",
						required: true,
					},
					issueNumber: {
						type: "number",
						description: "Issue number",
						required: true,
					},
					status: {
						type: "string",
						description:
							"New status (backlog, todo, in_progress, in_review, done)",
						required: true,
					},
				},
			},
		};
	}
}
