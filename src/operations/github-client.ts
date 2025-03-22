import { Octokit } from "@octokit/core";
import { paginateGraphQL } from "@octokit/plugin-paginate-graphql";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

// Create custom Octokit with plugins
const CustomOctokit = Octokit.plugin(restEndpointMethods, paginateGraphQL);

/**
 * GitHub client using Octokit for interacting with GitHub APIs
 */
export class GitHubClient {
	private octokit: InstanceType<typeof CustomOctokit>;

	/**
	 * Create a new GitHub client
	 */
	constructor() {
		const token = process.env.GITHUB_TOKEN;

		if (!token) {
			throw new Error("GITHUB_TOKEN environment variable is required");
		}

		// Initialize Octokit instance
		this.octokit = new CustomOctokit({
			auth: token,
		});
	}

	/**
	 * Make a GraphQL request to the GitHub API
	 */
	async graphql<
		TData,
		TVariables extends Record<string, unknown> = Record<string, unknown>,
	>(query: string, variables: TVariables): Promise<TData> {
		try {
			return this.octokit.graphql<TData>(query, variables);
		} catch (error) {
			console.error("GraphQL error:", error);
			throw error;
		}
	}

	/**
	 * Make a paginated GraphQL request with automatic handling of pagination
	 */
	async paginateGraphql<T extends object>(
		query: string,
		variables: Record<string, unknown> = {},
		pageInfo: { pageSize?: number } = {},
	): Promise<T> {
		try {
			return await this.octokit.graphql.paginate<T>(query, {
				...variables,
				pageSize: pageInfo.pageSize || 20,
			});
		} catch (error) {
			console.error("Paginated GraphQL error:", error);
			throw error;
		}
	}

	/**
	 * Make a REST request to the GitHub API
	 */
	async rest<T>(
		method: string,
		path: string,
		parameters: Record<string, unknown> = {},
	): Promise<T> {
		try {
			const response = await this.octokit.request(
				`${method.toUpperCase()} ${path}`,
				parameters,
			);
			return response.data as T;
		} catch (error) {
			console.error("REST error:", error);
			throw error;
		}
	}
}
