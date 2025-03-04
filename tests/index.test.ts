/**
 * GitHub Projects API Test Suite
 * Run all tests with: bun test
 *
 * Configuration options (set as environment variables):
 * - DRY_RUN=true         Run tests without making actual API calls
 * - SKIP_CREATION=true   Skip tests that create new resources
 * - TEST_REPO=repo-name  Specify a repository to use for tests
 * - RUN_ONLY_TESTS=test1,test2  Run only specific tests by name
 *
 * Example:
 *   DRY_RUN=true bun test
 *   TEST_REPO=my-test-repo bun test
 *   RUN_ONLY_TESTS=list-projects,list-issues bun test
 */

import { describe, it } from "bun:test";
import { logTestInfo } from "./test-config";

describe("GitHub Projects API Test Suite", () => {
	it("should run all tests", async () => {
		logTestInfo("GitHub Projects API Test Suite Initialized");

		// Import and run all test files
		await import("./projects.test");
		await import("./issues.test");
		await import("./iterations.test");

		logTestInfo("All tests completed");
	});
});
