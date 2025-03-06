import { z } from "zod";

// Define the configuration schema
const configSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	GITHUB_TOKEN: z.string(),
});

// Parse the configuration
const config = configSchema.parse({
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	GITHUB_TOKEN: process.env.GITHUB_TOKEN,
});

export default config;
