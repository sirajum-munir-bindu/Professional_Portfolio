import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.env.ADMIN_NAME || process.argv[4] || "Portfolio Architect";

  if (!email || !password) {
    console.error("Usage: tsx scripts/create-admin.ts <email> <password> [name]");
    console.error("Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`Creating or updating admin user for: ${email}`);

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.adminUser.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        passwordHash,
        name,
        role: "ADMIN",
      },
      create: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name,
        role: "ADMIN",
      },
    });

    console.log(`Admin user successfully initialized:`);
    console.log(`- ID: ${user.id}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
  } catch (error) {
    console.warn("Could not connect to database to persist admin (database might be offline or DATABASE_URL not set).");
    console.warn("However, environment-based credentials will function automatically in fallback mode.");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
