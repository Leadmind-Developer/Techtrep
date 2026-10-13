import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import ServiceReportPdf from "@/lib/service-report-pdf";
import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string; reportId: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);
  const { response } = await requireApiUser();

  if (response) return response;

  try {
    const { id: managedServiceId, reportId } =
      await context.params;

    const report = await prisma.serviceReport.findFirst({
      where: {
        id: reportId,
        managedServiceId,
        status: "FINALIZED",
      },
      include: {
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
      return NextResponse.json(
        {
          success: false,
          message: "Finalized service report not found.",
        },
        {
          status: 404,
          headers: { "x-request-id": requestId },
        },
      );
    }

    const buffer = await renderToBuffer(
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
        slaComplianceRate={report.slaComplianceRate?.toString() ?? null}
        billingCurrency={report.billingCurrency}
        totalInvoiced={report.totalInvoiced.toString()}
        totalPaid={report.totalPaid.toString()}
        totalOutstanding={report.totalOutstanding.toString()}
        finalizedAt={report.finalizedAt}
      />,
    );

    const pdfData = new Uint8Array(buffer);

    logger.info("Service report PDF generated", {
      requestId,
      reportId,
      reportNumber: report.reportNumber,
    });

    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="${report.reportNumber}.pdf"`,
        "Content-Length": String(pdfData.byteLength),
        "Cache-Control": "private, no-store, max-age=0",
        "x-request-id": requestId,
      },
    });
  } catch (error) {
    logger.error("Service report PDF generation failed", {
      requestId,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate the service report PDF.",
      },
      {
        status: 500,
        headers: { "x-request-id": requestId },
      },
    );
  }
}