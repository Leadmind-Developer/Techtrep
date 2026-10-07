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
    /^\d+(\.\d{1,2})?$/.test(value) &&
    Number(value) > 0
  );
}

export async function GET(request: Request) {
  const { response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "";

    const type =
      searchParams.get("type")?.trim() || "";

    const organizationId =
      searchParams.get("organizationId")?.trim() || "";

    const where = {
      ...(status
        ? {
            status: status as
              | "DRAFT"
              | "ACTIVE"
              | "PAUSED"
              | "ENDED"
              | "CANCELLED",
          }
        : {}),

      ...(type
        ? {
            type: type as
              | "MANAGED_IT"
              | "CLOUD"
              | "SOFTWARE_SUPPORT"
              | "AI_SUPPORT"
              | "WEBSITE"
              | "NETWORK"
              | "INFRASTRUCTURE"
              | "CUSTOM",
          }
        : {}),

      ...(organizationId
        ? {
            organizationId,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                serviceNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                organization: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const services =
      await prisma.managedService.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error(
      "Failed to fetch managed services",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch managed services.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const body = await request.json();

    const organizationId =
      typeof body.organizationId === "string"
        ? body.organizationId.trim()
        : "";

    const projectId =
      typeof body.projectId === "string"
        ? body.projectId.trim()
        : "";

    const contractId =
      typeof body.contractId === "string"
        ? body.contractId.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const type =
      typeof body.type === "string"
        ? body.type.trim()
        : "";

    const sla =
      typeof body.sla === "string"
        ? body.sla.trim()
        : "STANDARD";

    const recurringFee =
      body.recurringFee === undefined ||
      body.recurringFee === null ||
      body.recurringFee === ""
        ? null
        : String(body.recurringFee).trim();

    const currency =
      typeof body.currency === "string"
        ? body.currency.trim().toUpperCase()
        : "NGN";

    const billingFrequency =
      typeof body.billingFrequency === "string"
        ? body.billingFrequency.trim()
        : "MONTHLY";

    const billingEnabled =
       body.billingEnabled === true;

    const nextBillingDate =
      body.nextBillingDate === null ||
      body.nextBillingDate === undefined ||
      body.nextBillingDate === ""
        ? null
        : body.nextBillingDate;

    const startDate =
      body.startDate === null ||
      body.startDate === undefined ||
      body.startDate === ""
        ? null
        : body.startDate;

    const endDate =
      body.endDate === null ||
      body.endDate === undefined ||
      body.endDate === ""
        ? null
        : body.endDate;

    const serviceManagerId =
      typeof body.serviceManagerId === "string"
        ? body.serviceManagerId.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : null;

    if (!organizationId || !name || !type) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization, name and service type are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !managedServiceTypes.includes(
        type as (typeof managedServiceTypes)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid managed service type.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !managedServiceSlas.includes(
        sla as (typeof managedServiceSlas)[number],
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

    if (
      !billingFrequencies.includes(
        billingFrequency as
          (typeof billingFrequencies)[number],
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

    if (
      recurringFee !== null &&
      !isValidDecimal(recurringFee)
    ) {
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

    if (
      startDate !== null &&
      !isValidDate(startDate)
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
    }

    if (
      endDate !== null &&
      !isValidDate(endDate)
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
    }
    
    if (
      nextBillingDate !== null &&
      !isValidDate(nextBillingDate)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid next billing date.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      startDate !== null &&
      endDate !== null &&
      new Date(endDate) < new Date(startDate)
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

    const service = await prisma.$transaction(
      async (tx) => {
        const organization =
          await tx.organization.findUnique({
            where: {
              id: organizationId,
            },
            select: {
              id: true,
            },
          });

        if (!organization) {
          throw new Error(
            "ORGANIZATION_NOT_FOUND",
          );
        }

        if (projectId) {
          const project =
            await tx.project.findUnique({
              where: {
                id: projectId,
              },
              select: {
                id: true,
                proposal: {
                  select: {
                    opportunity: {
                      select: {
                        auditRequest: {
                          select: {
                            organizationId: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

          if (!project) {
            throw new Error("PROJECT_NOT_FOUND");
          }

          const projectOrganizationId =
            project.proposal.opportunity
              .auditRequest.organizationId;

          if (
            projectOrganizationId !==
            organizationId
          ) {
            throw new Error(
              "PROJECT_ORGANIZATION_MISMATCH",
            );
          }
        }

        if (contractId) {
          const contract =
            await tx.contract.findUnique({
              where: {
                id: contractId,
              },
              select: {
                id: true,
                status: true,
                proposal: {
                  select: {
                    opportunity: {
                      select: {
                        auditRequest: {
                          select: {
                            organizationId: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

          if (!contract) {
            throw new Error(
              "CONTRACT_NOT_FOUND",
            );
          }

          const contractOrganizationId =
            contract.proposal.opportunity
              .auditRequest.organizationId;

          if (
            contractOrganizationId !==
            organizationId
          ) {
            throw new Error(
              "CONTRACT_ORGANIZATION_MISMATCH",
            );
          }

          if (
            contract.status !== "ACTIVE"
          ) {
            throw new Error(
              "CONTRACT_NOT_ACTIVE",
            );
          }
        }

        const year = new Date()
          .getFullYear();

        await tx.$queryRaw`
          SELECT 1
          FROM (
           SELECT pg_advisory_xact_lock(
            hashtext(
              ${`techtrep:managed-service-number:${year}`}
            )
            )
          ) AS advisory_lock
        `;

        const lastService =
          await tx.managedService.findFirst({
            where: {
              serviceNumber: {
                startsWith: `MS-${year}-`,
              },
            },
            orderBy: {
              serviceNumber: "desc",
            },
            select: {
              serviceNumber: true,
            },
          });

        const nextNumber =
          lastService
            ? Number(
                lastService.serviceNumber
                  .split("-")
                  .pop(),
              ) + 1
            : 1;

        const serviceNumber =
          `MS-${year}-${String(
            nextNumber,
          ).padStart(4, "0")}`;

        const created =
          await tx.managedService.create({
            data: {
              organizationId,
              projectId:
                projectId || null,
              contractId:
                contractId || null,
              serviceNumber,
              name,
              description,
              type:
                type as
                  (typeof managedServiceTypes)[number],
              status: "DRAFT",
              sla:
                sla as
                  (typeof managedServiceSlas)[number],
              recurringFee:
                recurringFee !== null
                  ? recurringFee
                  : null,
              currency,
              billingFrequency:
                billingFrequency as
                  (typeof billingFrequencies)[number],
              billingEnabled,
              nextBillingDate:
                nextBillingDate !== null
                  ? new Date(nextBillingDate)
                  : null,
              startDate:
                startDate !== null
                  ? new Date(startDate)
                  : null,
              endDate:
                endDate !== null
                  ? new Date(endDate)
                  : null,
              serviceManagerId:
                serviceManagerId || null,
              notes,
            },
            include: {
              organization: {
                select: {
                  id: true,
                  name: true,
                },
              },
              project: {
                select: {
                  id: true,
                  projectNumber: true,
                  name: true,
                },
              },
              contract: {
                select: {
                  id: true,
                  contractNumber: true,
                  title: true,
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

        await tx.activity.create({
          data: {
            organizationId,
            type: "NOTE",
            description:
              `Managed service ${serviceNumber} created.`,
            metadata: {
              action: "MANAGED_SERVICE_CREATED",
              managedServiceId: created.id,
              serviceNumber,
            },
            createdByUserId: user.id,
          },
        });

        return created;
      },
    );

    return NextResponse.json(
      {
        success: true,
        service,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "ORGANIZATION_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified organization was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "PROJECT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified project was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "CONTRACT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified contract was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "PROJECT_ORGANIZATION_MISMATCH"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected project does not belong to the specified organization.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "CONTRACT_ORGANIZATION_MISMATCH"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected contract does not belong to the specified organization.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "CONTRACT_NOT_ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A managed service can only be linked to an active contract.",
        },
        {
          status: 400,
        },
      );
    }

    console.error(
      "Failed to create managed service",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create managed service.",
      },
      {
        status: 500,
      },
    );
  }
}