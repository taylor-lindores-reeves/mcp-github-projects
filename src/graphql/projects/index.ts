import path from "node:path";
import { loadGraphQLFiles } from "../../utils/graphql-loader.js";

// Load all GraphQL files from the projects directory
const graphqlDir = path.join("src", "graphql", "projects");
const operations = loadGraphQLFiles(graphqlDir);

// Export each operation by name
export const {
	getProject,
	listProjects,
	getProjectColumns,
	getProjectFields,
	getProjectItems,
	addProjectV2ItemById,
	updateProjectItemFieldValue,
	createProjectV2,
	updateProjectV2,
	deleteProjectV2,
	copyProjectV2,
	addProjectV2DraftIssue,
	convertProjectV2DraftIssueToIssue,
	updateProjectV2ItemPosition,
	deleteProjectV2Item,
	createProjectV2Field,
	updateProjectV2Field,
	deleteProjectV2Field,
	updateProjectV2StatusUpdate,
	archiveProjectV2Item,
	unarchiveProjectV2Item,
	clearProjectV2ItemFieldValue,
	markProjectV2AsTemplate,
	unmarkProjectV2AsTemplate,
} = operations;
