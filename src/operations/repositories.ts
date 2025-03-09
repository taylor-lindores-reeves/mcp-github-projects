import { z } from "zod";
// Import GraphQL operations
import { getRepository } from "../graphql/repositories/index.js";
import type {
	GetRepositoryQuery,
	GetRepositoryQueryVariables,
} from "../types/github-api-types.js";
import { GitHubClient } from "./github-client.js";

// Schema definitions for tool input validation
export const GetRepositorySchema = {
	name: z.string().describe("Repository name"),
};

export const ListRepositoriesSchema = {
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

const ListRepositoriesZodObject = z.object(ListRepositoriesSchema);

type ListRepositoriesParams = z.infer<typeof ListRepositoriesZodObject>;
export class RepositoryOperations {
	private client: GitHubClient;
	private owner: string;

	constructor() {
		this.client = new GitHubClient();
		this.owner = process.env.GITHUB_OWNER as string;
	}

	/**
	 * Get a repository by owner and name
	 */
	async getRepository(input: Omit<GetRepositoryQueryVariables, "owner">) {
		const result = await this.client.graphql<
			GetRepositoryQuery,
			GetRepositoryQueryVariables
		>(getRepository, {
			...input,
			owner: this.owner,
		});

		return result.repository;
	}

	/**
	 * List repositories for a user
	 */
	async listRepositories(params: ListRepositoriesParams) {
		const { type, sort, direction, per_page, page } = params;

		// Use REST API for this operation as it provides better pagination and filtering
		const path = `/users/${this.owner}/repos`;

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
