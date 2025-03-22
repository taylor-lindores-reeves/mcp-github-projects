import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "./schema.docs.graphql",
	documents: "./src/graphql/**/*.graphql",
	generates: {
		"./src/types/github-api-types.ts": {
			plugins: ["typescript", "typescript-operations"],
			config: {
				avoidOptionals: true, // Keep optional fields with '?'
				skipTypename: true, // Omit '__typename' fields to reduce noise
				declarationKind: "interface", // Use interfaces instead of types (more readable)
				enumsAsTypes: false, // Keep enums as proper TS enums
				namingConvention: {
					transformUnderscore: true, // Remove underscores from names
				},

				scalars: {
					// Define how GraphQL scalars map to TS
					DateTime: "string",
					URI: "string",
					GitObjectID: "string",
					HTML: "string",
				},

				preResolveTypes: true, // Flatten types for readability
				addUnderscoreToArgsType: false, // Don't add underscores to args type names
				nonOptionalTypename: false, // Don't make __typename required
				useTypeImports: true, // Use "import type" for cleaner imports
				immutableTypes: false, // Don't make everything readonly
				inlineFragmentTypes: "inline", // Inline fragment types for readability
				exportFragmentSpreadSubTypes: true, // Export fragment spread subtypes
				mergeFragmentTypes: true, // Merge fragment types when possible
			},
		},
	},
};

export default config;
