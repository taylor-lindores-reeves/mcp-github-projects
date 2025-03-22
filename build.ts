import { build } from "esbuild";
import fs from "node:fs";

// Create a plugin that handles GraphQL files
const graphqlPlugin = {
	name: "graphql-files",
	setup(build) {
		// Handle .graphql file imports
		build.onLoad({ filter: /\.graphql$/ }, async (args) => {
			const contents = await fs.promises.readFile(args.path, "utf8");
			return {
				contents: `export default ${JSON.stringify(contents)};`,
				loader: "js",
			};
		});
	},
};

await build({
	entryPoints: ["./src/index.ts"],
	bundle: true,
	minify: true,
	platform: "node",
	target: "node18",
	outfile: "./build/index.js",
	format: "esm",
	banner: {
		js: "#!/usr/bin/env node",
	},
	plugins: [graphqlPlugin],
	// Add graphql to resolve extensions
	resolveExtensions: [".ts", ".js", ".graphql", ".json"],
});

// Set executable permission
fs.chmodSync("./build/index.js", "755");
