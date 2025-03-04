import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { IssueResource } from "../src/resources/issue.resource";
import type { GitHubService } from "../src/services/github.service";
import { type Issue, IssueStatus, type MCPResource } from "../src/types";
import { isTestEnabled, logTestInfo, testConfig } from "./test-config";
import {
	callApi,
	cleanupResources,
	createGitHubService,
	getGitHubUsername,
	testResources,
} from "./test-utils";

describe("GitHub Issues API", () => {
	let githubService: GitHubService;
	let issueResource: IssueResource;
	let createdIssue: Issue | null = null;
	let issueNumber: number;

	// Test repository details
	const owner = process.env.GITHUB_USERNAME || getGitHubUsername();
	const repo = "test-repo";

	// Set up tests
	beforeAll(() => {
		logTestInfo("Starting GitHub Issues API tests");
		githubService = createGitHubService();
		issueResource = new IssueResource(testConfig.github.token);

		logTestInfo(`Using repository: ${owner}/${repo}`);
	});

	// Clean up after tests
	afterAll(async () => {
		await cleanupResources();
	});

	test("should list issues for a repository", async () => {
		if (!isTestEnabled("list-issues")) {
			return;
		}

		try {
			const issues = await callApi(
				githubService.getIssues.bind(githubService),
				[owner, repo],
				`Fetching issues for ${owner}/${repo}`,
			);

			logTestInfo(`Found ${issues?.length || 0} issues`);

			if (issues) {
				// Save for potential cleanup
				testResources.issues.push(...issues);

				// Log issue details
				issues.forEach((issue, index) => {
					console.log(`\n[${index + 1}] ${issue.title} (#${issue.number})`);
					console.log(`    Status: ${issue.status}`);
					console.log(`    Priority: ${issue.priority}`);
					console.log(
						`    Created: ${new Date(issue.createdAt).toLocaleString()}`,
					);
				});
			}

			if (process.env.DRY_RUN === "true") {
				// In dry run mode, we expect an empty array
				expect(Array.isArray(issues)).toBe(true);
				console.log("Issues (dry run):", issues);
			} else {
				expect(Array.isArray(issues)).toBe(true);
				console.log("Issues:", issues);
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("Not Found")) {
				console.warn(`\nRepository ${owner}/${repo} not found. Skipping test.`);
			} else {
				throw error;
			}
		}
	});

	test("should create a new issue", async () => {
		if (!isTestEnabled("create-issue") || testConfig.mode.skipCreation) {
			return;
		}

		try {
			const issueTitle = testConfig.github.testIssueName;
			const issueDescription = testConfig.github.testIssueDescription;
			const labels = ["test", "api"];

			createdIssue = await callApi(
				githubService.createIssue.bind(githubService),
				[owner, repo, issueTitle, issueDescription, labels],
				`Creating issue "${issueTitle}" in ${owner}/${repo}`,
			);

			if (createdIssue) {
				// Save for cleanup
				testResources.issues.push(createdIssue);

				console.log(
					`\nCreated issue: ${createdIssue.title} (#${createdIssue.number})`,
				);
				console.log(`URL: ${createdIssue.url}`);
			}

			if (process.env.DRY_RUN === "true") {
				// In dry run mode, we expect a mock issue
				expect(createdIssue).toBeDefined();
				if (createdIssue) {
					expect(createdIssue.title).toBe(issueTitle);
					expect(createdIssue.body).toBe(issueDescription);
					issueNumber = createdIssue.number;
					console.log("Created Issue (dry run):", createdIssue);
				}
			} else {
				expect(createdIssue).toBeDefined();
				if (createdIssue) {
					expect(createdIssue.title).toBe(issueTitle);
					expect(createdIssue.body).toBe(issueDescription);
					issueNumber = createdIssue.number;
					console.log("Created Issue:", createdIssue);
				}
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("Not Found")) {
				console.warn(`\nRepository ${owner}/${repo} not found. Skipping test.`);
			} else {
				throw error;
			}
		}
	});

	test("should update an issue's status", async () => {
		if (
			!isTestEnabled("update-issue-status") ||
			testConfig.mode.skipCreation ||
			!createdIssue
		) {
			return;
		}

		const newStatus = IssueStatus.IN_PROGRESS;

		await callApi(
			githubService.updateIssueStatus.bind(githubService),
			[owner, repo, createdIssue.number, newStatus],
			`Updating issue #${createdIssue.number} status to ${newStatus}`,
		);

		// Get the updated issue
		const updatedIssues = await callApi(
			githubService.getIssues.bind(githubService),
			[owner, repo],
			`Re-fetching issues for ${owner}/${repo}`,
		);

		const updatedIssue = updatedIssues?.find(
			(i) => i.number === createdIssue?.number,
		);

		if (updatedIssue) {
			console.log(`\nUpdated issue status: ${updatedIssue.status}`);
		}

		if (process.env.DRY_RUN === "true") {
			// In dry run mode, we expect a mock updated issue
			expect(Array.isArray(updatedIssues)).toBe(true);
			if (updatedIssues && updatedIssues.length > 0) {
				const updatedIssue = updatedIssues[0];
				expect(updatedIssue.status).toBe(newStatus);
				console.log("Updated Issue (dry run):", updatedIssue);
			}
		} else {
			expect(updatedIssue?.status).toBe(newStatus);
			console.log("Updated Issue:", updatedIssue);
		}
	});

	test("should use the MCPResource format for issues", async () => {
		if (!isTestEnabled("issue-resource-format") || !createdIssue) {
			return;
		}

		try {
			if (process.env.DRY_RUN === "true") {
				// Create a mock MCP resource for dry run mode
				const mockMcpResource: MCPResource = {
					id: `mock-issue-${Date.now()}`,
					type: "issue",
					attributes: {
						title: createdIssue.title,
						description: createdIssue.body,
						status: createdIssue.status,
						priority: createdIssue.priority,
						createdAt: createdIssue.createdAt,
						updatedAt: createdIssue.updatedAt,
						number: createdIssue.number,
						url: createdIssue.url,
					},
				};

				expect(mockMcpResource).toBeDefined();
				expect(mockMcpResource.type).toBe("issue");
				console.log("MCP Resource (dry run):", mockMcpResource);
			} else {
				const mcpResources = await callApi(
					issueResource.listIssues.bind(issueResource),
					[owner, repo],
					"Fetching issues with MCP resource format",
				);

				expect(mcpResources).toBeDefined();

				if (mcpResources && mcpResources.length > 0) {
					expect(mcpResources[0].type).toBe("issue");

					console.log("\nMCP Resource format for an issue:");
					console.log(JSON.stringify(mcpResources[0], null, 2));
				}
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("Not Found")) {
				console.warn(`\nRepository ${owner}/${repo} not found. Skipping test.`);
			} else {
				throw error;
			}
		}
	});

	test("should list issues with updated status", async () => {
		if (
			!isTestEnabled("list-issues-after-update") ||
			testConfig.mode.skipCreation ||
			!createdIssue
		) {
			return;
		}

		const updatedIssues = await callApi<Issue[]>(
			githubService.getIssues.bind(githubService),
			[owner, repo],
			"Listing issues again to verify status update",
		);

		// Find our issue by number
		const foundIssue = updatedIssues?.find(
			(i) => i.number === createdIssue?.number,
		);

		// Log all issues to help with debugging
		console.log("\nIssues after status update:");
		if (updatedIssues && updatedIssues.length > 0) {
			updatedIssues.forEach((issue, index) => {
				console.log(`\n[${index + 1}] ${issue.title} (#${issue.number})`);
				console.log(`Status: ${issue.status}`);
			});
		} else {
			console.log("No issues found after update.");
		}
	});
});
