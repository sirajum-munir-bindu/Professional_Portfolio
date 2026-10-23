const { execSync } = require("child_process");

console.log("[db-sync] Checking database configuration for Vercel / Production deployment...");

if (process.env.DATABASE_URL) {
  console.log("[db-sync] DATABASE_URL detected. Synchronizing Prisma schema with database...");
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("[db-sync] Prisma database schema synchronized successfully!");
  } catch (err) {
    console.error("[db-sync] Warning: 'prisma db push' failed:", err.message);
    console.error("[db-sync] Continuing build. Database operations may fail if tables are not initialized.");
  }
} else {
  console.log("[db-sync] Notice: DATABASE_URL environment variable is not defined.");
  console.log("[db-sync] The application will build in resilient fallback mode.");
  console.log("[db-sync] To persist admin changes permanently on Vercel, attach a PostgreSQL database (e.g. Neon, Supabase, Vercel Postgres) and add DATABASE_URL in Vercel Environment Variables.");
}
