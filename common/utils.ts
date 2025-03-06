import {
	GitHubAuthenticationError,
	GitHubConflictError,
	type GitHubError,
	GitHubPermissionError,
	GitHubRateLimitError,
	GitHubResourceNotFoundError,
	GitHubValidationError,
} from "../common/errors.js";

/**
 * Parses the response body based on content type
 */
export async function parseResponseBody(response: Response): Promise<unknown> {
	const contentType = response.headers.get("content-type");
	if (contentType?.includes("application/json")) {
		return response.json();
	}
	return response.text();
}

/**
 * Builds a URL with query parameters
 */
export function buildUrl(
	baseUrl: string,
	params: Record<string, string | number | undefined>,
): string {
	const url = new URL(baseUrl);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			url.searchParams.append(key, value.toString());
		}
	}
	return url.toString();
}

/**
 * Validates a repository name
 */
export function validateRepositoryName(name: string): string {
	const sanitized = name.trim().toLowerCase();
	if (!sanitized) {
		throw new Error("Repository name cannot be empty");
	}
	if (!/^[a-z0-9_.-]+$/.test(sanitized)) {
		throw new Error(
			"Repository name can only contain lowercase letters, numbers, hyphens, periods, and underscores",
		);
	}
	if (sanitized.startsWith(".") || sanitized.endsWith(".")) {
		throw new Error("Repository name cannot start or end with a period");
	}
	return sanitized;
}

/**
 * Validates an owner name
 */
export function validateOwnerName(owner: string): string {
	const sanitized = owner.trim().toLowerCase();
	if (!sanitized) {
		throw new Error("Owner name cannot be empty");
	}
	if (!/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/.test(sanitized)) {
		throw new Error(
			"Owner name must start with a letter or number and can contain up to 39 characters",
		);
	}
	return sanitized;
}

/**
 * Format date to ISO string
 */
export function formatDateISO(date: Date): string {
	return date.toISOString();
}

/**
 * Convert a GitHub Project ID into GraphQL notation (if needed)
 */
export function formatProjectId(id: string | number): string {
	// If string already has the format we need, return as is
	if (typeof id === "string" && id.startsWith("PVT_")) {
		return id;
	}

	// If numeric, convert to string PVT_kwDOA...
	if (typeof id === "number" || /^\d+$/.test(id.toString())) {
		return `PVT_kwDOA${id}`;
	}

	return id.toString();
}

/**
 *
 */
function formatGitHubError(error: GitHubError): string {
	let message = `GitHub API Error: ${error.message}`;

	if (error instanceof GitHubValidationError) {
		message = `Validation Error: ${error.message}`;
		if (error.response) {
			message += `\nDetails: ${JSON.stringify(error.response)}`;
		}
	} else if (error instanceof GitHubResourceNotFoundError) {
		message = `Not Found: ${error.message}`;
	} else if (error instanceof GitHubAuthenticationError) {
		message = `Authentication Failed: ${error.message}`;
	} else if (error instanceof GitHubPermissionError) {
		message = `Permission Denied: ${error.message}`;
	} else if (error instanceof GitHubRateLimitError) {
		message = `Rate Limit Exceeded: ${error.message}\nResets at: ${error.resetAt.toISOString()}`;
	} else if (error instanceof GitHubConflictError) {
		message = `Conflict: ${error.message}`;
	}

	return message;
}
