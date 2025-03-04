import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { IterationResource } from "../src/resources/iteration.resource";
import type { GitHubService } from "../src/services/github.service";
import type { Iteration, MCPResource } from "../src/types";
import { isTestEnabled, logTestInfo, testConfig } from "./test-config";
import {
	callApi,
	cleanupResources,
	createGitHubService,
	getGitHubUsername,
	testResources,
} from "./test-utils";

describe("GitHub Iterations API", () => {
	let githubService: GitHubService;
	let iterationResource: IterationResource;
	let projectId: string | null = null;
	let createdIteration: Iteration | null = null;

	// Test owner
	const owner = process.env.GITHUB_USERNAME || getGitHubUsername();

	// Set up tests
	beforeAll(async () => {
		logTestInfo("Starting GitHub Iterations API tests");

		try {
			githubService = createGitHubService();
			iterationResource = new IterationResource(testConfig.github.token);

			// First we need to get a project ID to work with
			if (process.env.DRY_RUN === "true") {
				// In dry run mode, use a mock project ID
				projectId = `mock-project-${Date.now()}`;
				logTestInfo(`Using mock project ID for iterations tests: ${projectId}`);
			} else {
				const projects = await githubService.getProjects();
				if (projects && projects.length > 0) {
					projectId = projects[0].id;
					logTestInfo(`Using project: ${projects[0].title} (${projectId})`);
				} else {
					logTestInfo("No projects found. Creating a test project...");
					if (!testConfig.mode.skipCreation) {
						const newProject = await githubService.createProject(
							testConfig.github.testProjectName,
							testConfig.github.testProjectDescription,
						);
						projectId = newProject.id;
						testResources.projects.push(newProject);
						logTestInfo(
							`Created test project: ${newProject.title} (${projectId})`,
						);
					}
				}
			}
		} catch (error) {
			console.error("Failed to setup project for iteration tests:", error);
			// Don't fail the test setup in dry run mode
			if (process.env.DRY_RUN === "true") {
				projectId = `mock-project-${Date.now()}`;
				logTestInfo(`Using mock project ID for iterations tests: ${projectId}`);
			} else {
				throw error;
			}
		}
	});

	// Clean up after tests
	afterAll(async () => {
		if (process.env.DRY_RUN !== "true") {
			await cleanupResources();
		}
	});

	test("should create a new iteration (sprint)", async () => {
		if (
			!isTestEnabled("create-iteration") ||
			testConfig.mode.skipCreation ||
			!projectId
		) {
			return;
		}

		const iterationTitle = testConfig.github.testIterationName;
		const startDate = testConfig.github.testIterationStartDate;
		const endDate = testConfig.github.testIterationEndDate;

		if (process.env.DRY_RUN === "true") {
			// In dry run mode, we just verify the test logic
			createdIteration = {
				id: `mock-iteration-${Date.now()}`,
				title: iterationTitle,
				startDate: startDate,
				endDate: endDate,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			console.log(`\nCreated iteration (dry run): ${createdIteration.title}`);
			console.log(`ID: ${createdIteration.id}`);
			console.log(
				`Duration: ${createdIteration.startDate} to ${createdIteration.endDate}`,
			);

			expect(createdIteration.title).toBe(iterationTitle);
		} else {
			createdIteration = await callApi(
				githubService.createIteration.bind(githubService),
				[owner, projectId, iterationTitle, startDate, endDate],
				`Creating iteration "${iterationTitle}" for project ${projectId}`,
			);

			if (createdIteration) {
				// Save for cleanup
				testResources.iterations.push(createdIteration);

				console.log(`\nCreated iteration: ${createdIteration.title}`);
				console.log(`ID: ${createdIteration.id}`);
				console.log(
					`Duration: ${createdIteration.startDate} to ${createdIteration.endDate}`,
				);
			}

			expect(createdIteration?.title).toBe(iterationTitle);
			expect(createdIteration?.startDate).toBe(startDate);
			expect(createdIteration?.endDate).toBe(endDate);
		}
	});

	test("should use the MCPResource format for iterations", async () => {
		if (!isTestEnabled("iteration-resource-format") || !projectId) {
			return;
		}

		const iterationTitle = `${testConfig.github.testIterationName} MCP`;
		const startDate = testConfig.github.testIterationStartDate;
		const endDate = testConfig.github.testIterationEndDate;

		// In dry run mode, simulate the MCP resource response
		if (process.env.DRY_RUN === "true") {
			const mockMcpResource: MCPResource = {
				id: `mock-iteration-${Date.now()}`,
				type: "iteration",
				attributes: {
					title: iterationTitle,
					startDate: startDate,
					endDate: endDate,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			};

			expect(mockMcpResource).toBeDefined();
			expect(mockMcpResource.type).toBe("iteration");
			expect(mockMcpResource.attributes.title).toBe(iterationTitle);

			console.log("MCP Resource format for an iteration (dry run):");
			console.log(JSON.stringify(mockMcpResource, null, 2));
		} else {
			const mcpResource = await callApi(
				iterationResource.createIteration.bind(iterationResource),
				[owner, projectId, iterationTitle, startDate, endDate],
				"Creating iteration with MCP resource format",
			);

			expect(mcpResource).toBeDefined();

			if (mcpResource) {
				expect(mcpResource.type).toBe("iteration");
				expect(mcpResource.attributes.title).toBe(iterationTitle);

				console.log("\nMCP Resource format for an iteration:");
				console.log(JSON.stringify(mcpResource, null, 2));
			}
		}
	});
});
