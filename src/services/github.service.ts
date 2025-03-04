import { Octokit } from "octokit";
import config from "../config";
import {
	type Issue,
	IssuePriority,
	IssueStatus,
	type Project,
	ProjectStatus,
} from "../types";

interface GitHubServiceOptions {
	token?: string;
}

interface GitHubGraphQLResponse {
	user: {
		projectsV2: {
			nodes: Array<{
				id: string;
				title: string;
				shortDescription?: string;
				createdAt: string;
				updatedAt: string;
				closed: boolean;
			}>;
		};
	};
}

interface GitHubProjectCreateResponse {
	createProjectV2: {
		projectV2: {
			id: string;
			title: string;
			shortDescription?: string;
			createdAt: string;
			updatedAt: string;
			closed: boolean;
		};
	};
}

export class GitHubService {
	private octokit: Octokit;

	constructor(options: GitHubServiceOptions = {}) {
		this.octokit = new Octokit({
			auth: options.token,
			baseUrl: config.GITHUB_API_URL,
		});
	}

	/**
	 * Get projects for a user or organization
	 */
	async getProjects(owner: string): Promise<Project[]> {
		// Note: Using GraphQL API for Projects v2
		const response = await this.octokit.graphql<GitHubGraphQLResponse>(
			`
      query($owner: String!) {
        user(login: $owner) {
          projectsV2(first: 10) {
            nodes {
              id
              title
              shortDescription
              createdAt
              updatedAt
              closed
            }
          }
        }
      }
    `,
			{
				owner,
			},
		);

		// Parse and map the response
		const projectNodes = response.user.projectsV2.nodes;
		return projectNodes.map((node) => ({
			id: node.id,
			title: node.title,
			description: node.shortDescription || "",
			createdAt: node.createdAt,
			updatedAt: node.updatedAt,
			owner,
			status: node.closed ? ProjectStatus.ARCHIVED : ProjectStatus.ACTIVE,
			iterations: [], // Would need an additional API call to get iterations
		}));
	}

	/**
	 * Create a new project
	 */
	async createProject(
		owner: string,
		title: string,
		description: string,
	): Promise<Project> {
		const response = await this.octokit.graphql<GitHubProjectCreateResponse>(
			`
      mutation($owner: String!, $title: String!, $description: String!) {
        createProjectV2(
          input: {
            ownerId: $owner,
            title: $title,
            description: $description
          }
        ) {
          projectV2 {
            id
            title
            shortDescription
            createdAt
            updatedAt
            closed
          }
        }
      }
    `,
			{
				owner,
				title,
				description,
			},
		);

		const projectData = response.createProjectV2.projectV2;
		return {
			id: projectData.id,
			title: projectData.title,
			description: projectData.shortDescription || "",
			createdAt: projectData.createdAt,
			updatedAt: projectData.updatedAt,
			owner,
			status: projectData.closed
				? ProjectStatus.ARCHIVED
				: ProjectStatus.ACTIVE,
			iterations: [],
		};
	}

	/**
	 * Get issues for a repository
	 */
	async getIssues(owner: string, repo: string): Promise<Issue[]> {
		const response = await this.octokit.request(
			"GET /repos/{owner}/{repo}/issues",
			{
				owner,
				repo,
			},
		);

		return response.data.map((issue) => ({
			id: String(issue.id),
			title: issue.title,
			description: issue.body || "",
			status: this.mapGitHubIssueStateToStatus(issue.state),
			assignees: issue.assignees?.map((assignee) => assignee.login) || [],
			labels: issue.labels
				? issue.labels.map((label) =>
						typeof label === "string" ? label : label.name || "",
					)
				: [],
			createdAt: issue.created_at,
			updatedAt: issue.updated_at,
			priority: IssuePriority.MEDIUM,
		}));
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
	): Promise<Issue> {
		const response = await this.octokit.request(
			"POST /repos/{owner}/{repo}/issues",
			{
				owner,
				repo,
				title,
				body: description,
				labels,
			},
		);

		const issue = response.data;
		return {
			id: String(issue.id),
			title: issue.title,
			description: issue.body || "",
			status: this.mapGitHubIssueStateToStatus(issue.state),
			assignees: issue.assignees?.map((assignee) => assignee.login) || [],
			labels: labels || [],
			createdAt: issue.created_at,
			updatedAt: issue.updated_at,
			priority: IssuePriority.MEDIUM,
		};
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
		const state = status === IssueStatus.DONE ? "closed" : "open";

		await this.octokit.request(
			"PATCH /repos/{owner}/{repo}/issues/{issue_number}",
			{
				owner,
				repo,
				issue_number: issueNumber,
				state,
			},
		);
	}

	/**
	 * Helper method to map GitHub issue state to our internal status
	 */
	private mapGitHubIssueStateToStatus(state: string): IssueStatus {
		return state === "closed" ? IssueStatus.DONE : IssueStatus.TO_DO;
	}
}
