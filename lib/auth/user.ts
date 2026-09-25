import { prisma } from "@/lib/prisma";
import { verifyPassword } from "./password";
import { createSession } from "./session";

export type AuthenticatedUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STAFF";
};

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthenticatedUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user || !user.active) {
    return null;
  }

  const passwordValid = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!passwordValid) {
    return null;
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  await createSession(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}