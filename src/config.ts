import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define the configuration schema
const configSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	GITHUB_API_URL: z.string().default("https://api.github.com"),
	GITHUB_APP_ID: z.string().optional(),
	GITHUB_APP_PRIVATE_KEY: z.string().optional(),
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),
	JWT_SECRET: z.string().default("your-jwt-secret"),
	JWT_EXPIRES_IN: z.string().default("24h"),
	CORS_ORIGIN: z.string().default("*"),
	RATE_LIMIT_WINDOW: z.string().default("15"),
	RATE_LIMIT_MAX: z.string().default("100"),
});

// Parse the configuration
const config = configSchema.parse({
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	GITHUB_API_URL: process.env.GITHUB_API_URL,
	GITHUB_APP_ID: process.env.GITHUB_APP_ID,
	GITHUB_APP_PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
	RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
	RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
});

export default config;
