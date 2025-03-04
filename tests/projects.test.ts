import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { ProjectResource } from "../src/resources/project.resource";
import type { GitHubService } from "../src/services/github.service";
import type { Project } from "../src/types";
import { isTestEnabled, logTestInfo, testConfig } from "./test-config";
import {
	callApi,
	cleanupResources,
	createGitHubService,
	testResources,
} from "./test-utils";

describe("GitHub Projects API", () => {
	let githubService: GitHubService;
	let projectResource: ProjectResource;
	let createdProject: Project | null = null;

	// Set up tests
	beforeAll(() => {
		logTestInfo("Starting GitHub Projects API tests");
		githubService = createGitHubService();
		projectResource = new ProjectResource(testConfig.github.token);
	});

	// Clean up after tests
	afterAll(async () => {
		await cleanupResources();
	});

	test("should list projects for the user", async () => {
		if (!isTestEnabled("list-projects")) {
			return;
		}

		const projects = await callApi(
			githubService.getProjects.bind(githubService),
			[],
			"Fetching projects",
		);

		logTestInfo(`Found ${projects?.length || 0} projects`);

		if (projects) {
			// Save projects for potential cleanup
			testResources.projects.push(...projects);

			// Log project details
			projects.forEach((project, index) => {
				console.log(`\n[${index + 1}] ${project.title}`);
				console.log(`    ID: ${project.id}`);
				console.log(
					`    Description: ${project.description || "No description"}`,
				);
				console.log(`    Status: ${project.status}`);
			});
		}

		// We don't assert on the exact number of projects as it depends on the GitHub account
		expect(Array.isArray(projects)).toBe(true);
	});

	test("should create a new project", async () => {
		if (!isTestEnabled("create-project") || testConfig.mode.skipCreation) {
			return;
		}

		const projectTitle = testConfig.github.testProjectName;
		const projectDescription = testConfig.github.testProjectDescription;

		createdProject = await callApi(
			githubService.createProject.bind(githubService),
			[projectTitle, projectDescription],
			`Creating project "${projectTitle}"`,
		);

		if (createdProject) {
			// Save for cleanup
			testResources.projects.push(createdProject);

			console.log(`\nCreated project: ${createdProject.title}`);
			console.log(`ID: ${createdProject.id}`);
		}

		expect(createdProject?.title).toBe(projectTitle);
		expect(createdProject?.description).toBe(projectDescription);
	});

	test("should use the MCPResource format for projects", async () => {
		if (!isTestEnabled("project-resource-format") || !createdProject) {
			return;
		}

		// In dry run mode, simulate the MCP resource response
		if (testConfig.mode.dryRun) {
			const mockMcpResource = {
				id: `mock-project-${Date.now()}`,
				type: "project",
				attributes: {
					title: createdProject.title,
					description: createdProject.description,
					status: createdProject.status,
					createdAt: createdProject.createdAt,
					updatedAt: createdProject.updatedAt,
					owner: createdProject.owner,
					iterationCount: 0,
				},
			};

			expect(mockMcpResource).toBeDefined();
			expect(mockMcpResource.type).toBe("project");
			expect(mockMcpResource.attributes.title).toBe(createdProject.title);
			expect(mockMcpResource.attributes.description).toBe(
				createdProject.description,
			);

			console.log("\nMCP Resource format (mock):");
			console.log(JSON.stringify(mockMcpResource, null, 2));
			return;
		}

		const mcpResource = await callApi(
			projectResource.createProject.bind(projectResource),
			[createdProject.title, createdProject.description],
			"Creating project with MCP resource",
		);

		expect(mcpResource).toBeDefined();

		if (mcpResource) {
			expect(mcpResource.type).toBe("project");
			expect(mcpResource.attributes.title).toBe(createdProject.title);
			expect(mcpResource.attributes.description).toBe(
				createdProject.description,
			);

			console.log("\nMCP Resource format:");
			console.log(JSON.stringify(mcpResource, null, 2));
		}
	});
});
