import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

const serviceRequestStatuses = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
] as const;

const serviceRequestPriorities = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
] as const;

type ServiceRequestStatus =
  (typeof serviceRequestStatuses)[number];

type ServiceRequestPriority =
  (typeof serviceRequestPriorities)[number];

const allowedTransitions: Record<
  ServiceRequestStatus,
  ServiceRequestStatus[]
> = {
  OPEN: ["ASSIGNED", "IN_PROGRESS", "WAITING", "CANCELLED"],
  ASSIGNED: [
    "IN_PROGRESS",
    "WAITING",
    "CANCELLED",
  ],
  IN_PROGRESS: [
    "WAITING",
    "RESOLVED",
    "CANCELLED",
  ],
  WAITING: [
    "IN_PROGRESS",
    "RESOLVED",
    "CANCELLED",
  ],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
  CANCELLED: [],
};

function isValidStatus(
  value: string,
): value is ServiceRequestStatus {
  return serviceRequestStatuses.includes(
    value as ServiceRequestStatus,
  );
}

function isValidPriority(
  value: string,
): value is ServiceRequestPriority {
  return serviceRequestPriorities.includes(
    value as ServiceRequestPriority,
  );
}

async function getServiceRequest(id: string) {
  return prisma.serviceRequest.findUnique({
    where: {
      id,
    },
    include: {
      managedService: {
        select: {
          id: true,
          serviceNumber: true,
          name: true,
          type: true,
          status: true,
          sla: true,
          recurringFee: true,
          currency: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
          website: true,
          industry: true,
          companySize: true,
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
          message: "Service request ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const serviceRequest =
      await getServiceRequest(id);

    if (!serviceRequest) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified service request was not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      serviceRequest,
    });
  } catch (error) {
    console.error(
      "Failed to fetch service request",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch service request.",
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
          message: "Service request ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await prisma.serviceRequest.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          organizationId: true,
          managedServiceId: true,
          requestNumber: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          assignedToId: true,
          assignedAt: true,
          startedAt: true,
          resolvedAt: true,
          closedAt: true,
          resolution: true,
          notes: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The specified service request was not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const hasStatus =
      body.status !== undefined;

    const hasPriority =
      body.priority !== undefined;

    const hasAssignedTo =
      body.assignedToId !== undefined;

    const hasTitle =
      body.title !== undefined;

    const hasDescription =
      body.description !== undefined;

    const hasResolution =
      body.resolution !== undefined;

    const hasNotes =
      body.notes !== undefined;

    const requestedStatus =
      typeof body.status === "string"
        ? body.status.trim()
        : existing.status;

    const requestedPriority =
      typeof body.priority === "string"
        ? body.priority.trim()
        : existing.priority;

    if (
      hasStatus &&
      !isValidStatus(requestedStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service request status.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      hasPriority &&
      !isValidPriority(requestedPriority)
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

    if (
      hasStatus &&
      requestedStatus !== existing.status &&
      !allowedTransitions[
        existing.status as ServiceRequestStatus
      ].includes(requestedStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Invalid status transition from ${existing.status} to ${requestedStatus}.`,
        },
        {
          status: 400,
        },
      );
    }

    let assignedToId =
      existing.assignedToId;

    if (hasAssignedTo) {
      if (
        body.assignedToId === null ||
        body.assignedToId === ""
      ) {
        assignedToId = null;
      } else if (
        typeof body.assignedToId === "string"
      ) {
        assignedToId =
          body.assignedToId.trim() || null;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid assigned staff member.",
          },
          {
            status: 400,
          },
        );
      }
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
              "The selected staff member was not found.",
          },
          {
            status: 404,
          },
        );
      }

      if (!assignee.active) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The selected staff member is inactive.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const nextStatus =
      requestedStatus as ServiceRequestStatus;

    const statusChanged =
      nextStatus !== existing.status;

    const assignmentChanged =
      assignedToId !== existing.assignedToId;

    const now = new Date();

    const data: {
      title?: string;
      description?: string | null;
      status?: ServiceRequestStatus;
      priority?: ServiceRequestPriority;
      assignedToId?: string | null;
      assignedAt?: Date | null;
      startedAt?: Date | null;
      resolvedAt?: Date | null;
      closedAt?: Date | null;
      resolution?: string | null;
      notes?: string | null;
    } = {};

    if (hasTitle) {
      if (
        typeof body.title !== "string" ||
        !body.title.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Service request title cannot be empty.",
          },
          {
            status: 400,
          },
        );
      }

      data.title = body.title.trim();
    }

    if (hasDescription) {
      data.description =
        typeof body.description === "string"
          ? body.description.trim() || null
          : null;
    }

    if (hasPriority) {
      data.priority =
        requestedPriority as ServiceRequestPriority;
    }

    if (hasAssignedTo) {
      data.assignedToId = assignedToId;

      if (assignmentChanged) {
        data.assignedAt = assignedToId
          ? now
          : null;
      }
    }

    if (hasResolution) {
      data.resolution =
        typeof body.resolution === "string"
          ? body.resolution.trim() || null
          : null;
    }

    if (hasNotes) {
      data.notes =
        typeof body.notes === "string"
          ? body.notes.trim() || null
          : null;
    }

    if (statusChanged) {
      data.status = nextStatus;

      if (nextStatus === "ASSIGNED") {
        data.assignedAt =
          existing.assignedAt ?? now;
      }

      if (nextStatus === "IN_PROGRESS") {
        data.startedAt =
          existing.startedAt ?? now;
      }

      if (nextStatus === "RESOLVED") {
        data.resolvedAt = now;
      }

      if (nextStatus === "CLOSED") {
        data.closedAt = now;
        data.resolvedAt =
          existing.resolvedAt ?? now;
      }

      if (
        nextStatus === "OPEN" ||
        nextStatus === "CANCELLED"
      ) {
        if (nextStatus === "CANCELLED") {
          data.closedAt = null;
        }
      }
    }

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const serviceRequest =
            await tx.serviceRequest.update({
              where: {
                id,
              },
              data,
              include: {
                managedService: {
                  select: {
                    id: true,
                    serviceNumber: true,
                    name: true,
                    type: true,
                    status: true,
                    sla: true,
                    recurringFee: true,
                    currency: true,
                  },
                },
                organization: {
                  select: {
                    id: true,
                    name: true,
                    website: true,
                    industry: true,
                    companySize: true,
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
            });

          if (statusChanged) {
            await tx.activity.create({
              data: {
                organizationId:
                  existing.organizationId,
                type: "STATUS_CHANGE",
                description:
                  `Service request ${existing.requestNumber} changed from ${existing.status} to ${nextStatus}.`,
                metadata: {
                  action:
                    "SERVICE_REQUEST_STATUS_CHANGED",
                  serviceRequestId: existing.id,
                  requestNumber:
                    existing.requestNumber,
                  previousStatus:
                    existing.status,
                  newStatus: nextStatus,
                },
                createdByUserId: user.id,
              },
            });
          }

          if (assignmentChanged) {
            await tx.activity.create({
              data: {
                organizationId:
                  existing.organizationId,
                type: "NOTE",
                description:
                  assignedToId
                    ? `Service request ${existing.requestNumber} was assigned to a staff member.`
                    : `Service request ${existing.requestNumber} was unassigned.`,
                metadata: {
                  action:
                    "SERVICE_REQUEST_ASSIGNMENT_CHANGED",
                  serviceRequestId: existing.id,
                  requestNumber:
                    existing.requestNumber,
                  assignedToId,
                },
                createdByUserId: user.id,
              },
            });
          }

          if (
            !statusChanged &&
            !assignmentChanged
          ) {
            await tx.activity.create({
              data: {
                organizationId:
                  existing.organizationId,
                type: "NOTE",
                description:
                  `Service request ${existing.requestNumber} was updated.`,
                metadata: {
                  action:
                    "SERVICE_REQUEST_UPDATED",
                  serviceRequestId: existing.id,
                  requestNumber:
                    existing.requestNumber,
                },
                createdByUserId: user.id,
              },
            });
          }

          return serviceRequest;
        },
      );

    return NextResponse.json({
      success: true,
      serviceRequest: updated,
    });
  } catch (error) {
    console.error(
      "Failed to update service request",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update service request.",
      },
      {
        status: 500,
      },
    );
  }
}
