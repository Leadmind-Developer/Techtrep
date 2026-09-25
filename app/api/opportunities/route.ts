import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getRequestId } from "@/lib/api/request";

import type {
  OpportunityPriority,
  OpportunityStatus,
} from "@/../../generated/prisma/client";

const VALID_PRIORITIES: OpportunityPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const VALID_STATUSES: OpportunityStatus[] = [
  "IDENTIFIED",
  "DISCUSSED",
  "PROPOSED",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "DECLINED",
  "WON",
  "LOST",
];

function isValidPriority(
  value: unknown,
): value is OpportunityPriority {
  return (
    typeof value === "string" &&
    VALID_PRIORITIES.includes(value as OpportunityPriority)
  );
}

function isValidStatus(
  value: unknown,
): value is OpportunityStatus {
  return (
    typeof value === "string" &&
    VALID_STATUSES.includes(value as OpportunityStatus)
  );
}

function parseEstimatedValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "number" && typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
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

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const auditRequestId =
      typeof body.auditRequestId === "string"
        ? body.auditRequestId.trim()
        : "";

    const priority = body.priority ?? "MEDIUM";
    const status = body.status ?? "IDENTIFIED";
    const closedAt =
      status === "WON" || status === "LOST"
        ? new Date()
        : null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Opportunity name is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!auditRequestId) {
      return NextResponse.json(
        {
          success: false,
          message: "Audit request is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (name.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Opportunity name must be 200 characters or fewer.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!isValidPriority(priority)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid opportunity priority.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid opportunity status.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const estimatedValue = parseEstimatedValue(
      body.estimatedValue,
    );

    if (
      body.estimatedValue !== null &&
      body.estimatedValue !== undefined &&
      body.estimatedValue !== "" &&
      estimatedValue === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Estimated value must be a valid non-negative number.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const auditRequest =
      await prisma.auditRequest.findUnique({
        where: {
          id: auditRequestId,
        },
        select: {
          id: true,
          organizationId: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
      });

    if (!auditRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Audit request not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const opportunity = await prisma.$transaction(
      async (tx) => {
        const created = await tx.opportunity.create({
          data: {
            auditRequestId,
            createdByUserId: user.id,
            assignedToUserId: user.id,
            name,
            description: description || null,
            priority,
            status,
            estimatedValue,
            closedAt,
          },
        });
        
        await tx.opportunityAssignment.create({
          data: {
            opportunityId: created.id,
            assignedByUserId: user.id,
            assignedToUserId: user.id,
          },
        });

        await tx.activity.create({
          data: {
            organizationId:
              auditRequest.organizationId,
            auditRequestId,
            type: "OTHER",
            createdByUserId: user.id,
            description: `Opportunity created: ${created.name}`,
            metadata: {
              opportunityId: created.id,
              action: "OPPORTUNITY_CREATED",
              createdByUserId: user.id,
              requestId,
            },
          },
        });

        return created;
      },
    );

    logger.info("Opportunity created", {
      requestId,
      userId: user.id,
      opportunityId: opportunity.id,
      auditRequestId,
      organizationId: auditRequest.organizationId,
    });

    return NextResponse.json(
      {
        success: true,
        opportunity,
      },
      {
        status: 201,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to create opportunity", {
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
        message: "Unable to create opportunity.",
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