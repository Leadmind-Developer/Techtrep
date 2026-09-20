import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

import type {
  ActivityType,
} from "../../../generated/prisma/client";

type ActivityMetadataValue =
    | string
    | number
    | boolean
    | null
    | ActivityMetadataValue[]
    | { 
        [key: string]: ActivityMetadataValue 
    };

    type ActivityMetadata = {
        [key: string]: ActivityMetadataValue;
    };

const VALID_ACTIVITY_TYPES: ActivityType[] = [
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

function isValidActivityType(
  value: unknown,
): value is ActivityType {
  return (
    typeof value === "string" &&
    VALID_ACTIVITY_TYPES.includes(
      value as ActivityType,
    )
  );
}

function isJsonValue(
  value: unknown,
): value is ActivityMetadataValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (typeof value === "object") {
    return Object.values(
      value as Record<string, unknown>,
    ).every(isJsonValue);
  }

  return false;
}

function isActivityMetadata(
  value: unknown,
): value is ActivityMetadata {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    isJsonValue(value)
  );
}

function parseOptionalId(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;

  try {
    const body = await request.json();

    const organizationId =
      typeof body.organizationId === "string"
        ? body.organizationId.trim()
        : "";

    const leadId = parseOptionalId(body.leadId);
    const auditRequestId =
      parseOptionalId(body.auditRequestId);

    const type = body.type;
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidActivityType(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid activity type.",
        },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required.",
        },
        { status: 400 },
      );
    }

    if (description.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Description must not exceed 5000 characters.",
        },
        { status: 400 },
      );
    }

    if (leadId === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lead ID.",
        },
        { status: 400 },
      );
    }

    if (auditRequestId === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid audit request ID.",
        },
        { status: 400 },
      );
    }

    
    let metadata: ActivityMetadata | null = null;
      
    if (body.metadata !== undefined) {
      if (!isActivityMetadata(body.metadata)) {
        return NextResponse.json(
          {
            success: false,
            message: "Metadata must be a JSON object.",
          },
          { status: 400 },
        );
      }

      metadata = body.metadata;
    }

    const [organization, lead, auditRequest] =
      await Promise.all([
        prisma.organization.findUnique({
          where: {
            id: organizationId,
          },
          select: {
            id: true,
            name: true,
          },
        }),

        leadId
          ? prisma.lead.findUnique({
              where: {
                id: leadId,
              },
              select: {
                id: true,
                organizationId: true,
              },
            })
          : null,

        auditRequestId
          ? prisma.auditRequest.findUnique({
              where: {
                id: auditRequestId,
              },
              select: {
                id: true,
                organizationId: true,
              },
            })
          : null,
      ]);

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found.",
        },
        { status: 404 },
      );
    }

    if (leadId && !lead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found.",
        },
        { status: 404 },
      );
    }

    if (
      lead &&
      lead.organizationId !== organization.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected lead does not belong to the selected organization.",
        },
        { status: 400 },
      );
    }

    if (auditRequestId && !auditRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Audit request not found.",
        },
        { status: 404 },
      );
    }

    if (
      auditRequest &&
      auditRequest.organizationId !== organization.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected audit request does not belong to the selected organization.",
        },
        { status: 400 },
      );
    }

    const activity = await prisma.activity.create({
      data: {
        organizationId: organization.id,
        leadId,
        auditRequestId,
        type,
        description,
        metadata: metadata ?? undefined,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info("Activity created", {
      requestId,
      userId: user.id,
      activityId: activity.id,
      organizationId: activity.organizationId,
      leadId: activity.leadId,
      auditRequestId: activity.auditRequestId,
      type: activity.type,
    });

    return NextResponse.json(
      {
        success: true,
        activity,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create activity", {
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
        message: "Unable to create activity.",
      },
      { status: 500 },
    );
  }
}
