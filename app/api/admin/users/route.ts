import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { requireApiRole } from "@/lib/auth/api";
import { createAuditLog } from "@/lib/audit-log";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import type { UserRole } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function isValidRole(value: unknown): value is "ADMIN" | "STAFF" {
  return value === "ADMIN" || value === "STAFF";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);

  const auth = await requireApiRole("ADMIN");

  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const roleParam = searchParams.get("role");
    const activeParam = searchParams.get("active");
    const pageParam = Number(searchParams.get("page") ?? "1");

    const role: UserRole | undefined =
      roleParam === "ADMIN" || roleParam === "STAFF"
        ? roleParam
        : undefined;

    const active =
      activeParam === "true"
        ? true
        : activeParam === "false"
          ? false
          : undefined;

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const where = {
      ...(role ? { role } : {}),
      ...(typeof active === "boolean" ? { active } : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        pageSize: PAGE_SIZE,
      },
      requestId,
    });
  } catch (error) {
    logger.error("Failed to list admin users", {
      requestId,
      adminUserId: auth.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load users.",
        requestId,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);

  const auth = await requireApiRole("ADMIN");

  if (auth.response) {
    return auth.response;
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
          requestId,
        },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const name =
      typeof data.name === "string"
        ? data.name.trim()
        : "";

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";

    const role = data.role;
    const temporaryPassword =
      typeof data.temporaryPassword === "string"
        ? data.temporaryPassword
        : "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (name.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must not exceed 120 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (email.length > 320 || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid role is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!temporaryPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Temporary password is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (temporaryPassword.length < 12) {
      return NextResponse.json(
        {
          success: false,
          message: "Temporary password must be at least 12 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (temporaryPassword.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message: "Temporary password must not exceed 128 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with that email address already exists.",
          requestId,
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(temporaryPassword);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        active: true,
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

    await createAuditLog({
      action: "USER_CREATED",
      userId: auth.user.id,
      requestId,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
      metadata: {
        targetUserId: user.id,
        targetEmail: user.email,
        role: user.role,
      },
    });

    logger.info("Admin user created", {
      requestId,
      adminUserId: auth.user.id,
      targetUserId: user.id,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        data: {
          user,
        },
        requestId,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create admin user", {
      requestId,
      adminUserId: auth.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create user.",
        requestId,
      },
      { status: 500 },
    );
  }
}