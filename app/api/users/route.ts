import { NextResponse } from "next/server";

import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const users = await prisma.user.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          email: "asc",
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        users,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to fetch active users", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch users.",
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