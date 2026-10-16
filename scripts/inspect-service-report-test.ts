import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const source = await prisma.managedService.findUnique({
    where: { serviceNumber: "MS-2026-0001" },
    select: {
      id: true,
      serviceNumber: true,
      organizationId: true,
      contractId: true,
    },
  });

  const originalReport = await prisma.serviceReport.findUnique({
    where: { reportNumber: "SRPT-2026-0001" },
    select: {
      reportNumber: true,
      managedServiceId: true,
      reportingPeriodStart: true,
      reportingPeriodEnd: true,
      status: true,
    },
  });

  const fixture = await prisma.managedService.findUnique({
    where: { serviceNumber: "MS-REPORT-TEST-2026-0001" },
    select: {
      id: true,
      serviceNumber: true,
      name: true,
      organizationId: true,
      contractId: true,
      currency: true,
      serviceRequests: {
        orderBy: { requestNumber: "asc" },
        select: {
          requestNumber: true,
          title: true,
          status: true,
          priority: true,
          openedAt: true,
          firstResponseDueAt: true,
          resolutionDueAt: true,
          resolvedAt: true,
          closedAt: true,
        },
      },
      invoices: {
        where: { invoiceNumber: "TEST-SRPT-2026-0001" },
        select: {
          invoiceNumber: true,
          amount: true,
          currency: true,
          status: true,
          issuedAt: true,
          billingPeriodStart: true,
          billingPeriodEnd: true,
          payments: {
            where: {
              paymentNumber: "TEST-PAY-SRPT-2026-0001",
            },
            select: {
              paymentNumber: true,
              amount: true,
              currency: true,
              status: true,
              paidAt: true,
              reference: true,
            },
          },
        },
      },
    },
  });

  
  const fixtureReports = fixture
    ? await prisma.serviceReport.findMany({
        where: {
          managedServiceId: fixture.id,
        },
        orderBy: {
          reportingPeriodStart: "asc",
        },
        select: {
          reportNumber: true,
          managedServiceId: true,
          reportingPeriodStart: true,
          reportingPeriodEnd: true,
          status: true,
        },
      })
    : [];

  const septemberReports = fixture
    ? await prisma.serviceReport.findMany({
        where: {
          managedServiceId: fixture.id,
          reportingPeriodStart: new Date(
            "2026-09-01T00:00:00.000Z",
          ),
          reportingPeriodEnd: new Date(
            "2026-10-01T00:00:00.000Z",
          ),
        },
        select: {
          reportNumber: true,
          status: true,
          reportingPeriodStart: true,
          reportingPeriodEnd: true,
        },
      })
    : [];

  const output = {
    sourceService: source,
    originalReport,
    fixture: fixture
      ? {
          id: fixture.id,
          serviceNumber: fixture.serviceNumber,
          name: fixture.name,
          organizationId: fixture.organizationId,
          contractId: fixture.contractId,
          currency: fixture.currency,
          requests: fixture.serviceRequests,
          fixtureReports,
          septemberReportCount: septemberReports.length,
          septemberReports,
          invoices: fixture.invoices.map((invoice) => ({
            ...invoice,
            amount: invoice.amount.toString(),
            payments: invoice.payments.map((payment) => ({
              ...payment,
              amount: payment.amount.toString(),
            })),
          })),
        }
      : null,
  };

  console.log(JSON.stringify(output, null, 2));
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });