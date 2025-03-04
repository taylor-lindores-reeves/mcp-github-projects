// Re-export the MCP server creation function
export { createMCPServer } from "./src/mcp-server";

// If this file is executed directly, start the server
if (require.main === module) {
	// Import and run the CLI
	import("./src/cli");
}
