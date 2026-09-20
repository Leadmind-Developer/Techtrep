import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit-log";
import { getCurrentUser } from "@/lib/auth/authorization";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import {
  destroyAllUserSessions,
  destroyCurrentSession,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/api/request";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
          requestId,
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All password fields are required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (
      newPassword.length < MIN_PASSWORD_LENGTH ||
      newPassword.length > MAX_PASSWORD_LENGTH
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be between 12 and 128 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New passwords do not match.",
          requestId,
        },
        { status: 400 },
      );
    }

    const account = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        passwordHash: true,
        active: true,
      },
    });

    if (!account || !account.active) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is not available.",
          requestId,
        },
        { status: 401 },
      );
    }

    const currentPasswordValid = await verifyPassword(
      currentPassword,
      account.passwordHash,
    );

    if (!currentPasswordValid) {
      await createAuditLog({
        action: "PASSWORD_CHANGED",
        userId: user.id,
        requestId,
        metadata: {
          success: false,
          reason: "INVALID_CURRENT_PASSWORD",
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
          requestId,
        },
        { status: 400 },
      );
    }

    const samePassword = await verifyPassword(
      newPassword,
      account.passwordHash,
    );

    if (samePassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be different from your current password.",
          requestId,
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    });

    await destroyAllUserSessions(user.id);
    await destroyCurrentSession();

    await createAuditLog({
      action: "PASSWORD_CHANGED",
      userId: user.id,
      requestId,
      metadata: {
        success: true,
      },
    });

    logger.info("User password changed", {
      userId: user.id,
      requestId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Password changed successfully. Please sign in again.",
      requestId,
    });
  } catch (error) {
    logger.error("Password change failed", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to change password.",
        requestId,
      },
      { status: 500 },
    );
  }
}