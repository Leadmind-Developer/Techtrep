import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import ServiceReportPdf from "@/lib/service-report-pdf";
import { sendServiceReportEmail } from "@/lib/email";
import { createServiceReportToken } from "@/lib/service-report-token";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string; reportId: string }>;
};

type SendReportBody = {
  contactId: string;
};

function errorResponse(
  message: string,
  status: number,
  requestId: string,
) {
  return NextResponse.json(
    { success: false, message },
    {
      status,
      headers: { "x-request-id": requestId },
    },
  );
}

function isSendReportBody(value: unknown): value is SendReportBody {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const contactId = (value as Record<string, unknown>).contactId;

  return (
    typeof contactId === "string" &&
    contactId.trim().length > 0
  );
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);
  const { user, response } = await requireApiUser();

  if (response) return response;

  try {
    const { id: managedServiceId, reportId } =
      await context.params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "A valid JSON request body is required.",
        400,
        requestId,
      );
    }

    if (!isSendReportBody(body)) {
      return errorResponse(
        "A valid contactId is required.",
        400,
        requestId,
      );
    }

    const contactId = body.contactId.trim();

    const report = await prisma.serviceReport.findFirst({
      where: {
        id: reportId,
        managedServiceId,
        status: "FINALIZED",
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        managedService: {
          select: {
            serviceNumber: true,
            name: true,
          },
        },
        preparedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!report) {
      return errorResponse(
        "Finalized service report not found.",
        404,
        requestId,
      );
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        organizationId: report.organizationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!contact) {
      return errorResponse(
        "The selected contact does not belong to this report's organization.",
        400,
        requestId,
      );
    }

    const configuredBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;

    if (!configuredBaseUrl) {
      logger.error("Service report email URL is not configured", {
        requestId,
        reportId,
      });

      return errorResponse(
        "Report delivery is not configured.",
        500,
        requestId,
      );
    }

    let baseUrl: URL;

    try {
      baseUrl = new URL(configuredBaseUrl);

      if (
        !["http:", "https:"].includes(baseUrl.protocol) ||
        baseUrl.username ||
        baseUrl.password
      ) {
        throw new Error("Unsupported application URL");
      }
    } catch {
      logger.error("Invalid service report application URL", {
        requestId,
        reportId,
      });

      return errorResponse(
        "The configured application URL is invalid.",
        500,
        requestId,
      );
    }

    const { token, tokenHash, expiresAt } =
      createServiceReportToken();

    const reportUrl = new URL(
      `/service-reports/${token}`,
      baseUrl,
    ).toString();

    const pdfBuffer = await renderToBuffer(
      <ServiceReportPdf
        reportNumber={report.reportNumber}
        reportDate={report.reportDate}
        reportingPeriodStart={report.reportingPeriodStart}
        reportingPeriodEnd={report.reportingPeriodEnd}
        organizationName={report.organization.name}
        serviceNumber={report.managedService.serviceNumber}
        serviceName={report.managedService.name}
        preparedByName={report.preparedBy?.name ?? null}
        executiveSummary={report.executiveSummary}
        workPerformed={report.workPerformed}
        incidentSummary={report.incidentSummary}
        recommendations={report.recommendations}
        nextSteps={report.nextSteps}
        totalRequests={report.totalRequests}
        resolvedRequests={report.resolvedRequests}
        openRequests={report.openRequests}
        urgentRequests={report.urgentRequests}
        slaEligibleRequests={report.slaEligibleRequests}
        slaMetRequests={report.slaMetRequests}
        slaBreachedRequests={report.slaBreachedRequests}
        slaComplianceRate={
          report.slaComplianceRate?.toString() ?? null
        }
        billingCurrency={report.billingCurrency}
        totalInvoiced={report.totalInvoiced.toString()}
        totalPaid={report.totalPaid.toString()}
        totalOutstanding={report.totalOutstanding.toString()}
        finalizedAt={report.finalizedAt}
      />,
    );

    /*
     * Persist the token before sending so a customer cannot receive
     * a link that has not yet been registered.
     *
     * The conditional update also detects concurrent token changes.
     */
    const previousTokenState = {
      publicTokenHash: report.publicTokenHash,
      publicTokenExpiresAt: report.publicTokenExpiresAt,
      publicTokenRevokedAt: report.publicTokenRevokedAt,
    };

    const tokenUpdate = await prisma.serviceReport.updateMany({
      where: {
        id: report.id,
        managedServiceId,
        status: "FINALIZED",
        publicTokenHash: previousTokenState.publicTokenHash,
        publicTokenExpiresAt:
          previousTokenState.publicTokenExpiresAt,
        publicTokenRevokedAt:
          previousTokenState.publicTokenRevokedAt,
      },
      data: {
        publicTokenHash: tokenHash,
        publicTokenExpiresAt: expiresAt,
        publicTokenRevokedAt: null,
      },
    });

    if (tokenUpdate.count !== 1) {
      return errorResponse(
        "The report changed while delivery was being prepared. Refresh and try again.",
        409,
        requestId,
      );
    }

    /*
     * Send the email outside a database transaction.
     * If SMTP fails, restore the prior token state only if our token
     * is still current; never overwrite a newer token.
     */
    try {
      await sendServiceReportEmail({
        recipientName: contact.name,
        recipientEmail: contact.email,
        organizationName: report.organization.name,
        serviceName: report.managedService.name,
        reportNumber: report.reportNumber,
        reportingPeriod:
          `${report.reportingPeriodStart.toISOString().slice(0, 10)} to ` +
          `${report.reportingPeriodEnd.toISOString().slice(0, 10)}`,
        reportUrl,
        pdfBuffer: Buffer.from(pdfBuffer),
      });
    } catch (emailError) {
      try {
        const restored = await prisma.serviceReport.updateMany({
          where: {
            id: report.id,
            managedServiceId,
            status: "FINALIZED",
            publicTokenHash: tokenHash,
          },
          data: previousTokenState,
        });

        if (restored.count !== 1) {
          logger.warn(
            "Service report token was not restored because its state changed",
            {
              requestId,
              reportId: report.id,
            },
          );
        }
      } catch (restoreError) {
        logger.error(
          "Failed to restore service report token after email failure",
          {
            requestId,
            reportId: report.id,
            error:
              restoreError instanceof Error
                ? restoreError.message
                : "Unknown error",
          },
        );
      }

      throw emailError;
    }

    /*
     * Email delivery has succeeded. Activity logging is deliberately
     * separate so a logging failure cannot make a delivered email
     * appear to have failed.
     */
    try {
      await prisma.activity.create({
        data: {
          organizationId: report.organizationId,
          type: "EMAIL",
          description:
            `Finalized service report ${report.reportNumber} was emailed to ${contact.email}.`,
          metadata: {
            action: "SERVICE_REPORT_SENT",
            reportId: report.id,
            reportNumber: report.reportNumber,
            contactId: contact.id,
            recipientEmail: contact.email,
            tokenExpiresAt: expiresAt.toISOString(),
          },
          createdByUserId: user.id,
        },
      });
    } catch (activityError) {
      logger.error(
        "Service report was emailed but activity logging failed",
        {
          requestId,
          userId: user.id,
          reportId: report.id,
          reportNumber: report.reportNumber,
          error:
            activityError instanceof Error
              ? activityError.message
              : "Unknown error",
        },
      );
    }

    logger.info("Service report emailed", {
      requestId,
      userId: user.id,
      reportId: report.id,
      reportNumber: report.reportNumber,
      contactId: contact.id,
      tokenExpiresAt: expiresAt.toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service report emailed successfully.",
        report: {
          id: report.id,
          reportNumber: report.reportNumber,
          recipientEmail: contact.email,
          tokenExpiresAt: expiresAt.toISOString(),
        },
      },
      {
        headers: { "x-request-id": requestId },
      },
    );
  } catch (error) {
    logger.error("Service report email failed", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return errorResponse(
      "Unable to email the service report. Check the delivery configuration and try again.",
      500,
      requestId,
    );
  }
}