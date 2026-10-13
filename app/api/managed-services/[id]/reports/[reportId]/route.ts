import { NextResponse } from "next/server";

import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string; reportId: string }>;
};

const narrativeFields = [
  "executiveSummary",
  "workPerformed",
  "incidentSummary",
  "recommendations",
  "nextSteps",
] as const;

type NarrativeField = (typeof narrativeFields)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function errorResponse(
  message: string,
  status: number,
  requestId: string,
) {
  return NextResponse.json(
    { success: false, message },
    { status, headers: { "x-request-id": requestId } },
  );
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const { id: managedServiceId, reportId } =
      await context.params;

    const report = await prisma.serviceReport.findFirst({
      where: { id: reportId, managedServiceId },
      include: {
        managedService: {
          select: {
            id: true,
            serviceNumber: true,
            name: true,
            currency: true,
          },
        },
        preparedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!report) {
      return errorResponse("Service report not found.", 404, requestId);
    }

    logger.info("Service report retrieved", {
      requestId,
      userId: user.id,
      reportId,
    });

    return NextResponse.json(
      { success: true, report },
      { headers: { "x-request-id": requestId } },
    );
  } catch (error) {
    logger.error("Service report retrieval failed", {
      requestId,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return errorResponse(
      "Unable to retrieve the service report.",
      500,
      requestId,
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const { id: managedServiceId, reportId } =
      await context.params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON request body.", 400, requestId);
    }

    if (!isRecord(body)) {
      return errorResponse("A JSON object is required.", 400, requestId);
    }

    const keys = Object.keys(body);

    if (
      keys.length === 0 ||
      keys.some(
        (key) =>
          !narrativeFields.includes(key as NarrativeField),
      )
    ) {
      return errorResponse(
        "Provide one or more valid narrative fields only.",
        400,
        requestId,
      );
    }

    const data: Partial<Record<NarrativeField, string | null>> = {};

    for (const key of keys as NarrativeField[]) {
      const value = body[key];

      if (
        value !== null &&
        (typeof value !== "string" || value.length > 20000)
      ) {
        return errorResponse(
          `${key} must be text of at most 20,000 characters or null.`,
          400,
          requestId,
        );
      }

      data[key] = value === null ? null : value.trim();
    }

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.serviceReport.findFirst({
        where: { id: reportId, managedServiceId },
        select: {
          id: true,
          organizationId: true,
          reportNumber: true,
          status: true,
          executiveSummary: true,
          workPerformed: true,
          incidentSummary: true,
          recommendations: true,
          nextSteps: true,
        },
      });

      if (!current) {
        return { kind: "NOT_FOUND" as const };
      }

      if (current.status !== "DRAFT") {
        return { kind: "FINALIZED" as const };
      }

      const changedFields = keys.filter(
        (key) =>
          current[key as NarrativeField] !==
          data[key as NarrativeField],
      );
            
if (changedFields.length === 0) {
  const report = await tx.serviceReport.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return { kind: "NOT_FOUND" };
  }

  return { kind: "UNCHANGED", report };
}

      // Compare-and-set prevents an edit from overwriting a concurrent
      // finalization or another update after the draft was read.
      const updatedCount = await tx.serviceReport.updateMany({
        where: { id: reportId, managedServiceId, status: "DRAFT" },
        data,
      });

      if (updatedCount.count !== 1) {
        return { kind: "FINALIZED" as const };
      }

      await tx.activity.create({
        data: {
          organizationId: current.organizationId,
          type: "STATUS_CHANGE",
          description:
            `Draft service report ${current.reportNumber} was edited.`,
          metadata: {
            action: "SERVICE_REPORT_DRAFT_UPDATED",
            reportId,
            reportNumber: current.reportNumber,
            changedFields,
          },
          createdByUserId: user.id,
        },
      });

      const report = await tx.serviceReport.findUnique({
        where: { id: reportId },
      });

      return { kind: "UPDATED" as const, report };
    });

    if (result.kind === "NOT_FOUND") {
      return errorResponse("Service report not found.", 404, requestId);
    }

    if (result.kind === "FINALIZED") {
      return errorResponse(
        "This report is finalized and cannot be edited.",
        409,
        requestId,
      );
    }

    logger.info("Service report draft saved", {
      requestId,
      userId: user.id,
      reportId,
      changed: result.kind === "UPDATED",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          result.kind === "UPDATED"
            ? "Service report draft saved successfully."
            : "No changes to save.",
        report: result.report,
      },
      { headers: { "x-request-id": requestId } },
    );
  } catch (error) {
    logger.error("Service report draft update failed", {
      requestId,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return errorResponse(
      "Unable to save the service report draft.",
      500,
      requestId,
    );
  }
}