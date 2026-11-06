import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load environment from .env file if available
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001,*"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DATABASE_URL: z.string().default("file:./data/hexfence.db.json"),
  DEV_ADMIN_TOKEN: z.string().default("hexfence-dev-admin-secret-key-2026"),
  ARKIV_GATEWAY_URL: z.string().url().default("https://gateway.arkiv.network/v1"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

export type EnvConfig = z.infer<typeof envSchema>;

