import { GitHubService } from "../services/github.service";
import type { Iteration, IterationStatus, MCPResource } from "../types";

/**
 * Format an Iteration (Sprint) as an MCP Resource
 */
export function formatIterationResource(iteration: Iteration): MCPResource {
	return {
		id: iteration.id,
		type: "iteration",
		attributes: {
			title: iteration.title,
			startDate: iteration.startDate,
			endDate: iteration.endDate,
			status: iteration.status,
			issueCount: iteration.issues.length,
		},
	};
}

/**
 * MCP Iteration Resource
 * Provides methods for creating, listing, and manipulating iterations (sprints)
 */
export class IterationResource {
	private githubService: GitHubService;

	constructor(userToken?: string) {
		this.githubService = new GitHubService({ token: userToken });
	}

	/**
	 * Create a new iteration (sprint)
	 * Note: GitHub Projects doesn't have built-in iterations, so we implement
	 * this with custom fields and project views
	 */
	async createIteration(
		owner: string,
		projectId: string,
		title: string,
		startDate: string,
		endDate: string,
	): Promise<MCPResource> {
		// In a real implementation, we would use the GraphQL API to create
		// a custom field for iteration and add the new iteration to it

		// For now, we'll create a placeholder iteration
		const mockIteration: Iteration = {
			id: `iteration_${Date.now()}`,
			title,
			startDate,
			endDate,
			status: IterationStatus.UPCOMING,
			issues: [],
		};

		return formatIterationResource(mockIteration);
	}

	/**
	 * Get MCP actions available for iterations
	 */
	getActions(): Record<string, unknown> {
		return {
			"create-iteration": {
				description: "Create a new iteration (sprint)",
				parameters: {
					owner: {
						type: "string",
						description: "GitHub username or organization name",
						required: true,
					},
					projectId: {
						type: "string",
						description: "ID of the project",
						required: true,
					},
					title: {
						type: "string",
						description: "Title of the iteration",
						required: true,
					},
					startDate: {
						type: "string",
						description: "Start date of the iteration (ISO format)",
						required: true,
					},
					endDate: {
						type: "string",
						description: "End date of the iteration (ISO format)",
						required: true,
					},
				},
			},
			"update-iteration-status": {
				description: "Update the status of an iteration",
				parameters: {
					iterationId: {
						type: "string",
						description: "ID of the iteration",
						required: true,
					},
					status: {
						type: "string",
						description: "New status (upcoming, current, completed)",
						required: true,
					},
				},
			},
		};
	}
}
