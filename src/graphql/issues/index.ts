import path from "node:path";
import { loadGraphQLFiles } from "../../utils/graphql-loader.js";

// Load all GraphQL files from the issues directory
const graphqlDir = path.join("src", "graphql", "issues");
const operations = loadGraphQLFiles(graphqlDir);

// Export each operation by name
export const { getIssue } = operations;
