import config from "../src/config";

// Test configuration
export const testConfig = {
	// GitHub credentials
	github: {
		token: config.GITHUB_TOKEN,
		username: config.GITHUB_USERNAME,

		// Test repo information - used for issue and iteration tests
		testRepo: process.env.TEST_REPO || "test-repo",

		// Default test project information
		testProjectName: `Test Project - ${new Date().toISOString().slice(0, 16)}`,
		testProjectDescription:
			"Automated test project created by GitHub Projects API test suite",

		// Default test issue information
		testIssueName: `Test Issue - ${new Date().toISOString().slice(0, 16)}`,
		testIssueDescription:
			"This is a test issue created by the GitHub Projects API test suite",

		// Default test iteration information
		testIterationName: "Sprint 1",
		testIterationStartDate: new Date().toISOString().split("T")[0], // Today
		testIterationEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // Two weeks from now
	},

	// Test modes
	mode: {
		// If true, will only log expected API calls without making actual requests
		dryRun: process.env.DRY_RUN === "true",

		// If true, will skip creating new resources to avoid cluttering GitHub
		skipCreation: process.env.SKIP_CREATION === "true",

		// If true, will clean up created test resources after tests
		cleanupAfterTests: process.env.CLEANUP_AFTER_TESTS !== "false",
	},

	// Timeouts
	timeouts: {
		default: 10000, // 10 seconds
		creation: 15000, // 15 seconds
	},
};

// Function to check if a test is enabled
export function isTestEnabled(testName: string): boolean {
	if (process.env.RUN_ONLY_TESTS) {
		const enabledTests = process.env.RUN_ONLY_TESTS.split(",").map((t) =>
			t.trim(),
		);
		return enabledTests.includes(testName);
	}
	return true;
}

// Function to log test information
export function logTestInfo(message: string): void {
	console.log(`\n[TEST INFO] ${message}`);
}
