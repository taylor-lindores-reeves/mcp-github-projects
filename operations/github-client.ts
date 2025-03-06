import { createGitHubError } from "../common/errors.js";
import config from "../config.js";

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{
		message: string;
		locations?: unknown;
		path?: unknown;
		extensions?: unknown;
	}>;
}

/**
 * GitHub client for interacting with the GitHub GraphQL API
 */
export class GitHubClient {
	private token: string;
	private apiUrl = "https://api.github.com/graphql";
	private restApiUrl = "https://api.github.com";

	/**
	 * Create a new GitHub client
	 */
	constructor() {
		this.token = config.GITHUB_TOKEN;
	}

	/**
	 * Make a GraphQL request to the GitHub API
	 */
	async graphql<T>(
		query: string,
		variables: Record<string, unknown> = {},
	): Promise<T> {
		const response = await fetch(this.apiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
				Accept: "application/vnd.github.v4+json",
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		const json = (await response.json()) as GraphQLResponse<T>;

		if (!response.ok) {
			throw createGitHubError(response.status, json);
		}

		if (json.errors && json.errors.length > 0) {
			const errorMessage = json.errors.map((e) => e.message).join(", ");
			throw createGitHubError(response.status, { message: errorMessage });
		}

		if (!json.data) {
			throw new Error("No data returned from GitHub API");
		}

		return json.data;
	}

	/**
	 * Make a REST request to the GitHub API
	 */
	async rest<T>(
		method: string,
		path: string,
		body?: Record<string, unknown>,
		customHeaders?: Record<string, string>,
	): Promise<T> {
		const url = `${this.restApiUrl}${path}`;
		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			...customHeaders,
		};

		if (body) {
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			const errorJson = (await response.json()) as Record<string, unknown>;
			throw createGitHubError(response.status, errorJson);
		}

		// Check if the response is empty (204 No Content)
		if (response.status === 204) {
			return {} as T;
		}

		const json = (await response.json()) as T;
		return json;
	}
}
