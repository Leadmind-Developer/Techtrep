import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit-log";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import {
  destroyCurrentSession,
  getCurrentSession,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const session = await getCurrentSession();

    if (session) {
      await createAuditLog({
        action: "LOGOUT",
        userId: session.user.id,
        requestId,
        userAgent: request.headers.get("user-agent"),
      });

      await destroyCurrentSession();

      logger.info("Logout successful", {
        requestId,
        userId: session.user.id,
      });
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Logout request failed", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your logout request.",
      },
      {
        status: 500,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }
}