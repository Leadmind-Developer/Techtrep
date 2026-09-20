import { NextRequest, NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api";
import { createAuditLog } from "@/lib/audit-log";
import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/api/request";
import { prisma } from "@/lib/prisma";

import type { UserRole } from "@/generated/prisma/client";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const VALID_ROLES: UserRole[] = ["ADMIN", "STAFF"];

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  const auth = await requireApiRole("ADMIN");

  if (auth.response) {
    return auth.response;
  }

  const requestId = getRequestId(request);
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "User ID is required.",
      },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON body.",
      },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 },
    );
  }

  const input = body as Record<string, unknown>;

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  });

  if (!targetUser) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found.",
      },
      { status: 404 },
    );
  }

  const hasName = Object.prototype.hasOwnProperty.call(
    input,
    "name",
  );

  const hasEmail = Object.prototype.hasOwnProperty.call(
    input,
    "email",
  );

  const hasRole = Object.prototype.hasOwnProperty.call(
    input,
    "role",
  );

  const hasActive = Object.prototype.hasOwnProperty.call(
    input,
    "active",
  );

  if (!hasName && !hasEmail && !hasRole && !hasActive) {
    return NextResponse.json(
      {
        success: false,
        message: "No changes were provided.",
      },
      { status: 400 },
    );
  }

  const changes: Record<
    string,
    {
      previous: string | boolean | null;
      next: string | boolean | null;
    }
  > = {};

  let name: string | null | undefined;
  let email: string | undefined;
  let role: UserRole | undefined;
  let active: boolean | undefined;

  if (hasName) {
    if (
      input.name !== null &&
      typeof input.name !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be a string or null.",
        },
        { status: 400 },
      );
    }

    name =
      typeof input.name === "string"
        ? input.name.trim()
        : null;

    if (name !== null && name.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must not exceed 120 characters.",
        },
        { status: 400 },
      );
    }

    if (targetUser.name !== name) {
      changes.name = {
        previous: targetUser.name,
        next: name,
      };
    }
  }

  if (hasEmail) {
    if (typeof input.email !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Email must be a string.",
        },
        { status: 400 },
      );
    }

    email = input.email.trim().toLowerCase();

    if (!email || email.length > 320) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid email address is required.",
        },
        { status: 400 },
      );
    }

    if (email !== targetUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          {
            success: false,
            message: "That email address is already in use.",
          },
          { status: 409 },
        );
      }

      changes.email = {
        previous: targetUser.email,
        next: email,
      };
    }
  }

  if (hasRole) {
    if (
      typeof input.role !== "string" ||
      !VALID_ROLES.includes(input.role as UserRole)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user role.",
        },
        { status: 400 },
      );
    }

    role = input.role as UserRole;

    if (role !== targetUser.role) {
      changes.role = {
        previous: targetUser.role,
        next: role,
      };
    }
  }

  if (hasActive) {
    if (typeof input.active !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Active must be a boolean.",
        },
        { status: 400 },
      );
    }

    active = input.active;

    if (active !== targetUser.active) {
      changes.active = {
        previous: targetUser.active,
        next: active,
      };
    }
  }

  const isSelf = targetUser.id === auth.user.id;

  if (isSelf) {
    if (active === false) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot deactivate your own account.",
        },
        { status: 400 },
      );
    }

    if (role === "STAFF") {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot remove your own ADMIN role.",
        },
        { status: 400 },
      );
    }
  }

  if (Object.keys(changes).length === 0) {
    return NextResponse.json({
      success: true,
      message: "No changes were necessary.",
      data: {
        user: targetUser,
      },
      requestId,
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(hasName ? { name } : {}),
        ...(hasEmail ? { email } : {}),
        ...(hasRole ? { role } : {}),
        ...(hasActive ? { active } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const action =
      active === false
        ? "USER_DISABLED"
        : active === true
          ? "USER_ENABLED"
          : "USER_UPDATED";

    await createAuditLog({
      action,
      userId: auth.user.id,
      requestId,
      metadata: {
        targetUserId: targetUser.id,
        changes,
      },
    });

    logger.info("Admin user updated", {
      requestId,
      adminUserId: auth.user.id,
      targetUserId: targetUser.id,
      action,
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
      data: {
        user: updatedUser,
      },
      requestId,
    });
  } catch (error) {
    logger.error("Failed to update admin user", {
      requestId,
      adminUserId: auth.user.id,
      targetUserId: id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update user.",
        requestId,
      },
      { status: 500 },
    );
  }
}