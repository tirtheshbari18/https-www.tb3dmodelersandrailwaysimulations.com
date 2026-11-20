import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolves the database URL dynamically.
 * - If DATABASE_URL is set to a remote database (e.g. Postgres / MySQL), it is used directly.
 * - On Vercel serverless environments, the filesystem at /var/task is strictly read-only.
 *   If using a local SQLite file (file:...), we copy dev.db to /tmp/dev.db (if not already copied)
 *   so that all write operations (creating/editing/deleting products, coaches, train boards,
 *   home slides, orders, and user management) succeed without "attempt to write a readonly database" errors.
 * - In local development, the default file:./dev.db is used.
 */
function resolveDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // If using an external remote database (e.g. PostgreSQL, Supabase, MySQL)
  if (
    envUrl &&
    !envUrl.startsWith("file:") &&
    (envUrl.startsWith("postgres:") ||
      envUrl.startsWith("postgresql:") ||
      envUrl.startsWith("mysql:") ||
      envUrl.startsWith("prisma:"))
  ) {
    return envUrl;
  }

  // Check if we are running in Vercel or an AWS Lambda serverless environment
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isVercel) {
    const tmpDbPath = "/tmp/dev.db";

    try {
      if (!fs.existsSync(tmpDbPath)) {
        // Look for the source seed dev.db across potential bundled paths
        const candidatePaths = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
          path.resolve("./prisma/dev.db"),
          path.resolve("./dev.db"),
          path.join(__dirname, "..", "..", "prisma", "dev.db"),
          path.join(__dirname, "..", "prisma", "dev.db"),
          path.join(__dirname, "prisma", "dev.db"),
        ];

        let copied = false;
        for (const candidate of candidatePaths) {
          if (fs.existsSync(candidate)) {
            try {
              fs.copyFileSync(candidate, tmpDbPath);
              console.log(`[Prisma] Copied SQLite database to writable location: ${tmpDbPath} from ${candidate}`);
              copied = true;
              break;
            } catch (copyErr) {
              console.warn(`[Prisma] Failed to copy from ${candidate} to ${tmpDbPath}:`, copyErr);
            }
          }
        }

        if (!copied) {
          console.warn("[Prisma] Could not find seed dev.db to copy to /tmp/dev.db. Checked paths:", candidatePaths);
        }
      }

      const sqliteUrl = `file:${tmpDbPath}`;
      // Also sync process.env.DATABASE_URL so Prisma internals read the writable path
      process.env.DATABASE_URL = sqliteUrl;
      return sqliteUrl;
    } catch (err) {
      console.error("[Prisma] Vercel SQLite database copy error:", err);
    }
  }

  return envUrl || "file:./dev.db";
}

const resolvedUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedUrl ? { db: { url: resolvedUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
