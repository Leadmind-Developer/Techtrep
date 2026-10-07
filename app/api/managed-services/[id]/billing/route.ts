import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { calculateNextBillingDate } from "@/lib/managed-services/billing";

type RouteContext = {
params: Promise<{
id: string;
}>;
};

export async function POST(
request: Request,
context: RouteContext,
) {
const requestId = getRequestId(request);

/*

* Billing may be triggered either by an authenticated business user
* or by the scheduled billing job using CRON_SECRET.
  */
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

const isCronRequest =
Boolean(cronSecret) &&
authorization === `Bearer ${cronSecret}`;

let userId: string | null = null;

if (!isCronRequest) {
const auth = await requireApiUser();

if (auth.response) {
  return auth.response;
}

userId = auth.user.id;

}

try {
const { id } = await context.params;

if (!id) {
  return NextResponse.json(
    {
      success: false,
      message: "Managed service ID is required.",
    },
    {
      status: 400,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

const now = new Date();

const result = await prisma.$transaction(async (tx) => {
  const service = await tx.managedService.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      serviceNumber: true,
      name: true,
      status: true,
      billingEnabled: true,
      recurringFee: true,
      currency: true,
      billingFrequency: true,
      nextBillingDate: true,
      startDate: true,
      endDate: true,
      contractId: true,
      contract: {
        select: {
          id: true,
          contractNumber: true,
          status: true,
          currency: true,
          proposal: {
            select: {
              id: true,
              proposalNumber: true,
            },
          },
        },
      },
    },
  });

  if (!service) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message: "Managed service not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  if (!service.billingEnabled) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "Recurring billing is not enabled for this managed service.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  if (service.status !== "ACTIVE") {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "Recurring billing can only run for an active managed service.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  if (
    service.recurringFee === null ||
    Number(service.recurringFee) <= 0
  ) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "A positive recurring fee is required before billing can run.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  if (!service.nextBillingDate) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "A next billing date is required before billing can run.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  /*

* Do not generate a new recurring invoice when the billing
* period begins after the managed service has already ended.
*
* This check intentionally comes before the "not due yet" check.
* A service whose next billing date is already beyond its end date
* should be considered ineligible for future billing regardless
* of whether that date has arrived yet.
  */
  if (
    service.endDate !== null &&
    service.nextBillingDate > service.endDate
  ) {
    return {
        response: NextResponse.json(
            {
                success: false,
                message:
                    "This managed service has ended and is not eligible for further recurring billing.",
                endDate: service.endDate,
                nextBillingDate: service.nextBillingDate,
            },
            {
                status: 409,
                headers: {
                    "x-request-id": requestId,
                },
            }
        ),
    };
  }

  if (!service.contractId || !service.contract) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "An active contract is required before recurring billing can generate an invoice.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  if (service.contract.status !== "ACTIVE") {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "The managed service contract must be active before recurring billing can generate an invoice.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  const billingPeriodStart = service.nextBillingDate;

  /*
   * Serialize billing for this exact managed-service billing period.
   * This prevents two concurrent billing requests from creating
   * separate invoices for the same period.
   */
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtext(
        ${`techtrep:managed-service-billing:${service.id}:${billingPeriodStart.toISOString()}`}
      )
    )
  `;

  const existingInvoice =
    await tx.invoice.findFirst({
      where: {
        managedServiceId: service.id,
        billingPeriodStart,
      },
      select: {
        id: true,
        invoiceNumber: true,
      },
    });

  if (existingInvoice) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            "An invoice has already been generated for this billing period.",
          invoiceId: existingInvoice.id,
          invoiceNumber:
            existingInvoice.invoiceNumber,
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      ),
    };
  }

  const billingPeriodEnd =
    calculateNextBillingDate(
      billingPeriodStart,
      service.billingFrequency,
    );

  /*
   * Use the same invoice-number serialization already used
   * by the normal invoice creation endpoint.
   */
  const year = now.getFullYear();

  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtext(
        ${`techtrep:invoice-number:${year}`}
      )
    )
  `;

  const numberResult =
    await tx.$queryRaw<
      Array<{ max_number: number | null }>
    >`
      SELECT MAX(
        CAST(
          SUBSTRING(
            "invoiceNumber"
            FROM ${`^INV-${year}-([0-9]+)$`}
          ) AS INTEGER
        )
      ) AS max_number
      FROM "invoices"
      WHERE "invoiceNumber" ~ ${`^INV-${year}-[0-9]{4}$`}
    `;

  const nextNumber =
    Number(numberResult[0]?.max_number ?? 0) + 1;

  const invoiceNumber =
    `INV-${year}-${String(nextNumber).padStart(4, "0")}`;

  const invoice =
    await tx.invoice.create({
      data: {
        contractId: service.contract.id,
        managedServiceId: service.id,
        invoiceNumber,
        title:
          `Managed Service Billing - ${service.serviceNumber}`,
        description:
          `Recurring billing for ${service.name}.`,
        amount: service.recurringFee,
        currency: service.currency,
        status: "DRAFT",
        issuedAt: now,
        billingPeriodStart,
        billingPeriodEnd,
      },
    });

  const updatedService =
    await tx.managedService.update({
      where: {
        id: service.id,
      },
      data: {
        nextBillingDate: billingPeriodEnd,
      },
      select: {
        id: true,
        serviceNumber: true,
        nextBillingDate: true,
      },
    });

  return {
    invoice,
    updatedService,
  };
});

if ("response" in result) {
  return result.response;
}

logger.info(
  "Managed service recurring invoice generated",
  {
    requestId,
    userId,
    managedServiceId: result.updatedService.id,
    invoiceId: result.invoice.id,
    invoiceNumber: result.invoice.invoiceNumber,
    billingPeriodStart:
      result.invoice.billingPeriodStart,
    billingPeriodEnd:
      result.invoice.billingPeriodEnd,
    triggeredBy: isCronRequest
      ? "cron"
      : "user",
  },
);

return NextResponse.json(
  {
    success: true,
    invoice: result.invoice,
    managedService: result.updatedService,
  },
  {
    status: 201,
    headers: {
      "x-request-id": requestId,
    },
  },
);

} catch (error) {
const errorCode =
typeof error === "object" &&
error !== null &&
"code" in error &&
typeof error.code === "string"
? error.code
: null;

if (errorCode === "P2002") {
  logger.warn(
    "Duplicate managed service billing invoice prevented",
    {
      requestId,
      userId,
      triggeredBy: isCronRequest
        ? "cron"
        : "user",
    },
  );

  return NextResponse.json(
    {
      success: false,
      message:
        "An invoice already exists for this billing period.",
    },
    {
      status: 409,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

logger.error(
  "Failed to generate managed service recurring invoice",
  {
    requestId,
    userId,
    triggeredBy: isCronRequest
      ? "cron"
      : "user",
    error:
      error instanceof Error
        ? error.message
        : "Unknown error",
  },
);

return NextResponse.json(
  {
    success: false,
    message:
      "Unable to generate the recurring invoice.",
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
