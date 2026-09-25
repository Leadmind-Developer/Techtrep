import { NextRequest, NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { getAdminAuditLogs } from "@/lib/admin/audit-logs";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const VALID_ACTIONS = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "SESSION_EXPIRED",
  "DISABLED_ACCOUNT",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DISABLED",
  "USER_ENABLED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
] as const;

type AuditAction = (typeof VALID_ACTIONS)[number];

function isAuditAction(
  value: string | null,
): value is AuditAction {
  return (
    value !== null &&
    VALID_ACTIONS.includes(value as AuditAction)
  );
}

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);

  const auth = await requireApiRole("ADMIN");

  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() ?? "";

    const actionParam = searchParams.get("action");

    const action = isAuditAction(actionParam)
      ? actionParam
      : undefined;

    const pageParam = Number(
      searchParams.get("page") ?? "1",
    );

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const data = await getAdminAuditLogs({
      search,
      action,
      page,
    });

    return NextResponse.json({
      success: true,
      data,
      requestId,
    });
  } catch (error) {
    logger.error("Failed to load security audit logs", {
      requestId,
      adminUserId: auth.user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load security audit logs.",
        requestId,
      },
      { status: 500 },
    );
  }
}