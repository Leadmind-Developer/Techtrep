import { NextResponse } from "next/server";

import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string; reportId: string }>;
};

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

export async function POST(
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

    const result = await prisma.$transaction(async (tx) => {
      const report = await tx.serviceReport.findFirst({
        where: { id: reportId, managedServiceId },
        select: {
          id: true,
          organizationId: true,
          reportNumber: true,
          status: true,
          executiveSummary: true,
          workPerformed: true,
          incidentSummary: true,
          finalizedAt: true,
        },
      });

      if (!report) {
        return { kind: "NOT_FOUND" as const };
      }

      if (report.status === "FINALIZED") {
        return {
          kind: "ALREADY_FINALIZED" as const,
          finalizedAt: report.finalizedAt,
        };
      }

      if (
        !report.executiveSummary?.trim() ||
        !report.workPerformed?.trim() ||
        !report.incidentSummary?.trim()
      ) {
        return { kind: "INCOMPLETE" as const };
      }

      const finalizedAt = new Date();

      // Only one concurrent request can finalize a draft.
      const updatedCount = await tx.serviceReport.updateMany({
        where: {
          id: reportId,
          managedServiceId,
          status: "DRAFT",
        },
        data: {
          status: "FINALIZED",
          finalizedAt,
        },
      });

      if (updatedCount.count !== 1) {
        return { kind: "CONFLICT" as const };
      }

      await tx.activity.create({
        data: {
          organizationId: report.organizationId,
          type: "STATUS_CHANGE",
          description:
            `Service report ${report.reportNumber} was finalized.`,
          metadata: {
            action: "SERVICE_REPORT_FINALIZED",
            reportId,
            reportNumber: report.reportNumber,
            finalizedAt: finalizedAt.toISOString(),
            finalizedByUserId: user.id,
          },
          createdByUserId: user.id,
        },
      });

      const finalizedReport = await tx.serviceReport.findUnique({
        where: { id: reportId },
      });

      return {
        kind: "FINALIZED" as const,
        report: finalizedReport,
      };
    });

    if (result.kind === "NOT_FOUND") {
      return errorResponse("Service report not found.", 404, requestId);
    }

    if (result.kind === "INCOMPLETE") {
      return errorResponse(
        "Complete the executive summary, work performed, and incident summary before finalizing.",
        400,
        requestId,
      );
    }

    if (result.kind === "CONFLICT") {
      return errorResponse(
        "The report changed during finalization. Refresh and try again.",
        409,
        requestId,
      );
    }

    if (result.kind === "ALREADY_FINALIZED") {
      return NextResponse.json(
        {
          success: true,
          message: "This report has already been finalized.",
          finalizedAt: result.finalizedAt,
        },
        { headers: { "x-request-id": requestId } },
      );
    }

    logger.info("Service report finalized", {
      requestId,
      userId: user.id,
      reportId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service report finalized successfully.",
        report: result.report,
      },
      { headers: { "x-request-id": requestId } },
    );
  } catch (error) {
    logger.error("Service report finalization failed", {
      requestId,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return errorResponse(
      "Unable to finalize the service report.",
      500,
      requestId,
    );
  }
}