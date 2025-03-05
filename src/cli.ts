#!/usr/bin/env bun
import dotenv from "dotenv";
import { createMCPServer } from "./mcp-server";

// Load environment variables
dotenv.config();

async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || "start";

	if (command === "start") {
		const githubToken = process.env.GITHUB_TOKEN;

		if (!githubToken) {
			console.warn(
				"Warning: No GitHub token provided. Some functionality may be limited.",
			);
			console.warn(
				"Set the GITHUB_TOKEN environment variable to enable all features.",
			);
		}
		try {
			await createMCPServer(githubToken);
			console.error("MCP Server is running. Press Ctrl+C to stop.");
		} catch (error) {
			console.error("Failed to start MCP Server:", error);
			process.exit(1);
		}
	} else if (command === "help") {
		printHelp();
	} else {
		console.error(`Unknown command: ${command}`);
		printHelp();
		process.exit(1);
	}
}

function printHelp() {
	console.error(`
GitHub Projects MCP Server

USAGE:
  bun run cli.ts [COMMAND]

COMMANDS:
  start    Start the MCP server (default)
  help     Display this help message

ENVIRONMENT VARIABLES:
  GITHUB_TOKEN    GitHub personal access token for authentication
  `);
}

// Run the CLI
main().catch((error) => {
	console.error("Unhandled error:", error);
	process.exit(1);
});
