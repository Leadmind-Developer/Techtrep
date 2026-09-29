import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit-log";
import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getProjects } from "@/lib/projects";

import type {
  OpportunityPriority,
  ProjectStatus,
} from "../../../generated/prisma/client";

const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const PROJECT_PRIORITIES: OpportunityPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

function isValidAmount(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(amount) && amount >= 0;
}

function isValidEnum<T extends string>(
  value: unknown,
  values: T[],
): value is T {
  return (
    typeof value === "string" &&
    values.includes(value as T)
  );
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const search = searchParams.get("search")?.trim() || "";
    const statusParam = searchParams.get("status");
    const priorityParam = searchParams.get("priority");
    const projectManagerId =
      searchParams.get("projectManagerId")?.trim() || "";

    const pageParam = Number(searchParams.get("page") ?? "1");

    const status =
      statusParam &&
      PROJECT_STATUSES.includes(
        statusParam as (typeof PROJECT_STATUSES)[number],
      )
        ? (statusParam as (typeof PROJECT_STATUSES)[number])
        : undefined;

    const priority =
      priorityParam &&
      PROJECT_PRIORITIES.includes(
        priorityParam as (typeof PROJECT_PRIORITIES)[number],
      )
        ? (priorityParam as (typeof PROJECT_PRIORITIES)[number])
        : undefined;

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const result = await getProjects({
      search,
      status,
      priority,
      projectManagerId,
      page,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to fetch projects", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch projects.",
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

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const { user, response } = await requireApiUser();

    if (response) {
      return response;
    }
    const body = await request.json();

    const proposalId =
      typeof body.proposalId === "string"
        ? body.proposalId.trim()
        : "";

    const projectNumber =
      typeof body.projectNumber === "string"
        ? body.projectNumber.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const status =
      body.status === undefined
        ? "PLANNING"
        : body.status;

    const priority =
      body.priority === undefined
        ? "MEDIUM"
        : body.priority;

    const currency =
      typeof body.currency === "string"
        ? body.currency.trim().toUpperCase()
        : "NGN";

    const projectManagerId =
      typeof body.projectManagerId === "string" &&
      body.projectManagerId.trim()
        ? body.projectManagerId.trim()
        : null;

    const contractValue =
      body.contractValue === null ||
      body.contractValue === undefined ||
      body.contractValue === ""
        ? null
        : Number(body.contractValue);

    if (!proposalId || !projectNumber || !name) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Proposal, project number, and project name are required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (projectNumber.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project number must be 100 characters or fewer.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (name.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project name must be 200 characters or fewer.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!isValidEnum(status, PROJECT_STATUSES)) {
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

    if (!isValidEnum(priority, PROJECT_PRIORITIES)) {
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

    if (!/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Currency must be a valid three-letter currency code.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!isValidAmount(contractValue)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Contract value must be a valid non-negative amount.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const startDate =
      body.startDate === null ||
      body.startDate === undefined ||
      body.startDate === ""
        ? null
        : body.startDate;

    const targetEndDate =
      body.targetEndDate === null ||
      body.targetEndDate === undefined ||
      body.targetEndDate === ""
        ? null
        : body.targetEndDate;

    if (startDate !== null && !isValidDate(startDate)) {
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
      targetEndDate !== null &&
      !isValidDate(targetEndDate)
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

    const proposal = await prisma.proposal.findUnique({
      where: {
        id: proposalId,
      },
      include: {
        opportunity: {
          select: {
            id: true,
            name: true,
            status: true,
            auditRequest: {
              select: {
                id: true,
                organizationId: true,
              },
            },
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        {
          success: false,
          message: "Proposal not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (proposal.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only an accepted proposal can be converted into a project.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const existingProject =
      await prisma.project.findUnique({
        where: {
          proposalId,
        },
        select: {
          id: true,
          projectNumber: true,
        },
      });

    if (existingProject) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A project already exists for this proposal.",
          project: existingProject,
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (projectManagerId) {
      const manager = await prisma.user.findUnique({
        where: {
          id: projectManagerId,
        },
        select: {
          id: true,
          active: true,
        },
      });

      if (!manager || !manager.active) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The selected project manager is not an active user.",
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

    const project = await prisma.$transaction(
      async (tx) => {
        const createdProject =
          await tx.project.create({
            data: {
              proposalId,
              projectNumber,
              name,
              description:
                description || null,
              status,
              priority,
              contractValue:
                contractValue === null
                  ? proposal.amount
                  : contractValue,
              currency,
              startDate:
                startDate === null
                  ? null
                  : new Date(startDate),
              targetEndDate:
                targetEndDate === null
                  ? null
                  : new Date(targetEndDate),
              projectManagerId,
              createdByUserId: user.id,
            },
            include: {
              projectManager: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              proposal: {
                select: {
                  id: true,
                  proposalNumber: true,
                  title: true,
                  amount: true,
                  status: true,
                },
              },
            },
          });

        await tx.activity.create({
          data: {
            organizationId:
              proposal.opportunity.auditRequest
                .organizationId,
            type: "NOTE",
            description: `Project ${createdProject.projectNumber} created from accepted proposal ${proposal.proposalNumber}.`,
            metadata: {
              projectId: createdProject.id,
              projectNumber:
                createdProject.projectNumber,
              proposalId: proposal.id,
              proposalNumber:
                proposal.proposalNumber,
              action: "PROJECT_CREATED",
            },
            createdByUserId: user.id,
          },
        });

        return createdProject;
      },
    );

    logger.info("Project created", {
      requestId,
      userId: user.id,
      projectId: project.id,
      projectNumber: project.projectNumber,
      proposalId,
    });

    await createAuditLog({
      action: "USER_UPDATED",
      userId: user.id,
      requestId,
      metadata: {
        action: "PROJECT_CREATED",
        projectId: project.id,
        projectNumber: project.projectNumber,
        proposalId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        project,
      },
      {
        status: 201,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Project creation failed", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create the project.",
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