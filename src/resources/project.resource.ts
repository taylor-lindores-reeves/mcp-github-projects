import { GitHubService } from "../services/github.service";
import type { MCPResource, Project } from "../types";

/**
 * Format a Project as an MCP Resource
 */
export function formatProjectResource(project: Project): MCPResource {
	return {
		id: project.id,
		type: "project",
		attributes: {
			title: project.title,
			description: project.description,
			status: project.status,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt,
			owner: project.owner,
			iterationCount: project.iterations.length,
		},
	};
}

/**
 * MCP Project Resource
 * Provides methods for creating, listing, and manipulating projects
 */
export class ProjectResource {
	private githubService: GitHubService;

	constructor(userToken?: string) {
		this.githubService = new GitHubService({ token: userToken });
	}

	/**
	 * List projects for a user or organization
	 */
	async listProjects(owner: string): Promise<MCPResource[]> {
		try {
			const projects = await this.githubService.getProjects(owner);
			return projects.map(formatProjectResource);
		} catch (error) {
			console.error("Error listing projects:", error);
			throw error;
		}
	}

	/**
	 * Create a new project
	 */
	async createProject(
		owner: string,
		title: string,
		description: string,
	): Promise<MCPResource> {
		try {
			const project = await this.githubService.createProject(
				owner,
				title,
				description,
			);
			return formatProjectResource(project);
		} catch (error) {
			console.error("Error creating project:", error);
			throw error;
		}
	}

	/**
	 * Get MCP actions available for projects
	 */
	getActions(): Record<string, unknown> {
		return {
			"list-projects": {
				description: "List all projects for a user or organization",
				parameters: {
					owner: {
						type: "string",
						description: "GitHub username or organization name",
						required: true,
					},
				},
			},
			"create-project": {
				description: "Create a new project",
				parameters: {
					owner: {
						type: "string",
						description: "GitHub username or organization name",
						required: true,
					},
					title: {
						type: "string",
						description: "Title of the project",
						required: true,
					},
					description: {
						type: "string",
						description: "Description of the project",
						required: false,
					},
				},
			},
		};
	}
}
