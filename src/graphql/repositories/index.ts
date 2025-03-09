import path from "node:path";
import { loadGraphQLFiles } from "../../utils/graphql-loader.js";

// Load all GraphQL files from the repositories directory
const graphqlDir = path.join("src", "graphql", "repositories");
const operations = loadGraphQLFiles(graphqlDir);

// Export each operation by name
export const { getRepository } = operations;
