import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolves the database URL dynamically.
 * - If DATABASE_URL is set (e.g. Postgres / remote DB), it is used directly.
 * - On Vercel serverless environments, the filesystem at /var/task is read-only.
 *   We copy the pre-seeded SQLite database to /tmp/dev.db so write operations
 *   (user registration, logins, CAPTCHAs, approvals, and orders) succeed seamlessly.
 * - In local development, the default file:./dev.db is used.
 */
function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.VERCEL) {
    const tmpDbPath = "/tmp/dev.db";
    const srcDbPath = path.join(process.cwd(), "prisma", "dev.db");

    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(srcDbPath)) {
          fs.copyFileSync(srcDbPath, tmpDbPath);
        }
      }
      return `file:${tmpDbPath}`;
    } catch (err) {
      console.error("Vercel SQLite database copy error:", err);
    }
  }

  return undefined;
}

const resolvedUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedUrl ? { db: { url: resolvedUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
