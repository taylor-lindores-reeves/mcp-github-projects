import fs from "node:fs";
import path from "node:path";

/**
 * Loads a GraphQL file and returns its contents as a string
 */
export function loadGraphQLFile(filePath: string): string {
	return fs.readFileSync(path.resolve(process.cwd(), filePath), "utf8");
}

/**
 * Loads GraphQL files from a specified directory
 */
export function loadGraphQLFiles(directory: string): Record<string, string> {
	// Determine if we're in development or production
	const isProduction = process.env.NODE_ENV === "production";

	// Adjust path for production environment
	const basePath = isProduction
		? path.join(process.cwd(), "build")
		: process.cwd();

	const fullPath = path.join(basePath, directory);
	const files = fs.readdirSync(fullPath);

	return files.reduce(
		(acc, file) => {
			if (file.endsWith(".graphql") || file.endsWith(".gql")) {
				const filePath = path.join(fullPath, file);
				const name = path.basename(file, path.extname(file));
				acc[name] = fs.readFileSync(filePath, "utf8");
			}
			return acc;
		},
		{} as Record<string, string>,
	);
}
