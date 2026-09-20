import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit-log";
import { requireApiRole } from "@/lib/auth/api";
import { hashPassword } from "@/lib/auth/password";
import { destroyAllUserSessions } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/api/request";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);

  try {
    const auth = await requireApiRole("ADMIN");

    if (auth.response) {
      return auth.response;
    }

    const adminUser = auth.user;

    const { id: targetUserId } = await context.params;

    if (!targetUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (targetUserId === adminUser.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Use the Change My Password option to change your own password.",
          requestId,
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const temporaryPassword =
      typeof body.temporaryPassword === "string"
        ? body.temporaryPassword
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (!temporaryPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Temporary password and confirmation are required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (
      temporaryPassword.length < MIN_PASSWORD_LENGTH ||
      temporaryPassword.length > MAX_PASSWORD_LENGTH
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Temporary password must be between 12 and 128 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (temporaryPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Temporary passwords do not match.",
          requestId,
        },
        { status: 400 },
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
          requestId,
        },
        { status: 404 },
      );
    }

    if (!targetUser.active) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password cannot be reset for a disabled user.",
          requestId,
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(temporaryPassword);

    await prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        passwordHash,
      },
    });

    await destroyAllUserSessions(targetUser.id);

    await createAuditLog({
      action: "PASSWORD_RESET",
      userId: adminUser.id,
      requestId,
      metadata: {
        success: true,
        targetUserId: targetUser.id,
        targetEmail: targetUser.email,
      },
    });

    logger.info("Admin reset user password", {
      adminUserId: adminUser.id,
      targetUserId: targetUser.id,
      requestId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. The user must sign in again.",
      requestId,
    });
  } catch (error) {
    logger.error("Admin password reset failed", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reset user password.",
        requestId,
      },
      { status: 500 },
    );
  }
}