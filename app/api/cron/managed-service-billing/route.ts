import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
const requestId = crypto.randomUUID();

const authorization = request.headers.get("authorization");
const cronSecret = process.env.CRON_SECRET;

if (!cronSecret) {
logger.error("Managed service billing cron secret is not configured", {
requestId,
});

return NextResponse.json(
  {
    success: false,
    message: "Cron service is not configured.",
  },
  {
    status: 500,
    headers: {
      "x-request-id": requestId,
    },
  },
);

}

if (authorization !== `Bearer ${cronSecret}`) {
logger.warn("Unauthorized managed service billing cron request", {
requestId,
});

return NextResponse.json(
  {
    success: false,
    message: "Unauthorized.",
  },
  {
    status: 401,
    headers: {
      "x-request-id": requestId,
    },
  },
);

}

const now = new Date();

try {
const dueServices = await prisma.managedService.findMany({
where: {
status: "ACTIVE",
billingEnabled: true,
recurringFee: {
gt: 0,
},
nextBillingDate: {
lte: now,
},
},

select: {
id: true,
serviceNumber: true,
name: true,
nextBillingDate: true,
endDate: true,
},
orderBy: {
nextBillingDate: "asc",
},
});

const eligibleServices = dueServices.filter(
  (service) =>
    !service.endDate ||
    (service.nextBillingDate !== null &&
      service.nextBillingDate <= service.endDate),
);

const skippedServices = dueServices.filter(
  (service) =>
    service.endDate !== null &&
    service.nextBillingDate !== null &&
    service.nextBillingDate > service.endDate,
);

const results: Array<{
  serviceId: string;
  serviceNumber: string;
  status: "BILLED" | "SKIPPED" | "FAILED";
  invoiceNumber?: string;
  message?: string;
}> = [];

for (const service of eligibleServices) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.APP_URL;

    if (!baseUrl) {
      throw new Error(
        "NEXT_PUBLIC_APP_URL or APP_URL is not configured.",
      );
    }

    const response = await fetch(
      `${baseUrl}/api/managed-services/${service.id}/billing`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cronSecret}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      results.push({
        serviceId: service.id,
        serviceNumber: service.serviceNumber,
        status: "FAILED",
        message:
          body?.message ??
          `Billing request failed with status ${response.status}.`,
      });

      continue;
    }

    results.push({
      serviceId: service.id,
      serviceNumber: service.serviceNumber,
      status: "BILLED",
      invoiceNumber: body?.invoice?.invoiceNumber,
    });
  } catch (error) {
    logger.error(
      "Managed service billing job failed for service",
      {
        requestId,
        serviceId: service.id,
        serviceNumber: service.serviceNumber,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
    );

    results.push({
      serviceId: service.id,
      serviceNumber: service.serviceNumber,
      status: "FAILED",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error.",
    });
  }
}

for (const service of skippedServices) {
  results.push({
    serviceId: service.id,
    serviceNumber: service.serviceNumber,
    status: "SKIPPED",
    message:
      "Billing date is after the managed service end date.",
  });
}

logger.info("Managed service billing cron completed", {
  requestId,
  dueServices: dueServices.length,
  billed: results.filter(
    (result) => result.status === "BILLED",
  ).length,
  skipped: results.filter(
    (result) => result.status === "SKIPPED",
  ).length,
  failed: results.filter(
    (result) => result.status === "FAILED",
  ).length,
});

return NextResponse.json(
  {
    success: true,
    requestId,
    processed: results.length,
    results,
  },
  {
    headers: {
      "x-request-id": requestId,
    },
  },
);

} catch (error) {
logger.error("Managed service billing cron failed", {
requestId,
error:
error instanceof Error
? error.message
: "Unknown error",
});

return NextResponse.json(
  {
    success: false,
    message: "Managed service billing job failed.",
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
