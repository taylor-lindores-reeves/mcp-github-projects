import { GitHubService } from "../src/services/github.service";
import type { Issue, Iteration, Project } from "../src/types";
import { logTestInfo, testConfig } from "./test-config";

// Store created resources for potential cleanup
export const testResources = {
	projects: [] as Project[],
	issues: [] as Issue[],
	iterations: [] as Iteration[],
};

// Initialize service with test credentials
export function createGitHubService(): GitHubService {
	return new GitHubService({
		token: testConfig.github.token,
		username: testConfig.github.username,
	});
}

// Helper to log API calls in dry run mode
export function logApiCall(
	method: string,
	endpoint: string,
	params: Record<string, any>,
): void {
	if (testConfig.mode.dryRun) {
		console.log(`\n[DRY RUN] Would call ${method} ${endpoint}`);
		console.log("Parameters:", JSON.stringify(params, null, 2));
	}
}

// Wrapper for API calls with dry run support
export async function callApi<T>(
	apiFunction: (...args: any[]) => Promise<T>,
	args: any[],
	description: string,
): Promise<T | null> {
	try {
		logTestInfo(`${description}...`);

		if (testConfig.mode.dryRun) {
			console.log(`[DRY RUN] Would ${description.toLowerCase()}`);

			// For testing purposes, return mock data in dry run mode
			if (description.includes("Fetching projects")) {
				return [] as unknown as T;
			}

			if (description.toLowerCase().includes("fetching issues")) {
				// Return an empty array for issues
				return [] as unknown as T;
			}

			if (description.toLowerCase().includes("re-fetching issues")) {
				// For issue status updates, return a mock updated issue
				const [owner, repo] = args as [string, string];
				return [
					{
						id: `mock-issue-${Date.now()}`,
						title: "Test Issue",
						body: "Test Description",
						number: 341, // Use the same number as in the created issue test
						status: "in_progress", // Updated status
						priority: "MEDIUM",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						url: `https://github.com/${owner}/${repo}/issues/1`,
					},
				] as unknown as T;
			}

			if (description.includes("Creating project")) {
				const [title, description] = args;
				return {
					id: `mock-project-${Date.now()}`,
					title: title,
					description: description,
					status: "ACTIVE",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					owner: testConfig.github.username,
					iterations: [],
				} as unknown as T;
			}

			if (description.includes("with MCP resource")) {
				// Return a mock MCP Resource depending on the context
				if (description.includes("project")) {
					const [title, description] = args;
					return {
						id: `mock-project-${Date.now()}`,
						type: "project",
						attributes: {
							title: title,
							description: description,
							status: "ACTIVE",
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
							owner: testConfig.github.username,
							iterationCount: 0,
						},
					} as unknown as T;
				}

				if (description.includes("issue")) {
					return {
						id: `mock-issue-${Date.now()}`,
						type: "issue",
						attributes: {
							title: args[2], // title is usually the 3rd arg for issues
							description: args[3], // description is usually the 4th arg
							status: "OPEN",
							priority: "MEDIUM",
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
							number: Math.floor(Math.random() * 1000),
							url: `https://github.com/${args[0]}/${args[1]}/issues/1`,
						},
					} as unknown as T;
				}

				if (description.includes("iteration")) {
					return {
						id: `mock-iteration-${Date.now()}`,
						type: "iteration",
						attributes: {
							title: args[2], // title is usually the 3rd arg
							startDate: args[3], // startDate
							endDate: args[4], // endDate
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					} as unknown as T;
				}
			}

			if (description.includes("Creating issue")) {
				const [owner, repo, title, description, labels] = args;
				return {
					id: `mock-issue-${Date.now()}`,
					title: title,
					body: description,
					number: Math.floor(Math.random() * 1000),
					status: "OPEN",
					priority: "MEDIUM",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					url: `https://github.com/${owner}/${repo}/issues/1`,
					labels: labels || [],
				} as unknown as T;
			}

			if (description.includes("Creating iteration")) {
				const [owner, projectId, title, startDate, endDate] = args;
				return {
					id: `mock-iteration-${Date.now()}`,
					title: title,
					startDate: startDate,
					endDate: endDate,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				} as unknown as T;
			}

			return null;
		}

		const result = await apiFunction(...args);
		return result;
	} catch (error) {
		console.error(`Failed to ${description.toLowerCase()}:`, error);
		throw error;
	}
}

// Clean up test resources
export async function cleanupResources(): Promise<void> {
	if (!testConfig.mode.cleanupAfterTests || testConfig.mode.dryRun) {
		return;
	}

	const service = createGitHubService();

	logTestInfo("Cleaning up test resources...");

	// Clean up would be implemented here if the GitHub API supports deleting resources
	// Currently, the GitHub Projects API doesn't expose delete endpoints in the GraphQL API

	logTestInfo("Cleanup complete");
}

// Helper to sleep for a specified duration
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate a unique test name with timestamp
export function generateUniqueName(prefix: string): string {
	return `${prefix} ${Date.now()}`;
}

// Function to get GitHub username from environment or config
export function getGitHubUsername(): string {
	// First try to get from environment variable
	if (process.env.GITHUB_USERNAME) {
		return process.env.GITHUB_USERNAME;
	}

	// Fall back to config
	if (testConfig.github.username) {
		return testConfig.github.username;
	}

	// Default fallback
	return "test-user";
}
