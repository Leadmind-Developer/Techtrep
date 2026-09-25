import { prisma } from "@/lib/prisma";
import type { Prisma } from "../generated/prisma/client";
import { logger } from "@/lib/logger";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "SESSION_EXPIRED"
  | "DISABLED_ACCOUNT"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DISABLED"
  | "USER_ENABLED"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET";

type AuditLogInput = {
  action: AuditAction;
  userId?: string | null;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

export async function createAuditLog({
  action,
  userId = null,
  requestId = null,
  ipAddress = null,
  userAgent = null,
  metadata = null,
}: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId,
        requestId,
        ipAddress,
        userAgent,
        metadata: metadata ?? undefined,
      },
    });
  } catch (error) {
    logger.error("Failed to create audit log", {
      action,
      userId,
      requestId,
      error:
        error instanceof Error
        ? error.message
        : "Unknown error",
        });
      }   
     }
