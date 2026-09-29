import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

import type {
  Prisma,
  ProposalStatus,
} from "../../../../generated/prisma/client";

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

type ProposalRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: ProposalRouteProps,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Proposal ID is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  try {
    const proposal =
      await prisma.proposal.findUnique({
        where: {
          id,
        },
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
              role: true,
            },
          },

          opportunity: {
            select: {
              id: true,
              name: true,
              description: true,
              priority: true,
              status: true,
              estimatedValue: true,
              createdAt: true,
              updatedAt: true,

              assignedToUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },

              auditRequest: {
                select: {
                  id: true,
                  status: true,
                  createdAt: true,

                  organization: {
                    select: {
                      id: true,
                      name: true,
                      industry: true,
                      website: true,
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

    const activities =
      await prisma.activity.findMany({
        where: {
          auditRequestId:
            proposal.opportunity.auditRequest.id,
          type: "PROPOSAL",
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          type: true,
          description: true,
          metadata: true,
          createdAt: true,
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    logger.info("Proposal retrieved", {
      requestId,
      userId: auth.user.id,
      proposalId: proposal.id,
      proposalNumber: proposal.proposalNumber,
    });

    return NextResponse.json(
      {
        success: true,
        proposal,
        activities,
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to retrieve proposal", {
      requestId,
      userId: auth.user.id,
      proposalId: id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve proposal.",
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
  { params }: ProposalRouteProps,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Proposal ID is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  try {
    const existing = await prisma.proposal.findUnique({
      where: {
        id,
      },
      include: {
        opportunity: {
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
        },
      },
    });

    if (!existing) {
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

    const body = await request.json();

    const data: Prisma.ProposalUpdateInput = {};

    const changes: Record<
      string,
      {
        previous: Prisma.InputJsonValue | null;
        next: Prisma.InputJsonValue | null;
      }
    > = {};

    if (body.proposalNumber !== undefined) {
      if (typeof body.proposalNumber !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Proposal number must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const proposalNumber = body.proposalNumber.trim();

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

      if (proposalNumber !== existing.proposalNumber) {
        const duplicate =
          await prisma.proposal.findFirst({
            where: {
              proposalNumber,
              NOT: {
                id,
              },
            },
            select: {
              id: true,
            },
          });

        if (duplicate) {
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

        data.proposalNumber = proposalNumber;

        changes.proposalNumber = {
          previous: existing.proposalNumber,
          next: proposalNumber,
        };
      }
    }

    if (body.title !== undefined) {
      if (typeof body.title !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Proposal title must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const title = body.title.trim();

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

      data.title = title;

      if (title !== existing.title) {
        changes.title = {
          previous: existing.title,
          next: title,
        };
      }
    }

    if (body.description !== undefined) {
      if (
        body.description !== null &&
        typeof body.description !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Description must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const description =
        typeof body.description === "string"
          ? body.description.trim()
          : "";

      data.description = description || null;

      if (data.description !== existing.description) {
        changes.description = {
          previous: existing.description,
          next: data.description ?? null,
        };
      }
    }

    if (body.amount !== undefined) {
      const amount = parseAmount(body.amount);

      if (
        body.amount !== null &&
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

      data.amount = amount;

      const previousAmount =
        existing.amount === null
          ? null
          : Number(existing.amount);

      if (amount !== previousAmount) {
        changes.amount = {
          previous: previousAmount,
          next: amount,
        };
      }
    }

    if (body.currency !== undefined) {
      if (typeof body.currency !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Currency must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const currency = body.currency.trim().toUpperCase();

      if (!/^[A-Z]{3}$/.test(currency)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Currency must be a 3-letter currency code.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      data.currency = currency;

      if (currency !== existing.currency) {
        changes.currency = {
          previous: existing.currency,
          next: currency,
        };
      }
    }

    if (body.validUntil !== undefined) {
      const validUntil = parseDate(body.validUntil);

      if (
        body.validUntil !== null &&
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

      data.validUntil = validUntil;

      if (
        validUntil?.getTime() !==
        existing.validUntil?.getTime()
      ) {
        changes.validUntil = {
          previous:
            existing.validUntil?.toISOString() ?? null,
          next: validUntil?.toISOString() ?? null,
        };
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
            message: "Notes must be text.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      const notes =
        typeof body.notes === "string"
          ? body.notes.trim()
          : "";

      data.notes = notes || null;

      if (data.notes !== existing.notes) {
        changes.notes = {
          previous: existing.notes,
          next: data.notes ?? null,
        };
      }
    }

    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) {
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

      const nextStatus = body.status;

      if (nextStatus !== existing.status) {
        data.status = nextStatus;

        changes.status = {
          previous: existing.status,
          next: nextStatus,
        };

        if (nextStatus === "SENT") {
          data.sentAt = existing.sentAt ?? new Date();
        }

        if (nextStatus === "ACCEPTED") {
          data.acceptedAt =
            existing.acceptedAt ?? new Date();
        }

        if (nextStatus === "REJECTED") {
          data.rejectedAt =
            existing.rejectedAt ?? new Date();
        }
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No changes were provided.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const proposal = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.proposal.update({
          where: {
            id,
          },
          data,
        });

        await tx.activity.create({
          data: {
            organizationId:
              existing.opportunity.auditRequest.organizationId,
            auditRequestId:
              existing.opportunity.auditRequest.id,
            type:
              changes.status
                ? "STATUS_CHANGE"
                : "PROPOSAL",
            createdByUserId: user.id,
            description: `Proposal updated: ${updated.title}`,
            metadata: {
              proposalId: updated.id,
              proposalNumber: updated.proposalNumber,
              opportunityId:
                existing.opportunity.id,
              action: "PROPOSAL_UPDATED",
              changes,
              changedByUserId: user.id,
              requestId,
            },
          },
        });

        return updated;
      },
    );

    logger.info("Proposal updated", {
      requestId,
      userId: user.id,
      proposalId: proposal.id,
      proposalNumber: proposal.proposalNumber,
      opportunityId: existing.opportunity.id,
      changes: Object.keys(changes),
    });

    return NextResponse.json(
      {
        success: true,
        proposal,
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to update proposal", {
      requestId,
      userId: user.id,
      proposalId: id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update proposal.",
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