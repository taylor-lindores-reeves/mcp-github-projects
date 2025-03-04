// MCP Resource Types
export interface MCPResource {
	id: string;
	type: string;
	attributes: Record<string, unknown>;
}

// GitHub Projects Types
export interface Project {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	owner: string;
	status: ProjectStatus;
	iterations: Iteration[];
}

export interface Iteration {
	id: string;
	title: string;
	startDate: string;
	endDate: string;
	status: IterationStatus;
	issues: Issue[];
	createdAt?: string;
	updatedAt?: string;
}

export interface Issue {
	id: string;
	title: string;
	description: string;
	status: IssueStatus;
	assignees: string[];
	labels: string[];
	createdAt: string;
	updatedAt: string;
	priority: IssuePriority;
	points?: number;
	number: number;
	body: string;
	url: string;
}

// Enums (implemented as constant maps for TypeScript best practices)
export const ProjectStatus = {
	ACTIVE: "active",
	ARCHIVED: "archived",
	DRAFT: "draft",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const IterationStatus = {
	UPCOMING: "upcoming",
	CURRENT: "current",
	COMPLETED: "completed",
} as const;

export type IterationStatus =
	(typeof IterationStatus)[keyof typeof IterationStatus];

export const IssueStatus = {
	BACKLOG: "backlog",
	TO_DO: "todo",
	IN_PROGRESS: "in_progress",
	IN_REVIEW: "in_review",
	DONE: "done",
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssuePriority = {
	LOW: "low",
	MEDIUM: "medium",
	HIGH: "high",
	URGENT: "urgent",
} as const;

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority];

// MCP Action Types
export interface MCPAction {
	id: string;
	name: string;
	description: string;
	parameters: MCPActionParameter[];
}

export interface MCPActionParameter {
	name: string;
	type: string;
	description: string;
	required: boolean;
}

// GitHub API Response Types
export interface GitHubProjectResponse {
	id: string;
	number: number;
	title: string;
	shortDescription: string;
	createdAt: string;
	updatedAt: string;
	// Additional fields as needed
}

export interface GitHubIssueResponse {
	id: string;
	number: number;
	title: string;
	body: string;
	state: string;
	createdAt: string;
	updatedAt: string;
	// Additional fields as needed
}

// Auth Types
export interface AuthUser {
	id: string;
	username: string;
	gitHubToken?: string;
}
