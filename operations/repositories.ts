import { z } from "zod";
import { GitHubClient } from "./github-client.js";

// Schema definitions for tool input validation
export const GetRepositorySchema = {
	owner: z.string().describe("Repository owner (username)"),
	repo: z.string().describe("Repository name"),
};

export const ListRepositoriesSchema = {
	owner: z.string().describe("Username"),
	type: z
		.enum(["all", "owner", "public", "private", "member"])
		.optional()
		.describe("Type of repositories to list")
		.default("all"),
	sort: z
		.enum(["created", "updated", "pushed", "full_name"])
		.optional()
		.describe("Sort field")
		.default("full_name"),
	direction: z
		.enum(["asc", "desc"])
		.optional()
		.describe("Sort direction")
		.default("asc"),
	per_page: z
		.number()
		.optional()
		.describe("Items per page (max 100)")
		.default(30),
	page: z.number().optional().describe("Page number").default(1),
};

const GetRepositoryZodObject = z.object(GetRepositorySchema);
const ListRepositoriesZodObject = z.object(ListRepositoriesSchema);

type GetRepositoryParams = z.infer<typeof GetRepositoryZodObject>;
type ListRepositoriesParams = z.infer<typeof ListRepositoriesZodObject>;
export class RepositoryOperations {
	private client: GitHubClient;

	constructor() {
		this.client = new GitHubClient();
	}

	/**
	 * Get a repository by owner and name
	 */
	async getRepository(params: GetRepositoryParams) {
		const query = `
      query GetRepository($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
          name
          owner {
            login
            url
            avatarUrl
          }
          nameWithOwner
          description
          url
          homepageUrl
          primaryLanguage {
            name
            color
          }
          isPrivate
          isFork
          isArchived
          isTemplate
          stargazerCount
          forkCount
          watchers {
            totalCount
          }
          openIssues: issues(states: OPEN) {
            totalCount
          }
          defaultBranchRef {
            name
          }
          createdAt
          updatedAt
          pushedAt
          licenseInfo {
            name
            spdxId
          }
        }
      }
    `;

		const result = await this.client.graphql<{
			repository: {
				id: string;
				name: string;
				owner: {
					login: string;
					url: string;
					avatarUrl: string;
				};
				nameWithOwner: string;
				description: string | null;
				url: string;
				homepageUrl: string | null;
				primaryLanguage: {
					name: string;
					color: string;
				} | null;
				isPrivate: boolean;
				isFork: boolean;
				isArchived: boolean;
				isTemplate: boolean;
				stargazerCount: number;
				forkCount: number;
				watchers: {
					totalCount: number;
				};
				openIssues: {
					totalCount: number;
				};
				defaultBranchRef: {
					name: string;
				} | null;
				createdAt: string;
				updatedAt: string;
				pushedAt: string;
				licenseInfo: {
					name: string;
					spdxId: string;
				} | null;
			};
		}>(query, { owner: params.owner, name: params.repo });

		return result.repository;
	}

	/**
	 * List repositories for a user
	 */
	async listRepositories(params: ListRepositoriesParams) {
		const { owner, type, sort, direction, per_page, page } = params;

		// Use REST API for this operation as it provides better pagination and filtering
		const path = `/users/${owner}/repos`;

		const queryParams: Record<string, string | undefined> = {
			type,
			sort,
			direction,
			per_page: per_page?.toString(),
			page: page?.toString(),
		};

		// Build the query string
		const queryString = Object.entries(queryParams)
			.map(([key, value]) => `${key}=${encodeURIComponent(value ?? "")}`)
			.join("&");

		const result = await this.client.rest<
			Array<{
				id: number;
				node_id: string;
				name: string;
				full_name: string;
				owner: {
					login: string;
					avatar_url: string;
					html_url: string;
				};
				html_url: string;
				description: string | null;
				fork: boolean;
				created_at: string;
				updated_at: string;
				pushed_at: string;
				homepage: string | null;
				size: number;
				stargazers_count: number;
				watchers_count: number;
				language: string | null;
				forks_count: number;
				open_issues_count: number;
				license: {
					key: string;
					name: string;
					spdx_id: string;
					url: string;
				} | null;
				private: boolean;
				archived: boolean;
				disabled: boolean;
				default_branch: string;
			}>
		>("GET", `${path}?${queryString}`);

		return result;
	}
}
