
import "dotenv/config";
import { prisma } from "../lib/prisma";

const SOURCE_SERVICE_NUMBER = "MS-2026-0001";
const TEST_SERVICE_NUMBER = "MS-REPORT-TEST-2026-0001";
const TEST_SERVICE_NAME = "Service Reports Test Fixture";
const ORIGINAL_REPORT_NUMBER = "SRPT-2026-0001";

const REPORT_START = new Date("2026-09-01T00:00:00.000Z");
const REPORT_END = new Date("2026-10-01T00:00:00.000Z");

function requireConfirmation(): void {
  if (process.env.ALLOW_TEST_DATA_SEED !== "YES") {
    throw new Error(
      "Blocked: set ALLOW_TEST_DATA_SEED=YES to opt in.",
    );
  }

  if (
    process.env.CONFIRM_SOURCE_SERVICE_NUMBER !==
    SOURCE_SERVICE_NUMBER
  ) {
    throw new Error(
      "Blocked: confirm the exact source service number.",
    );
  }

  if (
    process.env.CONFIRM_TEST_FIXTURE_SERVICE_NUMBER !==
    TEST_SERVICE_NUMBER
  ) {
    throw new Error(
      "Blocked: confirm the exact test fixture service number.",
    );
  }
}

function utcDate(day: number, hour = 12): Date {
  return new Date(
    Date.UTC(2026, 8, day, hour, 0, 0, 0),
  );
}

async function main(): Promise<void> {
  requireConfirmation();

  // Refuse to proceed unless the original service and report
  // match the expected records. Nothing is changed here.
  const source = await prisma.managedService.findUnique({
    where: { serviceNumber: SOURCE_SERVICE_NUMBER },
    select: {
      id: true,
      serviceNumber: true,
      organizationId: true,
      projectId: true,
      contractId: true,
      serviceManagerId: true,
      currency: true,
    },
  });

  if (!source) {
    throw new Error(
      `Source service ${SOURCE_SERVICE_NUMBER} was not found.`,
    );
  }

  if (!source.contractId) {
    throw new Error(
      "Source service has no linked contract; refusing to seed.",
    );
  }

  const originalReport = await prisma.serviceReport.findUnique({
    where: { reportNumber: ORIGINAL_REPORT_NUMBER },
    select: {
      id: true,
      reportNumber: true,
      managedServiceId: true,
      reportingPeriodStart: true,
      reportingPeriodEnd: true,
      status: true,
    },
  });

    if (
    !originalReport ||
    originalReport.managedServiceId !== source.id ||
    originalReport.status !== "DRAFT"
  ) {
    throw new Error(
      "The original draft report is missing or does not match the expected service/status. No records were created.",
    );
  }

  console.log(
    "Preserving existing draft report:",
    originalReport.reportNumber,
    originalReport.reportingPeriodStart.toISOString(),
    originalReport.reportingPeriodEnd.toISOString(),
  );

  const existingFixture =
    await prisma.managedService.findUnique({
      where: { serviceNumber: TEST_SERVICE_NUMBER },
      select: { id: true },
    });

  if (existingFixture) {
    throw new Error(
      "Test fixture already exists. Refusing to duplicate it.",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Recheck critical conditions inside the transaction.
    const sourceCheck = await tx.managedService.findUnique({
      where: { id: source.id },
      select: {
        serviceNumber: true,
        organizationId: true,
        contractId: true,
      },
    });

    if (
      sourceCheck?.serviceNumber !== SOURCE_SERVICE_NUMBER ||
      sourceCheck.organizationId !== source.organizationId ||
      sourceCheck.contractId !== source.contractId
    ) {
      throw new Error(
        "Source service changed during validation.",
      );
    }

    const fixtureCheck =
      await tx.managedService.findUnique({
        where: { serviceNumber: TEST_SERVICE_NUMBER },
        select: { id: true },
      });

    if (fixtureCheck) {
      throw new Error(
        "Test fixture appeared during validation. Aborting.",
      );
    }

    // Serialize service-request numbering with the same lock
    // convention used by the service-request API.
    await tx.$executeRaw`
      SELECT pg_advisory_xact_lock(
        hashtext(${`techtrep:service-request-number:2026`})
      )
    `;

    const latestRequest = await tx.serviceRequest.findFirst({
      where: {
        requestNumber: { startsWith: "SR-2026-" },
      },
      orderBy: { requestNumber: "desc" },
      select: { requestNumber: true },
    });

    let nextRequestNumber = 1;

    if (latestRequest) {
      const suffix = latestRequest.requestNumber.split("-").at(-1);
      const parsed = Number(suffix);

      if (!suffix || !Number.isSafeInteger(parsed) || parsed < 1) {
        throw new Error(
          `Cannot safely determine the next request number from ${latestRequest.requestNumber}.`,
        );
      }

      nextRequestNumber = parsed + 1;
    }

    const fixture = await tx.managedService.create({
      data: {
        organizationId: source.organizationId,
        projectId: source.projectId,
        contractId: source.contractId,
        serviceManagerId: source.serviceManagerId,
        serviceNumber: TEST_SERVICE_NUMBER,
        name: TEST_SERVICE_NAME,
        description:
          "Synthetic test fixture for validating September 2026 service reports. Not a real customer service.",
        type: "MANAGED_IT",
        status: "ACTIVE",
        sla: "PRIORITY",
        currency: source.currency || "NGN",
        recurringFee: 100000,
        billingFrequency: "MONTHLY",
        billingEnabled: false,
        startDate: REPORT_START,
        endDate: new Date("2026-10-31T23:59:59.999Z"),
        notes:
          "TEST DATA ONLY. Created to validate service report calculations.",
      },
    });

    const requestFixtures = [
      {
        title: "[REPORT TEST] Resolved within SLA",
        description: "Synthetic report calculation test record.",
        status: "RESOLVED" as const,
        priority: "NORMAL" as const,
        openedAt: utcDate(3),
        firstResponseDueAt: utcDate(3, 14),
        resolutionDueAt: utcDate(5),
        resolvedAt: utcDate(4),
        resolution: "Synthetic test resolution.",
      },
      {
        title: "[REPORT TEST] Closed after SLA deadline",
        description: "Synthetic report calculation test record.",
        status: "CLOSED" as const,
        priority: "HIGH" as const,
        openedAt: utcDate(8),
        firstResponseDueAt: utcDate(8, 14),
        resolutionDueAt: utcDate(10),
        resolvedAt: utcDate(12),
        closedAt: utcDate(12),
        resolution: "Synthetic test resolution after deadline.",
      },
      {
        title: "[REPORT TEST] Open request past deadline",
        description: "Synthetic report calculation test record.",
        status: "OPEN" as const,
        priority: "LOW" as const,
        openedAt: utcDate(15),
        firstResponseDueAt: utcDate(15, 14),
        resolutionDueAt: utcDate(20),
      },
      {
        title: "[REPORT TEST] Open request with future deadline",
        description: "Synthetic report calculation test record.",
        status: "OPEN" as const,
        priority: "NORMAL" as const,
        openedAt: utcDate(24),
        firstResponseDueAt: utcDate(24, 14),
        resolutionDueAt: new Date(
          "2026-10-15T12:00:00.000Z",
        ),
      },
    ];

    const createdRequests: string[] = [];

    for (const item of requestFixtures) {
      const requestNumber =
        `SR-2026-${String(nextRequestNumber).padStart(4, "0")}`;

      nextRequestNumber += 1;

      const created = await tx.serviceRequest.create({
        data: {
          managedServiceId: fixture.id,
          organizationId: source.organizationId,
          requestNumber,
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority,
          openedAt: item.openedAt,
          firstResponseDueAt: item.firstResponseDueAt,
          resolutionDueAt: item.resolutionDueAt,
          resolvedAt: item.resolvedAt ?? null,
          closedAt: item.closedAt ?? null,
          resolution: item.resolution ?? null,
          notes: "TEST DATA ONLY — safe to remove with the fixture.",
        },
      });

      createdRequests.push(created.requestNumber);
    }

    const invoice = await tx.invoice.create({
      data: {
        contractId: source.contractId!,
        managedServiceId: fixture.id,
        invoiceNumber: "TEST-SRPT-2026-0001",
        title: "[REPORT TEST] September 2026 managed service",
        description:
          "Synthetic invoice for validating service report billing totals.",
        amount: 100000,
        currency: source.currency || "NGN",
        status: "PARTIALLY_PAID",
        issuedAt: utcDate(2),
        dueDate: utcDate(30),
        billingPeriodStart: REPORT_START,
        billingPeriodEnd: REPORT_END,
        notes: "TEST DATA ONLY.",
      },
    });

    const payment = await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        paymentNumber: "TEST-PAY-SRPT-2026-0001",
        amount: 30000,
        currency: source.currency || "NGN",
        method: "BANK_TRANSFER",
        status: "COMPLETED",
        paidAt: utcDate(15),
        reference: "TEST-SRPT-PAYMENT-2026-0001",
        notes: "Synthetic payment for report testing only.",
      },
    });

    return {
      fixtureId: fixture.id,
      serviceNumber: fixture.serviceNumber,
      requests: createdRequests,
      invoiceNumber: invoice.invoiceNumber,
      paymentNumber: payment.paymentNumber,
    };
  });

  console.log("\nTest fixture created successfully:");
  console.log(JSON.stringify(result, null, 2));
  console.log("\nExpected September report values:");
  console.log("- Requests: 4");
  console.log("- Resolved/closed: 2");
  console.log("- Open: 2");
  console.log("- HIGH priority: 1");
  console.log("- SLA evaluated: 3");
  console.log("- SLA met: 1");
  console.log("- SLA breached: 2");
  console.log("- SLA compliance: 33.33%");
  console.log("- Invoiced: NGN 100,000");
  console.log("- Paid: NGN 30,000");
  console.log("- Outstanding: NGN 70,000");
  console.log(
    "\nThe original service and report were not intentionally modified.",
  );
}

main()
  .catch((error: unknown) => {
    console.error("Test fixture seed failed.");
    console.error(
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
