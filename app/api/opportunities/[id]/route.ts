import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

import type {
  OpportunityPriority,
  OpportunityStatus,
  Prisma,
} from "../../../../generated/prisma/client";

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

type OpportunityRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: OpportunityRouteProps,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Opportunity ID is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  try {
    const existing = await prisma.opportunity.findUnique({
      where: {
        id,
      },
      include: {
        auditRequest: {
          select: {
            id: true,
            organizationId: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Opportunity not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const body = await request.json();

    const data: {
      name?: string;
      description?: string | null;
      priority?: OpportunityPriority;
      status?: OpportunityStatus;
      estimatedValue?: number | null;
      closedAt?: Date | null;
    } = {};

    const changes: Record<
      string,
      {
        previous: Prisma.InputJsonValue | null;
        next: Prisma.InputJsonValue | null;
      }
    > = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Opportunity name must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const name = body.name.trim();

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

      data.name = name;

      if (name !== existing.name) {
        changes.name = {
          previous: existing.name,
          next: name,
        };
      }
    }

    if (body.description !== undefined) {
      if (
        body.description !== null &&
        typeof body.description !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Description must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const description =
        typeof body.description === "string"
          ? body.description.trim()
          : "";

      data.description = description || null;

      if (data.description !== existing.description) {
        changes.description = {
          previous: existing.description,
          next: data.description ?? null,
        };
      }
    }

    if (body.priority !== undefined) {
      if (!isValidPriority(body.priority)) {
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

      data.priority = body.priority;

      if (body.priority !== existing.priority) {
        changes.priority = {
          previous: existing.priority,
          next: body.priority,
        };
      }
    }

    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) {
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

      data.status = body.status;

      if (body.status !== existing.status) {
        changes.status = {
          previous: existing.status,
          next: body.status,
        };

        const isClosingStatus =
          body.status === "WON" || body.status === "LOST";

          const nextClosedAt = isClosingStatus
            ? new Date()
            : null;

        data.closedAt = nextClosedAt;   
        
          changes.closedAt = {
            previous:
              existing.closedAt !== null            
                ? existing.closedAt.toISOString()
                : null,
            next:
              nextClosedAt !== null
                ? nextClosedAt.toISOString()
                : null,
          };
        } 
      }    

    if (body.estimatedValue !== undefined) {
      const estimatedValue = parseEstimatedValue(
        body.estimatedValue,
      );

      if (
        body.estimatedValue !== null &&
        body.estimatedValue !== "" &&
        estimatedValue === null
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Estimated value must be a valid non-negative number.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      data.estimatedValue = estimatedValue;

      const previousValue =
        existing.estimatedValue === null
          ? null
          : Number(existing.estimatedValue);

      if (estimatedValue !== previousValue) {
        changes.estimatedValue = {
          previous: previousValue,
          next: estimatedValue,
        };
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No changes were provided.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const opportunity = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.opportunity.update({
          where: {
            id,
          },
          data,
        });

        await tx.activity.create({
          data: {
            organizationId:
              existing.auditRequest.organizationId,
            auditRequestId:
              existing.auditRequest.id,
            type:
              changes.status
                ? "STATUS_CHANGE"
                : "OTHER",
            createdByUserId: user.id,
            description: `Opportunity updated: ${updated.name}`,
            metadata: {
              opportunityId: updated.id,
              action: "OPPORTUNITY_UPDATED",
              changes,
              changedByUserId: user.id,
              requestId,
            },
          },
        });

        return updated;
      },
    );

    logger.info("Opportunity updated", {
      requestId,
      userId: user.id,
      opportunityId: opportunity.id,
      auditRequestId: existing.auditRequest.id,
      changes: Object.keys(changes),
    });

    return NextResponse.json(
      {
        success: true,
        opportunity,
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to update opportunity", {
      requestId,
      userId: user.id,
      opportunityId: id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update opportunity.",
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