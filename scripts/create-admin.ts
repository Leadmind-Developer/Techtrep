import "dotenv/config";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input,
      output,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function askPassword(): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;

    output.write("Admin password: ");

    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let password = "";

    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          stdin.setRawMode?.(false);
          stdin.pause();
          output.write("\n");
          process.exit(130);
        }

        if (char === "\r" || char === "\n") {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.off("data", onData);
          output.write("\n");
          resolve(password);
          return;
        }

        if (char === "\u007f") {
          if (password.length > 0) {
            password = password.slice(0, -1);
          }
          continue;
        }

        password += char;
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  console.log("\nCreate initial ADMIN account\n");

  const name = await askQuestion("Admin name: ");
  const email = (await askQuestion("Admin email: ")).toLowerCase();
  const password = await askPassword();

  if (!name) {
    throw new Error("Admin name is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email address is required.");
  }

  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters long.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      active: true,
    },
  });

  if (existingUser) {
    throw new Error(
      `A user with ${email} already exists. No changes were made.`,
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
      active: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  console.log("\nADMIN account created successfully.");
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Active: ${user.active}`);
  console.log(`Created: ${user.createdAt.toISOString()}`);
}

main()
  .catch((error) => {
    console.error(
      "\nFailed to create ADMIN account:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
