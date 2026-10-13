import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getReportingPeriod(period: string | null) {
  const now = new Date();

  // Default to the previous completed calendar month.
  const defaultStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
  );

  const value =
    period ??
    `${defaultStart.getUTCFullYear()}-${String(
      defaultStart.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new Error("Invalid reporting period. Use YYYY-MM.");
  }

  const [yearText, monthText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  return { period: value, start, end };
}

function toAmount(value: unknown): number {
  return Number(value ?? 0);
}

function roundAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const { id: managedServiceId } = await context.params;

    const managedService = await prisma.managedService.findUnique({
      where: { id: managedServiceId },
      select: { id: true },
    });

    if (!managedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Managed service not found.",
        },
        { status: 404 },
      );
    }

    const reports = await prisma.serviceReport.findMany({
      where: { managedServiceId },
      orderBy: [
        { reportingPeriodStart: "desc" },
        { reportDate: "desc" },
      ],
      select: {
        id: true,
        reportNumber: true,
        status: true,
        reportingPeriodStart: true,
        reportingPeriodEnd: true,
        reportDate: true,
        finalizedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Service report history failed", {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load service report history.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  const requestId =
    request.headers.get("x-request-id") ?? undefined;

  try {
    const { id: managedServiceId } = await context.params;
    const url = new URL(request.url);

    let period: string;
    let reportingPeriodStart: Date;
    let reportingPeriodEnd: Date;

    try {
      ({
        period,
        start: reportingPeriodStart,
        end: reportingPeriodEnd,
      } = getReportingPeriod(url.searchParams.get("period")));
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Invalid reporting period.",
        },
        { status: 400 },
      );
    }

    const managedService = await prisma.managedService.findUnique({
      where: { id: managedServiceId },
      select: {
        id: true,
        organizationId: true,
        serviceNumber: true,
        name: true,
        currency: true,
      },
    });

    if (!managedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Managed service not found.",
        },
        { status: 404 },
      );
    }

    const existingReport = await prisma.serviceReport.findUnique({
      where: {
        managedServiceId_reportingPeriodStart_reportingPeriodEnd: {
          managedServiceId,
          reportingPeriodStart,
          reportingPeriodEnd,
        },
      },
      select: {
        id: true,
        reportNumber: true,
        status: true,
      },
    });

    if (existingReport) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A report already exists for this service and reporting period.",
          report: existingReport,
        },
        { status: 409 },
      );
    }

    // The request metrics cover requests opened during this period.
    const requests = await prisma.serviceRequest.findMany({
      where: {
        managedServiceId,
        openedAt: {
          gte: reportingPeriodStart,
          lt: reportingPeriodEnd,
        },
      },
      select: {
        title: true,
        status: true,
        priority: true,
        resolution: true,
        resolutionDueAt: true,
        resolvedAt: true,
      },
      orderBy: { openedAt: "asc" },
    });

    const now = new Date();

    const resolvedRequests = requests.filter(
      (item) =>
        item.status === "RESOLVED" ||
        item.status === "CLOSED",
    );

    const openRequests = requests.filter(
      (item) =>
        item.status !== "RESOLVED" &&
        item.status !== "CLOSED",
    );

    const urgentRequests = requests.filter(
      (item) => item.priority === "HIGH",
    );

    /*
     * Resolution SLA metrics only:
     * - Resolved/closed requests are evaluated against resolvedAt.
     * - Open requests count as breached only after their deadline.
     * - Open requests whose deadlines have not passed are not yet
     *   included in the evaluated SLA denominator.
     *
     * The current schema does not record an actual first-response
     * timestamp, so first-response compliance is not calculated.
     */
    const evaluatedRequests = requests.filter((item) => {
      if (!item.resolutionDueAt) {
        return false;
      }

      const isTerminal =
        item.status === "RESOLVED" ||
        item.status === "CLOSED";

      return isTerminal || item.resolutionDueAt <= now;
    });

    const slaMetRequests = evaluatedRequests.filter((item) => {
      const isTerminal =
        item.status === "RESOLVED" ||
        item.status === "CLOSED";

      return (
        isTerminal &&
        item.resolvedAt !== null &&
        item.resolvedAt <= item.resolutionDueAt!
      );
    });

    const slaBreachedRequests = evaluatedRequests.filter((item) => {
      const isTerminal =
        item.status === "RESOLVED" ||
        item.status === "CLOSED";

      if (!isTerminal) {
        return true;
      }

      return (
        item.resolvedAt === null ||
        item.resolvedAt > item.resolutionDueAt!
      );
    });

    const slaComplianceRate =
      evaluatedRequests.length > 0
        ? roundAmount(
            (slaMetRequests.length / evaluatedRequests.length) * 100,
          )
        : null;

    // Include issued invoices for this service within the report period.
    const invoices = await prisma.invoice.findMany({
      where: {
        managedServiceId,
        issuedAt: {
          gte: reportingPeriodStart,
          lt: reportingPeriodEnd,
        },
        status: {
          notIn: ["DRAFT", "VOID"],
        },
      },
      select: {
        amount: true,
        payments: {
          where: { status: "COMPLETED" },
          select: { amount: true },
        },
      },
    });

    const totalInvoiced = roundAmount(
      invoices.reduce(
        (sum, invoice) => sum + toAmount(invoice.amount),
        0,
      ),
    );

    // Outstanding is the remaining balance on these period invoices
    // at report-generation time, using all completed payments to date.
    const totalOutstanding = roundAmount(
      invoices.reduce((sum, invoice) => {
        const paid = invoice.payments.reduce(
          (paymentSum, payment) =>
            paymentSum + toAmount(payment.amount),
          0,
        );

        return (
          sum +
          Math.max(toAmount(invoice.amount) - paid, 0)
        );
      }, 0),
    );

    // Cash received during the reporting period for this managed service.
    const paymentAggregate = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        paidAt: {
          gte: reportingPeriodStart,
          lt: reportingPeriodEnd,
        },
        invoice: {
          is: { managedServiceId },
        },
      },
      _sum: { amount: true },
    });

    const totalPaid = roundAmount(
      toAmount(paymentAggregate._sum.amount),
    );

    const executiveSummary =
      `${requests.length} ${
        requests.length === 1 ? "service request was" : "service requests were"
      } opened during ${period}. ` +
      `${resolvedRequests.length} ${
        resolvedRequests.length === 1 ? "request is" : "requests are"
      } resolved or closed, ` +
      `${openRequests.length} ${
        openRequests.length === 1 ? "request remains" : "requests remain"
      } open, and ` +
      `${urgentRequests.length} ${
        urgentRequests.length === 1
          ? "high-priority request was"
          : "high-priority requests were"
      } recorded. ` +
      `Resolution SLA compliance for evaluated requests was ` +
      `${
        slaComplianceRate === null
        ? "not available"
        : `${slaComplianceRate.toFixed(2)}%`
      }.`;

    const workPerformed =
      resolvedRequests.length > 0
        ? resolvedRequests
            .map((item) =>
              item.resolution
                ? `${item.title}: ${item.resolution}`
                : item.title,
            )
            .join("\n")
        : "No resolved or closed requests were recorded for this reporting cohort.";

    const incidentSummary =
      urgentRequests.length > 0
        ? urgentRequests.map((item) => item.title).join("\n")
        : "No urgent requests were recorded during this period.";

    const reportYear = now.getUTCFullYear();

    const report = await prisma.$transaction(async (tx) => {
      // Serialize report-number generation for the current year.
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(
          hashtext(${`techtrep:service-report-number:${reportYear}`})
        )
      `;

      // Check again inside the transaction to prevent duplicate periods.
      const duplicate = await tx.serviceReport.findUnique({
        where: {
          managedServiceId_reportingPeriodStart_reportingPeriodEnd: {
            managedServiceId,
            reportingPeriodStart,
            reportingPeriodEnd,
          },
        },
        select: { id: true, reportNumber: true },
      });

      if (duplicate) {
        return null;
      }

      const result = await tx.$queryRaw<
        Array<{ max_number: number | null }>
      >`
        SELECT MAX(
          CAST(
            SUBSTRING(
              "reportNumber"
              FROM ${`^SRPT-${reportYear}-([0-9]{4,})$`}
            ) AS INTEGER
          )
        ) AS max_number
        FROM "service_reports"
        WHERE "reportNumber" ~ ${`^SRPT-${reportYear}-[0-9]{4,}$`}
      `;

      const nextNumber =
        Number(result[0]?.max_number ?? 0) + 1;

      const reportNumber =
        `SRPT-${reportYear}-${String(nextNumber).padStart(4, "0")}`;

      return tx.serviceReport.create({
        data: {
          organizationId: managedService.organizationId,
          managedServiceId,
          preparedById: user.id,
          reportNumber,
          reportingPeriodStart,
          reportingPeriodEnd,
          status: "DRAFT",
          executiveSummary,
          workPerformed,
          incidentSummary,
          totalRequests: requests.length,
          resolvedRequests: resolvedRequests.length,
          openRequests: openRequests.length,
          urgentRequests: urgentRequests.length,
          slaEligibleRequests: evaluatedRequests.length,
          slaMetRequests: slaMetRequests.length,
          slaBreachedRequests: slaBreachedRequests.length,
          slaComplianceRate,
          billingCurrency: managedService.currency,
          totalInvoiced,
          totalPaid,
          totalOutstanding,
        },
        select: {
          id: true,
          reportNumber: true,
          status: true,
          reportingPeriodStart: true,
          reportingPeriodEnd: true,
          reportDate: true,
          executiveSummary: true,
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
          managedService: {
            select: {
              id: true,
              serviceNumber: true,
              name: true,
            },
          },
        },
      });
    });

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A report already exists for this service and reporting period.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service report draft generated successfully.",
        report,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Service report generation failed", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate the service report.",
      },
      { status: 500 },
    );
  }
}
