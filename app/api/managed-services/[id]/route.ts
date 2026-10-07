import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

const managedServiceTypes = [
"MANAGED_IT",
"CLOUD",
"SOFTWARE_SUPPORT",
"AI_SUPPORT",
"WEBSITE",
"NETWORK",
"INFRASTRUCTURE",
"CUSTOM",
] as const;

const managedServiceSlas = [
"BASIC",
"STANDARD",
"PRIORITY",
"PREMIUM",
] as const;

const billingFrequencies = [
"MONTHLY",
"QUARTERLY",
"ANNUALLY",
] as const;

const managedServiceStatuses = [
"DRAFT",
"ACTIVE",
"PAUSED",
"ENDED",
"CANCELLED",
] as const;

type ManagedServiceStatus =
(typeof managedServiceStatuses)[number];

const allowedStatusTransitions: Record<
ManagedServiceStatus,
ManagedServiceStatus[]

> = {
  DRAFT: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED", "ENDED", "CANCELLED"],
  PAUSED: ["ACTIVE", "ENDED", "CANCELLED"],
  ENDED: [],
  CANCELLED: [],
};

function isValidCurrency(value: string): boolean {
return /^[A-Z]{3}$/.test(value);
}

function isValidDate(value: unknown): value is string {
return (
typeof value === "string" &&
!Number.isNaN(Date.parse(value))
);
}

function isValidDecimal(value: unknown): value is string {
return (
typeof value === "string" &&
/^\d+(.\d{1,2})?$/.test(value) &&
Number(value) > 0
);
}

function isManagedServiceStatus(
value: string,
): value is ManagedServiceStatus {
return managedServiceStatuses.includes(
value as ManagedServiceStatus,
);
}

function isValidManagedServiceType(
value: string,
): boolean {
return managedServiceTypes.includes(
value as (typeof managedServiceTypes)[number],
);
}

function isValidManagedServiceSla(
value: string,
): boolean {
return managedServiceSlas.includes(
value as (typeof managedServiceSlas)[number],
);
}

function isValidBillingFrequency(
value: string,
): boolean {
return billingFrequencies.includes(
value as (typeof billingFrequencies)[number],
);
}

async function getManagedService(
id: string,
) {
return prisma.managedService.findUnique({
where: {
id,
},
include: {
organization: {
select: {
id: true,
name: true,
website: true,
industry: true,
},
},
project: {
select: {
id: true,
projectNumber: true,
name: true,
status: true,
},
},
contract: {
select: {
id: true,
contractNumber: true,
title: true,
status: true,
},
},
serviceManager: {
select: {
id: true,
name: true,
email: true,
},
},
},
});
}

export async function GET(
_request: Request,
context: {
params: Promise<{
id: string;
}>;
},
) {
const { response } = await requireApiUser();

if (response) {
return response;
}

try {
const { id } = await context.params;

if (!id) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Managed service ID is required.",
    },
    {
      status: 400,
    },
  );
}

const service = await getManagedService(id);

if (!service) {
  return NextResponse.json(
    {
      success: false,
      message:
        "The specified managed service was not found.",
    },
    {
      status: 404,
    },
  );
}

return NextResponse.json({
  success: true,
  service,
});

} catch (error) {
console.error(
"Failed to fetch managed service",
error,
);

return NextResponse.json(
  {
    success: false,
    message:
      "Unable to fetch managed service.",
  },
  {
    status: 500,
  },
);

}
}

export async function PATCH(
request: Request,
context: {
params: Promise<{
id: string;
}>;
},
) {
const { user, response } = await requireApiUser();

if (response) {
return response;
}

try {
const { id } = await context.params;

if (!id) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Managed service ID is required.",
    },
    {
      status: 400,
    },
  );
}

const existing =
  await prisma.managedService.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      organizationId: true,
      projectId: true,
      contractId: true,
      serviceNumber: true,
      name: true,
      description: true,
      type: true,
      status: true,
      sla: true,
      recurringFee: true,
      currency: true,
      billingFrequency: true,
      startDate: true,
      endDate: true,
      serviceManagerId: true,
      notes: true,
    },
  });

if (!existing) {
  return NextResponse.json(
    {
      success: false,
      message:
        "The specified managed service was not found.",
    },
    {
      status: 404,
    },
  );
}

const body = await request.json();

/*
 * Organization, project, contract and service number
 * establish the identity/origin of the managed service.
 * They are intentionally immutable after creation.
 */
if (
  body.organizationId !== undefined ||
  body.projectId !== undefined ||
  body.contractId !== undefined ||
  body.serviceNumber !== undefined
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Organization, project, contract and service number cannot be changed after creation.",
    },
    {
      status: 400,
    },
  );
}

const data: {
  name?: string;
  description?: string | null;
  type?:
    | "MANAGED_IT"
    | "CLOUD"
    | "SOFTWARE_SUPPORT"
    | "AI_SUPPORT"
    | "WEBSITE"
    | "NETWORK"
    | "INFRASTRUCTURE"
    | "CUSTOM";
  sla?:
    | "BASIC"
    | "STANDARD"
    | "PRIORITY"
    | "PREMIUM";
  recurringFee?: string | null;
  currency?: string;
  billingFrequency?:
    | "MONTHLY"
    | "QUARTERLY"
    | "ANNUALLY";
  startDate?: Date | null;
  endDate?: Date | null;
  serviceManagerId?: string | null;
  notes?: string | null;
  status?:
    | "DRAFT"
    | "ACTIVE"
    | "PAUSED"
    | "ENDED"
    | "CANCELLED";
} = {};

if (body.name !== undefined) {
  if (
    typeof body.name !== "string" ||
    !body.name.trim()
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Service name cannot be empty.",
      },
      {
        status: 400,
      },
    );
  }

  data.name = body.name.trim();
}

if (body.description !== undefined) {
  if (
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Description must be a string or null.",
      },
      {
        status: 400,
      },
    );
  }

  data.description =
    typeof body.description === "string"
      ? body.description.trim() || null
      : null;
}

if (body.type !== undefined) {
  if (
    typeof body.type !== "string" ||
    !isValidManagedServiceType(
      body.type.trim(),
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid managed service type.",
      },
      {
        status: 400,
      },
    );
  }

  data.type =
    body.type.trim() as
      | "MANAGED_IT"
      | "CLOUD"
      | "SOFTWARE_SUPPORT"
      | "AI_SUPPORT"
      | "WEBSITE"
      | "NETWORK"
      | "INFRASTRUCTURE"
      | "CUSTOM";
}

if (body.sla !== undefined) {
  if (
    typeof body.sla !== "string" ||
    !isValidManagedServiceSla(
      body.sla.trim(),
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid SLA level.",
      },
      {
        status: 400,
      },
    );
  }

  data.sla =
    body.sla.trim() as
      | "BASIC"
      | "STANDARD"
      | "PRIORITY"
      | "PREMIUM";
}

if (body.recurringFee !== undefined) {
  if (
    body.recurringFee === null ||
    body.recurringFee === ""
  ) {
    data.recurringFee = null;
  } else {
    const recurringFee =
      String(body.recurringFee).trim();

    if (!isValidDecimal(recurringFee)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Recurring fee must be a positive amount with up to 2 decimal places.",
        },
        {
          status: 400,
        },
      );
    }

    data.recurringFee = recurringFee;
  }
}

if (body.currency !== undefined) {
  if (
    typeof body.currency !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Currency must be a valid 3-letter currency code.",
      },
      {
        status: 400,
      },
    );
  }

  const currency =
    body.currency.trim().toUpperCase();

  if (!isValidCurrency(currency)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Currency must be a valid 3-letter currency code.",
      },
      {
        status: 400,
      },
    );
  }

  data.currency = currency;
}

if (
  body.billingFrequency !== undefined
) {
  if (
    typeof body.billingFrequency !==
      "string" ||
    !isValidBillingFrequency(
      body.billingFrequency.trim(),
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid billing frequency.",
      },
      {
        status: 400,
      },
    );
  }

  data.billingFrequency =
    body.billingFrequency.trim() as
      | "MONTHLY"
      | "QUARTERLY"
      | "ANNUALLY";
}

if (body.startDate !== undefined) {
  if (
    body.startDate === null ||
    body.startDate === ""
  ) {
    data.startDate = null;
  } else if (
    !isValidDate(body.startDate)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid start date.",
      },
      {
        status: 400,
      },
    );
  } else {
    data.startDate = new Date(
      body.startDate,
    );
  }
}

if (body.endDate !== undefined) {
  if (
    body.endDate === null ||
    body.endDate === ""
  ) {
    data.endDate = null;
  } else if (
    !isValidDate(body.endDate)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid end date.",
      },
      {
        status: 400,
      },
    );
  } else {
    data.endDate = new Date(
      body.endDate,
    );
  }
}

const effectiveStartDate =
  data.startDate !== undefined
    ? data.startDate
    : existing.startDate;

const effectiveEndDate =
  data.endDate !== undefined
    ? data.endDate
    : existing.endDate;

if (
  effectiveStartDate &&
  effectiveEndDate &&
  effectiveEndDate < effectiveStartDate
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "End date cannot be earlier than start date.",
    },
    {
      status: 400,
    },
  );
}

if (
  body.serviceManagerId !== undefined
) {
  if (
    body.serviceManagerId === null ||
    body.serviceManagerId === ""
  ) {
    data.serviceManagerId = null;
  } else if (
    typeof body.serviceManagerId !==
    "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid service manager.",
      },
      {
        status: 400,
      },
    );
  } else {
    const serviceManagerId =
      body.serviceManagerId.trim();

    const serviceManager =
      await prisma.user.findUnique({
        where: {
          id: serviceManagerId,
        },
        select: {
          id: true,
          active: true,
        },
      });

    if (!serviceManager) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified service manager was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!serviceManager.active) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified service manager is inactive.",
        },
        {
          status: 400,
        },
      );
    }

    data.serviceManagerId =
      serviceManagerId;
  }
}

if (body.notes !== undefined) {
  if (
    body.notes !== null &&
    typeof body.notes !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Notes must be a string or null.",
      },
      {
        status: 400,
      },
    );
  }

  data.notes =
    typeof body.notes === "string"
      ? body.notes.trim() || null
      : null;
}

let statusChanged = false;
let newStatus: ManagedServiceStatus =
  existing.status as ManagedServiceStatus;

if (body.status !== undefined) {
  if (
    typeof body.status !== "string" ||
    !isManagedServiceStatus(
      body.status.trim(),
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid managed service status.",
      },
      {
        status: 400,
      },
    );
  }

  newStatus =
    body.status.trim() as ManagedServiceStatus;

  if (newStatus !== existing.status) {
    const allowed =
      allowedStatusTransitions[
        existing.status as ManagedServiceStatus
      ];

    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Managed service status cannot change from ${existing.status} to ${newStatus}.`,
        },
        {
          status: 400,
        },
      );
    }

    statusChanged = true;
    data.status = newStatus;
  }
}

if (
  Object.keys(data).length === 0
) {
  const service =
    await getManagedService(id);

  return NextResponse.json({
    success: true,
    service,
  });
}

const service =
  await prisma.$transaction(
    async (tx) => {
      const updated =
        await tx.managedService.update({
          where: {
            id,
          },
          data,
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                website: true,
                industry: true,
              },
            },
            project: {
              select: {
                id: true,
                projectNumber: true,
                name: true,
                status: true,
              },
            },
            contract: {
              select: {
                id: true,
                contractNumber: true,
                title: true,
                status: true,
              },
            },
            serviceManager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

      const changedFields =
        Object.keys(data).filter(
          (field) => field !== "status",
        );

      if (
        changedFields.length > 0
      ) {
        await tx.activity.create({
          data: {
            organizationId:
              existing.organizationId,
            type: "NOTE",
            description:
              `Managed service ${existing.serviceNumber} updated.`,
            metadata: {
              action:
                "MANAGED_SERVICE_UPDATED",
              managedServiceId: existing.id,
              serviceNumber:
                existing.serviceNumber,
              changedFields,
            },
            createdByUserId: user.id,
          },
        });
      }

      if (statusChanged) {
        await tx.activity.create({
          data: {
            organizationId:
              existing.organizationId,
            type: "STATUS_CHANGE",
            description:
              `Managed service ${existing.serviceNumber} status changed from ${existing.status} to ${newStatus}.`,
            metadata: {
              action:
                "MANAGED_SERVICE_STATUS_CHANGED",
              managedServiceId: existing.id,
              serviceNumber:
                existing.serviceNumber,
              previousStatus:
                existing.status,
              newStatus,
            },
            createdByUserId: user.id,
          },
        });
      }

      return updated;
    },
  );

return NextResponse.json({
  success: true,
  service,
});

} catch (error) {
console.error(
"Failed to update managed service",
error,
);

return NextResponse.json(
  {
    success: false,
    message:
      "Unable to update managed service.",
  },
  {
    status: 500,
  },
);

}
}
