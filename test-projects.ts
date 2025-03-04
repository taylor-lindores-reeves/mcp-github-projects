import config from "./src/config";
import { GitHubService } from "./src/services/github.service";

async function testListProjects() {
	console.log("Using GitHub username:", config.GITHUB_USERNAME);

	// Initialize the GitHub service with the token from config
	const githubService = new GitHubService({
		token: config.GITHUB_TOKEN,
		username: config.GITHUB_USERNAME,
	});

	try {
		console.log("Fetching projects...");

		// Get projects for the configured user
		const projects = await githubService.getProjects();

		// Display results
		console.log("\nProjects found:", projects.length);

		if (projects.length === 0) {
			console.log("No projects found for user:", config.GITHUB_USERNAME);
		} else {
			console.log("\nProjects:");
			projects.forEach((project, index) => {
				console.log(`\n[${index + 1}] ${project.title}`);
				console.log(`    ID: ${project.id}`);
				console.log(
					`    Description: ${project.description || "No description"}`,
				);
				console.log(`    Status: ${project.status}`);
				console.log(
					`    Created: ${new Date(project.createdAt).toLocaleString()}`,
				);
				console.log(
					`    Updated: ${new Date(project.updatedAt).toLocaleString()}`,
				);
			});
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
}

// Run the test
testListProjects().catch((error) => {
	console.error("Unhandled error:", error);
});
