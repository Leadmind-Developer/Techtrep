import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit-log";
import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
  OpportunityPriority,
  ProjectStatus,
} from "../../../../generated/prisma/client";

const PROJECT_STATUSES = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const;

const PROJECT_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isValidDate(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function isValidAmount(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0;
  }

  if (typeof value === "string") {
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0;
  }

  return false;
}

function isValidEnum<T extends readonly string[]>(
  value: unknown,
  values: T,
): value is T[number] {
  return (
    typeof value === "string" &&
    values.includes(value as T[number])
  );
}

async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      projectManager: {
        select: {
          id: true,
          name: true,
          email: true,
          active: true,
          role: true,
        },
      },
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
          active: true,
          role: true,
        },
      },
      proposal: {
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          opportunity: {
            include: {
              createdByUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              assignedToUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  active: true,
                },
              },
              auditRequest: {
                include: {
                  organization: {
                    select: {
                      id: true,
                      name: true,
                      website: true,
                      industry: true,
                      companySize: true,
                    },
                  },
                  contact: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true,
                      role: true,
                    },
                  },
                  lead: {
                    select: {
                      id: true,
                      status: true,
                      source: true,
                      estimatedValue: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);

  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const { id } = await context.params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const project = await getProject(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        project,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to fetch project", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch project.",
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

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);

  try {
    const { user, response } = await requireApiUser();

    if (response) {
      return response;
    }

    const { id } = await context.params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        proposal: {
          include: {
            opportunity: {
              include: {
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

    if (!existingProject) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const body = await request.json();

    const allowedFields = [
      "projectNumber",
      "name",
      "description",
      "status",
      "priority",
      "contractValue",
      "currency",
      "startDate",
      "targetEndDate",
      "projectManagerId",
    ] as const;

    const suppliedFields = Object.keys(body);

    const hasUnknownField = suppliedFields.some(
      (field) =>
        !allowedFields.includes(
          field as (typeof allowedFields)[number],
        ),
    );

    if (hasUnknownField) {
      return NextResponse.json(
        {
          success: false,
          message: "Request contains unsupported fields.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.projectNumber !== undefined &&
      (
        typeof body.projectNumber !== "string" ||
        !body.projectNumber.trim() ||
        body.projectNumber.trim().length > 100
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project number.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.name !== undefined &&
      (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 200
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project name.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.description !== undefined &&
      body.description !== null &&
      (
        typeof body.description !== "string" ||
        body.description.length > 5000
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project description.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.status !== undefined &&
      !isValidEnum(body.status, PROJECT_STATUSES)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project status.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.priority !== undefined &&
      !isValidEnum(body.priority, PROJECT_PRIORITIES)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project priority.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.contractValue !== undefined &&
      !isValidAmount(body.contractValue)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid contract value.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.currency !== undefined &&
      (
        typeof body.currency !== "string" ||
        !/^[A-Z]{3}$/.test(body.currency.trim().toUpperCase())
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Currency must be a valid 3-letter code.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.startDate !== undefined &&
      body.startDate !== null &&
      !isValidDate(body.startDate)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid start date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.targetEndDate !== undefined &&
      body.targetEndDate !== null &&
      !isValidDate(body.targetEndDate)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid target end date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.startDate &&
      body.targetEndDate &&
      isValidDate(body.startDate) &&
      isValidDate(body.targetEndDate) &&
      new Date(body.targetEndDate) <
        new Date(body.startDate)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Target end date cannot be before the start date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (
      body.projectManagerId !== undefined &&
      body.projectManagerId !== null &&
      (
        typeof body.projectManagerId !== "string" ||
        !body.projectManagerId.trim()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project manager.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (body.projectNumber !== undefined) {
      const projectNumber =
        body.projectNumber.trim();

      if (
        projectNumber !== existingProject.projectNumber
      ) {
        const duplicate =
          await prisma.project.findUnique({
            where: { projectNumber },
            select: { id: true },
          });

        if (duplicate) {
          return NextResponse.json(
            {
              success: false,
              message:
                "A project with this project number already exists.",
            },
            {
              status: 409,
              headers: {
                "x-request-id": requestId,
              },
            },
          );
        }
      }
    }

    if (
      body.projectManagerId !== undefined &&
      body.projectManagerId !== null
    ) {
      const projectManager =
        await prisma.user.findUnique({
          where: {
            id: body.projectManagerId.trim(),
          },
          select: {
            id: true,
            active: true,
            role: true,
          },
        });

      if (!projectManager || !projectManager.active) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Project manager must be an active user.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }
    }

    const nextStatus =
      body.status !== undefined
        ? (body.status as ProjectStatus)
        : existingProject.status;

    const updateData = {
      ...(body.projectNumber !== undefined && {
        projectNumber: body.projectNumber.trim(),
      }),
      ...(body.name !== undefined && {
        name: body.name.trim(),
      }),
      ...(body.description !== undefined && {
        description:
          body.description === null
            ? null
            : body.description.trim(),
      }),
      ...(body.status !== undefined && {
        status: nextStatus,
      }),
      ...(body.priority !== undefined && {
        priority:
          body.priority as OpportunityPriority,
      }),
      ...(body.contractValue !== undefined && {
        contractValue:
          body.contractValue === null ||
          body.contractValue === ""
            ? null
            : String(body.contractValue),
      }),
      ...(body.currency !== undefined && {
        currency: body.currency
          .trim()
          .toUpperCase(),
      }),
      ...(body.startDate !== undefined && {
        startDate:
          body.startDate === null
            ? null
            : new Date(body.startDate),
      }),
      ...(body.targetEndDate !== undefined && {
        targetEndDate:
          body.targetEndDate === null
            ? null
            : new Date(body.targetEndDate),
      }),
      ...(body.projectManagerId !== undefined && {
        projectManagerId:
          body.projectManagerId === null
            ? null
            : body.projectManagerId.trim(),
      }),
      ...(nextStatus === "COMPLETED" &&
        existingProject.status !== "COMPLETED" && {
          completedAt: new Date(),
        }),
    };

    const updatedProject = await prisma.$transaction(
      async (tx) => {
        const project = await tx.project.update({
          where: { id },
          data: updateData,
          include: {
            projectManager: {
              select: {
                id: true,
                name: true,
                email: true,
                active: true,
                role: true,
              },
            },
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
                active: true,
                role: true,
              },
            },
          },
        });

        const changes: Record<string, string | number | boolean | null> = {};

        for (const field of allowedFields) {
          if (body[field] !== undefined) {
            const value = body[field];

            if (
                value === null ||
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            ) {
            changes[field] = value;
            } else {
                changes[field] = String(value);
            }
          }
        }

        await tx.activity.create({
          data: {
            organizationId:
              existingProject.proposal.opportunity
                .auditRequest.organizationId,
            type:
              body.status !== undefined
                ? "STATUS_CHANGE"
                : "NOTE",
            description:
              body.status !== undefined
                ? `Project ${project.projectNumber} status updated to ${project.status}.`
                : `Project ${project.projectNumber} updated.`,
            metadata: {
              projectId: project.id,
              changes,
              updatedByUserId: user.id,
            },
            createdByUserId: user.id,
          },
        });

        return project;
      },
    );

    try {
      await createAuditLog({
        action: "USER_UPDATED",
        userId: user.id,
        requestId,
        metadata: {
          action: "PROJECT_UPDATED",
          projectId: updatedProject.id,
          projectNumber: updatedProject.projectNumber,
          changes: Object.keys(body),
        },
      });
    } catch (auditError) {
      logger.error("Failed to create project audit log", {
        requestId,
        projectId: updatedProject.id,
        error:
          auditError instanceof Error
            ? auditError.message
            : "Unknown error",
      });
    }

    logger.info("Project updated", {
      requestId,
      projectId: updatedProject.id,
      projectNumber: updatedProject.projectNumber,
      userId: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        project: updatedProject,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to update project", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update project.",
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