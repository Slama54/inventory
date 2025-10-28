import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});