import { NextResponse } from "next/server";

import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);
  const { user, response } = await requireApiUser();

  if (response) return response;

  try {
    const { id: organizationId } = await context.params;

    if (!organizationId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid organization ID is required.",
        },
        {
          status: 400,
          headers: { "x-request-id": requestId },
        },
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found.",
        },
        {
          status: 404,
          headers: { "x-request-id": requestId },
        },
      );
    }

    const contacts = await prisma.contact.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        contacts,
      },
      {
        headers: {
          "x-request-id": requestId,
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    logger.error("Failed to list organization contacts", {
      requestId,
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load organization contacts.",
      },
      {
        status: 500,
        headers: { "x-request-id": requestId },
      },
    );
  }
}