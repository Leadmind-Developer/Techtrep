import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";
import {
  calculateSlaDeadline,
  getSlaTarget,
} from "@/lib/managed-services/sla";

function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function getOptionalString(
  value: unknown,
): string | null {
  const result = getString(value);
  return result || null;
}

const validPriorities = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
] as const;

type ServiceRequestPriority =
  (typeof validPriorities)[number];

export async function GET(request: Request) {
  const { response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const { searchParams } =
      new URL(request.url);

    const search = getString(
      searchParams.get("search"),
    );

    const status = getOptionalString(
      searchParams.get("status"),
    );

    const priority = getOptionalString(
      searchParams.get("priority"),
    );

    const managedServiceId =
      getOptionalString(
        searchParams.get("managedServiceId"),
      );

    const organizationId =
      getOptionalString(
        searchParams.get("organizationId"),
      );

    const assignedToId =
      getOptionalString(
        searchParams.get("assignedToId"),
      );

    const requests =
      await prisma.serviceRequest.findMany({
        where: {
          ...(status
            ? {
                status: status as
                  | "OPEN"
                  | "ASSIGNED"
                  | "IN_PROGRESS"
                  | "WAITING"
                  | "RESOLVED"
                  | "CLOSED"
                  | "CANCELLED",
              }
            : {}),
          ...(priority
            ? {
                priority: priority as ServiceRequestPriority,
              }
            : {}),
          ...(managedServiceId
            ? { managedServiceId }
            : {}),
          ...(organizationId
            ? { organizationId }
            : {}),
          ...(assignedToId
            ? { assignedToId }
            : {}),
          ...(search
            ? {
                OR: [
                  {
                    requestNumber: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          managedService: {
            select: {
              id: true,
              serviceNumber: true,
              name: true,
              status: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              active: true,
            },
          },
        },
        orderBy: {
          openedAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error(
      "Failed to fetch service requests",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch service requests.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const { user, response } =
    await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const body =
      (await request.json()) as Record<
        string,
        unknown
      >;

    const managedServiceId =
      getString(body.managedServiceId);

    const title = getString(body.title);

    const description =
      getOptionalString(body.description);

    const priorityValue =
      getString(body.priority) || "NORMAL";

    const assignedToId =
      getOptionalString(body.assignedToId);

    const notes =
      getOptionalString(body.notes);

    if (!managedServiceId) {
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

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Service request title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !validPriorities.includes(
        priorityValue as ServiceRequestPriority,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid service request priority.",
        },
        {
          status: 400,
        },
      );
    }

    const managedService =
      await prisma.managedService.findUnique({
        where: {
          id: managedServiceId,
        },
        select: {
          id: true,
          organizationId: true,
          serviceNumber: true,
          name: true,
          status: true,
        },
      });

    if (!managedService) {
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

    if (
      managedService.status !== "ACTIVE" &&
      managedService.status !== "PAUSED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Service requests can only be created for active or paused managed services.",
        },
        {
          status: 400,
        },
      );
    }

    if (assignedToId) {
      const assignee =
        await prisma.user.findUnique({
          where: {
            id: assignedToId,
          },
          select: {
            id: true,
            active: true,
          },
        });

      if (!assignee) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The specified assignee was not found.",
          },
          {
            status: 400,
          },
        );
      }

      if (!assignee.active) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The specified assignee is not active.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const year = getCurrentYear();

    const createdRequest =
      await prisma.$transaction(
        async (tx) => {
          await tx.$queryRaw`
            SELECT 1
            FROM (
              SELECT pg_advisory_xact_lock(
                hashtext(
                  ${`techtrep:service-request-number:${year}`}
                )
              )
            ) AS advisory_lock
          `;

          const latestRequest =
            await tx.serviceRequest.findFirst({
              where: {
                requestNumber: {
                  startsWith: `SR-${year}-`,
                },
              },
              orderBy: {
                requestNumber: "desc",
              },
              select: {
                requestNumber: true,
              },
            });

          const nextNumber =
            latestRequest
              ? Number(
                  latestRequest.requestNumber
                    .split("-")
                    .at(-1),
                ) + 1
              : 1;

          const requestNumber =
            `SR-${year}-${String(
              nextNumber,
            ).padStart(4, "0")}`;
          
          const managedServiceSla =
            await tx.managedService.findUnique({
              where: {
                id: managedService.id,
              },
              select: {
                sla: true,
              },
            });

          if (!managedServiceSla) {
            throw new Error(
              "Managed service disappeared during request creation.",
            );
          }

          const slaTarget = getSlaTarget(managedServiceSla.sla);

          const openedAt = new Date();

          const firstResponseDueAt = calculateSlaDeadline(
          openedAt,
          slaTarget.firstResponseHours,
          );

          const resolutionDueAt = calculateSlaDeadline(
            openedAt,
            slaTarget.resolutionHours,
          );

          const created =
            await tx.serviceRequest.create({
              data: {
                managedServiceId:
                  managedService.id,
                organizationId:
                  managedService.organizationId,
                requestNumber,
                title,
                description,
                priority:
                  priorityValue as ServiceRequestPriority,
                assignedToId,
                assignedAt: assignedToId
                  ? new Date()
                  : null,
                notes,
                openedAt,
                firstResponseDueAt,
                resolutionDueAt,
              },
              include: {
                managedService: {
                  select: {
                    id: true,
                    serviceNumber: true,
                    name: true,
                  },
                },
                organization: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                assignedTo: {
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
              type: assignedToId
                ? "STATUS_CHANGE"
                : "NOTE",
              description:
                description ??
                notes ??
                "Service request created",
              organizationId:
                managedService.organizationId,
              createdByUserId: user.id,
              metadata: {
                action:
                  "SERVICE_REQUEST_CREATED",
                serviceRequestId:
                  created.id,
                requestNumber,
                managedServiceId:
                  managedService.id,
                serviceNumber:
                  managedService.serviceNumber,
                assignedToId:
                  assignedToId ?? null,
              },
            },
          });

          return created;
        },
      );

    return NextResponse.json(
      {
        success: true,
        request: createdRequest,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Failed to create service request",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create service request.",
      },
      {
        status: 500,
      },
    );
  }
}
