import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

import type {
  AuditStatus,
  Prisma,
} from "../../../../generated/prisma/client";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const AUDIT_STATUSES: AuditStatus[] = [
  "REQUESTED",
  "CONTACTED",
  "SCHEDULED",
  "COMPLETED",
  "REPORT_SENT",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

function isAuditStatus(value: unknown): value is AuditStatus {
  return (
    typeof value === "string" &&
    AUDIT_STATUSES.includes(value as AuditStatus)
  );
}

function parseDate(
  value: unknown,
  fieldName: string,
): { value: Date | null; error: string | null } {
  if (value === undefined) {
    return {
      value: null,
      error: null,
    };
  }

  if (value === null || value === "") {
    return {
      value: null,
      error: null,
    };
  }

  if (typeof value !== "string") {
    return {
      value: null,
      error: `${fieldName} must be a valid date.`,
    };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return {
      value: null,
      error: `${fieldName} must be a valid date.`,
    };
  }

  return {
    value: parsed,
    error: null,
  };
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;
  const { id } = await params;

  try {
    const body = (await request.json()) as {
      status?: unknown;
      scheduledAt?: unknown;
      completedAt?: unknown;
      reportSentAt?: unknown;
    };

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const existing = await prisma.auditRequest.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        organizationId: true,
      },
    });

    if (!existing) {
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

    let nextStatus: AuditStatus | undefined;

    if (body.status !== undefined) {
      if (!isAuditStatus(body.status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid audit request status.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      nextStatus = body.status;
    }

    const scheduled = parseDate(
      body.scheduledAt,
      "scheduledAt",
    );

    if (scheduled.error) {
      return NextResponse.json(
        {
          success: false,
          message: scheduled.error,
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const completed = parseDate(
      body.completedAt,
      "completedAt",
    );

    if (completed.error) {
      return NextResponse.json(
        {
          success: false,
          message: completed.error,
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const reportSent = parseDate(
      body.reportSentAt,
      "reportSentAt",
    );

    if (reportSent.error) {
      return NextResponse.json(
        {
          success: false,
          message: reportSent.error,
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const statusChanged =
      nextStatus !== undefined &&
      nextStatus !== existing.status;

    /*
     * Automatically populate operational timestamps when the
     * corresponding workflow status is reached.
     *
     * Existing timestamps are preserved when already present.
     */
    let scheduledAt = scheduled.value;
    let completedAt = completed.value;
    let reportSentAt = reportSent.value;

    const currentAudit = await prisma.auditRequest.findUnique({
      where: {
        id,
      },
      select: {
        scheduledAt: true,
        completedAt: true,
        reportSentAt: true,
      },
    });

    if (!currentAudit) {
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

    if (
      nextStatus === "SCHEDULED" &&
      scheduledAt === null &&
      !currentAudit.scheduledAt
    ) {
      scheduledAt = new Date();
    }

    if (
      nextStatus === "COMPLETED" &&
      completedAt === null &&
      !currentAudit.completedAt
    ) {
      completedAt = new Date();
    }

    if (
      nextStatus === "REPORT_SENT" &&
      reportSentAt === null &&
      !currentAudit.reportSentAt
    ) {
      reportSentAt = new Date();
    }

    /*
     * Do not allow a report to be marked sent before the audit
     * has been completed.
     */
    const resultingCompletedAt =
      completedAt ?? currentAudit.completedAt;

    if (
      (nextStatus === "REPORT_SENT" || reportSentAt !== null) &&
      !resultingCompletedAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The audit must have a completion date before the report can be marked as sent.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    /*
     * If the request is being moved to SCHEDULED without an
     * explicit scheduling date, the API has already supplied now.
     */
    const data: Prisma.AuditRequestUpdateInput = {};

    if (nextStatus !== undefined) {
      data.status = nextStatus;
    }

    if (body.scheduledAt !== undefined) {
      data.scheduledAt = scheduledAt;
    }

    if (body.completedAt !== undefined) {
      data.completedAt = completedAt;
    }

    if (body.reportSentAt !== undefined) {
      data.reportSentAt = reportSentAt;
    }

    /*
     * Automatically set workflow timestamps when transitioning
     * into their corresponding status.
     */
    if (
      nextStatus === "SCHEDULED" &&
      body.scheduledAt === undefined
    ) {
      data.scheduledAt = scheduledAt;
    }

    if (
      nextStatus === "COMPLETED" &&
      body.completedAt === undefined
    ) {
      data.completedAt = completedAt;
    }

    if (
      nextStatus === "REPORT_SENT" &&
      body.reportSentAt === undefined
    ) {
      data.reportSentAt = reportSentAt;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.auditRequest.update({
        where: {
          id,
        },
        data,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          contact: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (statusChanged) {
        await tx.activity.create({
          data: {
            organizationId: existing.organizationId,
            auditRequestId: existing.id,
            type: "STATUS_CHANGE",
            description: `Audit request status changed from ${existing.status} to ${nextStatus}.`,
            metadata: {
              previousStatus: existing.status,
              newStatus: nextStatus,
              changedByUserId: user.id,
              requestId,
            },
          },
        });
      }

      return updated;
    });

    logger.info("Audit request updated", {
      requestId,
      auditRequestId: id,
      userId: user.id,
      statusChanged,
      previousStatus: existing.status,
      newStatus: result.status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Audit request updated successfully.",
        auditRequest: {
          id: result.id,
          status: result.status,
          scheduledAt: result.scheduledAt,
          completedAt: result.completedAt,
          reportSentAt: result.reportSentAt,
          organization: result.organization,
          contact: result.contact,
        },
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to update audit request", {
      requestId,
      auditRequestId: id,
      userId: user.id,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update audit request.",
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