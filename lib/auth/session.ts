import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

import { createAuditLog } from "@/lib/audit-log";
import { logger } from "@/lib/logger";

const SESSION_COOKIE_NAME = "business_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export async function createSession(userId: string): Promise<void> {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000,
  );

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    getSessionCookieOptions(),
  );
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await createAuditLog({
      action: "SESSION_EXPIRED",
      userId: session.user.id,
    });

    await prisma.session.delete({
        where: {
            id: session.id,
      },
    });

    cookieStore.delete(SESSION_COOKIE_NAME);

    logger.info("Session expired", {
        userId: session.user.id,
    });

    return null;
  }

  if (!session.user.active) {
    await createAuditLog({
        action: "DISABLED_ACCOUNT",
        userId: session.user.id,
    });

    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    cookieStore.delete(SESSION_COOKIE_NAME);

    logger.warn("Disabled account attempted to use an active session", {
        userId: session.user.id,
    });

    return null;
  }

  return session;
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);

    await prisma.session.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function destroyAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}