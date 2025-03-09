export * as issues from "./issues.js";
export * as projects from "./projects.js";
export * as repositories from "./repositories.js";

import { IssueOperations } from "./issues.js";
import { ProjectOperations } from "./projects.js";
import { RepositoryOperations } from "./repositories.js";

export const repositoryOperations = new RepositoryOperations();
export const issueOperations = new IssueOperations();
export const projectOperations = new ProjectOperations();
