import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

import type { ProposalStatus } from "@/../../generated/prisma/client";

const VALID_STATUSES: ProposalStatus[] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "WITHDRAWN",
];

function isValidStatus(
  value: unknown,
): value is ProposalStatus {
  return (
    typeof value === "string" &&
    VALID_STATUSES.includes(value as ProposalStatus)
  );
}

function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "number" && typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function parseDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const statusParam = searchParams.get("status");
    const opportunityIdParam =
      searchParams.get("opportunityId");
    const searchParam = searchParams.get("search");

    const page = pageParam
      ? Number.parseInt(pageParam, 10)
      : 1;

    const limit = limitParam
      ? Number.parseInt(limitParam, 10)
      : 20;

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Page must be a positive integer.",
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
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Limit must be between 1 and 100.",
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
      statusParam &&
      !isValidStatus(statusParam)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid proposal status.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const opportunityId =
      opportunityIdParam?.trim() || undefined;

    const search =
      searchParam?.trim() || undefined;

    const where = {
      ...(statusParam
        ? {
            status: statusParam as ProposalStatus,
          }
        : {}),
      ...(opportunityId
        ? {
            opportunityId,
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                proposalNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [proposals, total] =
      await prisma.$transaction([
        prisma.proposal.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
          select: {
            id: true,
            opportunityId: true,
            createdByUserId: true,
            proposalNumber: true,
            title: true,
            description: true,
            amount: true,
            currency: true,
            status: true,
            validUntil: true,
            sentAt: true,
            acceptedAt: true,
            rejectedAt: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            opportunity: {
              select: {
                id: true,
                name: true,
                status: true,
                priority: true,
                estimatedValue: true,
                auditRequest: {
                  select: {
                    id: true,
                    organization: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    contact: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.proposal.count({
          where,
        }),
      ]);

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        proposals,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to list proposals", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve proposals.",
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

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;

  try {
    const body = await request.json();

    const opportunityId =
      typeof body.opportunityId === "string"
        ? body.opportunityId.trim()
        : "";

    const proposalNumber =
      typeof body.proposalNumber === "string"
        ? body.proposalNumber.trim()
        : "";

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const currency =
      typeof body.currency === "string"
        ? body.currency.trim().toUpperCase()
        : "NGN";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : "";

    const status = body.status ?? "DRAFT";

    if (!opportunityId) {
      return NextResponse.json(
        {
          success: false,
          message: "Opportunity is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!proposalNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Proposal number is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Proposal title is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (proposalNumber.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Proposal number must be 100 characters or fewer.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Proposal title must be 200 characters or fewer.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (currency.length !== 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Currency must be a 3-letter currency code.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid proposal status.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const amount = parseAmount(body.amount);

    if (
      body.amount !== null &&
      body.amount !== undefined &&
      body.amount !== "" &&
      amount === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Proposal amount must be a valid non-negative number.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const validUntil = parseDate(body.validUntil);

    if (
      body.validUntil !== null &&
      body.validUntil !== undefined &&
      body.validUntil !== "" &&
      validUntil === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid-until date must be a valid date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const opportunity =
      await prisma.opportunity.findUnique({
        where: {
          id: opportunityId,
        },
        select: {
          id: true,
          name: true,
          auditRequest: {
            select: {
              id: true,
              organizationId: true,
            },
          },
        },
      });

    if (!opportunity) {
      return NextResponse.json(
        {
          success: false,
          message: "Opportunity not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const existingProposal =
      await prisma.proposal.findUnique({
        where: {
          proposalNumber,
        },
        select: {
          id: true,
        },
      });

    if (existingProposal) {
      return NextResponse.json(
        {
          success: false,
          message: "Proposal number already exists.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const proposal =
      await prisma.$transaction(async (tx) => {
        const created = await tx.proposal.create({
          data: {
            opportunityId,
            createdByUserId: user.id,
            proposalNumber,
            title,
            description: description || null,
            amount,
            currency,
            status,
            validUntil,
            notes: notes || null,
          },
        });

        await tx.activity.create({
          data: {
            organizationId:
              opportunity.auditRequest.organizationId,
            auditRequestId:
              opportunity.auditRequest.id,
            type: "PROPOSAL",
            createdByUserId: user.id,
            description: `Proposal created: ${created.title}`,
            metadata: {
              proposalId: created.id,
              proposalNumber: created.proposalNumber,
              opportunityId,
              action: "PROPOSAL_CREATED",
              createdByUserId: user.id,
              requestId,
            },
          },
        });

        return created;
      });

    logger.info("Proposal created", {
      requestId,
      userId: user.id,
      proposalId: proposal.id,
      proposalNumber: proposal.proposalNumber,
      opportunityId,
      organizationId:
        opportunity.auditRequest.organizationId,
    });

    return NextResponse.json(
      {
        success: true,
        proposal,
      },
      {
        status: 201,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to create proposal", {
      requestId,
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create proposal.",
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