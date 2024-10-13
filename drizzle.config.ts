// import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({
  path: "./.env.local",
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
