import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import ServiceReportPdf from "@/lib/service-report-pdf";
import { hashServiceReportToken } from "@/lib/service-report-token";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ token: string }>;
};

function notFoundResponse(requestId: string) {
  return NextResponse.json(
    {
      success: false,
      message: "This report link is invalid, expired, or no longer available.",
    },
    {
      status: 404,
      headers: {
        "x-request-id": requestId,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    },
  );
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);

  try {
    const { token } = await context.params;

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return notFoundResponse(requestId);
    }

    const tokenHash = hashServiceReportToken(token);

    const report = await prisma.serviceReport.findFirst({
      where: {
        publicTokenHash: tokenHash,
        publicTokenExpiresAt: { gt: new Date() },
        publicTokenRevokedAt: null,
        status: "FINALIZED",
        finalizedAt: { not: null },
      },
      select: {
        reportNumber: true,
        reportDate: true,
        reportingPeriodStart: true,
        reportingPeriodEnd: true,
        finalizedAt: true,
        executiveSummary: true,
        workPerformed: true,
        incidentSummary: true,
        recommendations: true,
        nextSteps: true,
        totalRequests: true,
        resolvedRequests: true,
        openRequests: true,
        urgentRequests: true,
        slaEligibleRequests: true,
        slaMetRequests: true,
        slaBreachedRequests: true,
        slaComplianceRate: true,
        billingCurrency: true,
        totalInvoiced: true,
        totalPaid: true,
        totalOutstanding: true,
        organization: {
          select: { name: true },
        },
        managedService: {
          select: {
            serviceNumber: true,
            name: true,
          },
        },
        preparedBy: {
          select: { name: true },
        },
      },
    });

    if (!report) {
      return notFoundResponse(requestId);
    }

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

    logger.info("Customer service report PDF generated", {
      requestId,
      reportNumber: report.reportNumber,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="${report.reportNumber}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "x-request-id": requestId,
      },
    });
  } catch (error) {
    logger.error("Customer service report PDF generation failed", {
      requestId,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate this report PDF.",
      },
      {
        status: 500,
        headers: {
          "x-request-id": requestId,
          "Cache-Control": "private, no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      },
    );
  }
}
