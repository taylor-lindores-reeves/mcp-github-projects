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
	const directoryPath = path.resolve(process.cwd(), directory);
	const files = fs.readdirSync(directoryPath);

	return files.reduce(
		(acc, file) => {
			if (file.endsWith(".graphql") || file.endsWith(".gql")) {
				const filePath = path.join(directoryPath, file);
				const name = path.basename(file, path.extname(file));
				acc[name] = fs.readFileSync(filePath, "utf8");
			}
			return acc;
		},
		{} as Record<string, string>,
	);
}
