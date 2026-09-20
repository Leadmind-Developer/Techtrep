import { NextResponse } from "next/server";

import type { ActivityType } from "@/./generated/prisma/client";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const ACTIVITY_TYPES: ActivityType[] = [
  "NOTE",
  "EMAIL",
  "PHONE_CALL",
  "WHATSAPP",
  "MEETING",
  "AUDIT",
  "PROPOSAL",
  "FOLLOW_UP",
  "STATUS_CHANGE",
  "OTHER",
];

function isActivityType(value: unknown): value is ActivityType {
  return (
    typeof value === "string" &&
    ACTIVITY_TYPES.includes(value as ActivityType)
  );
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

type LeadActivityRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: LeadActivityRouteProps,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;
  const { id: leadId } = await params;

  try {
    const body = await request.json();

    const type = body.type;
    const description = getStringValue(body.description);

    if (!isActivityType(type)) {
      return NextResponse.json(
        {
          error: "A valid activity type is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error: "Activity description is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (description.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Activity description cannot exceed 5,000 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        {
          error: "Lead not found.",
          requestId,
        },
        { status: 404 },
      );
    }

    const activity = await prisma.activity.create({
      data: {
        organizationId: lead.organizationId,
        leadId: lead.id,
        type,
        description,
        metadata: {
          createdByUserId: user.id,
          requestId,
        },
      },
    });

    logger.info("Lead activity created", {
      requestId,
      userId: user.id,
      leadId: lead.id,
      activityId: activity.id,
      activityType: type,
    });

    return NextResponse.json(
      {
        activity,
        requestId,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create lead activity", {
      requestId,
      userId: user.id,
      leadId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        error: "Unable to create activity.",
        requestId,
      },
      { status: 500 },
    );
  }
}