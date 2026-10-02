import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const contractStatuses = [
  "DRAFT",
  "SENT",
  "SIGNED",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
] as const;

type ContractStatus = (typeof contractStatuses)[number];

const allowedTransitions: Record<
  ContractStatus,
  ContractStatus[]
> = {
  DRAFT: ["SENT", "TERMINATED"],
  SENT: ["SIGNED", "TERMINATED"],
  SIGNED: ["ACTIVE", "TERMINATED"],
  ACTIVE: ["EXPIRED", "TERMINATED"],
  EXPIRED: [],
  TERMINATED: [],
};

function isContractStatus(
  value: unknown,
): value is ContractStatus {
  return (
    typeof value === "string" &&
    contractStatuses.includes(
      value as ContractStatus,
    )
  );
}

function parseOptionalDate(
  value: unknown,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { id } = await context.params;

    const contractId = id.trim();

    if (!contractId) {
      return NextResponse.json(
        {
          success: false,
          message: "Contract ID is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      select: {
        id: true,
        contractNumber: true,
        title: true,
        description: true,
        status: true,
        amount: true,
        currency: true,
        startDate: true,
        endDate: true,
        signedAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        proposal: {
          select: {
            id: true,
            proposalNumber: true,
            title: true,
            description: true,
            amount: true,
            currency: true,
            status: true,
            validUntil: true,
            sentAt: true,
            acceptedAt: true,
            opportunity: {
              select: {
                id: true,
                name: true,
                description: true,
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        {
          success: false,
          message: "Contract not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    logger.info("Contract retrieved", {
      requestId,
      userId: auth.user.id,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
    });

    return NextResponse.json(
      {
        success: true,
        contract,
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to retrieve contract", {
      requestId,
      userId: auth.user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve contract.",
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

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;

  try {
    const { id } = await context.params;

    const contractId = id.trim();

    if (!contractId) {
      return NextResponse.json(
        {
          success: false,
          message: "Contract ID is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const body = await request.json();

    const existingContract =
      await prisma.contract.findUnique({
        where: {
          id: contractId,
        },
        select: {
          id: true,
          contractNumber: true,
          title: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
          signedAt: true,
          notes: true,
          proposalId: true,
        },
      });

    if (!existingContract) {
      return NextResponse.json(
        {
          success: false,
          message: "Contract not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const title =
      body.title !== undefined
        ? typeof body.title === "string"
          ? body.title.trim()
          : null
        : undefined;

    const description =
      body.description !== undefined
        ? body.description === null
          ? null
          : typeof body.description === "string"
            ? body.description.trim()
            : null
        : undefined;

    const notes =
      body.notes !== undefined
        ? body.notes === null
          ? null
          : typeof body.notes === "string"
            ? body.notes.trim()
            : null
        : undefined;

    if (title !== undefined && !title) {
      return NextResponse.json(
        {
          success: false,
          message: "Contract title cannot be empty.",
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
      typeof body.description !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must be a string or null.",
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
      body.notes !== undefined &&
      body.notes !== null &&
      typeof body.notes !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Notes must be a string or null.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const startDate = parseOptionalDate(
      body.startDate,
    );

    const endDate = parseOptionalDate(
      body.endDate,
    );

    const signedAt = parseOptionalDate(
      body.signedAt,
    );

    if (
      body.startDate !== undefined &&
      startDate === undefined
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
      body.endDate !== undefined &&
      endDate === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid end date.",
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
      body.signedAt !== undefined &&
      signedAt === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid signed date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const effectiveStartDate =
      startDate !== undefined
        ? startDate
        : existingContract.startDate;

    const effectiveEndDate =
      endDate !== undefined
        ? endDate
        : existingContract.endDate;

    if (
      effectiveStartDate &&
      effectiveEndDate &&
      effectiveEndDate < effectiveStartDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End date cannot be earlier than the start date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    let nextStatus:
      | ContractStatus
      | undefined;

    if (body.status !== undefined) {
      if (!isContractStatus(body.status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid contract status.",
          },
          {
            status: 400,
            headers: {
              "x-request-id": requestId,
            },
          },
        );
      }

      nextStatus = body.status;

      if (nextStatus !== existingContract.status) {
        const requestedStatus = nextStatus;

        const allowed =
          allowedTransitions[
            existingContract.status
          ];

        if (!requestedStatus || !allowed.includes(requestedStatus)) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Invalid contract status transition: ` +
                `${existingContract.status} → ${nextStatus}.`,
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
      nextStatus === "SIGNED" &&
      body.signedAt === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A signed contract must have a signed date.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const signedAtValue =
      nextStatus === "SIGNED" &&
      existingContract.status !== "SIGNED"
        ? signedAt ?? new Date()
        : signedAt !== undefined
          ? signedAt
          : undefined;

    const updatedContract =
      await prisma.$transaction(async (tx) => {
        const contract =
          await tx.contract.update({
            where: {
              id: contractId,
            },
            data: {
              ...(title !== undefined
                ? { title }
                : {}),
              ...(description !== undefined
                ? { description }
                : {}),
              ...(startDate !== undefined
                ? { startDate }
                : {}),
              ...(endDate !== undefined
                ? { endDate }
                : {}),
              ...(signedAtValue !== undefined
                ? { signedAt: signedAtValue }
                : {}),
              ...(notes !== undefined
                ? { notes }
                : {}),
              ...(nextStatus !== undefined
                ? { status: nextStatus }
                : {}),
            },
          });

        const changedFields: string[] = [];

        if (title !== undefined) {
          changedFields.push("title");
        }

        if (description !== undefined) {
          changedFields.push("description");
        }

        if (startDate !== undefined) {
          changedFields.push("startDate");
        }

        if (endDate !== undefined) {
          changedFields.push("endDate");
        }

        if (signedAtValue !== undefined) {
          changedFields.push("signedAt");
        }

        if (notes !== undefined) {
          changedFields.push("notes");
        }

        if (
          nextStatus !== undefined &&
          nextStatus !== existingContract.status
        ) {
          changedFields.push("status");
        }

        await tx.activity.create({
          data: {
            organizationId:
              (
                await tx.proposal.findUniqueOrThrow({
                  where: {
                    id: existingContract.proposalId,
                  },
                  select: {
                    opportunity: {
                      select: {
                        auditRequest: {
                          select: {
                            organizationId: true,
                            id: true,
                          },
                        },
                      },
                    },
                  },
                })
              ).opportunity.auditRequest
                .organizationId,
            auditRequestId:
              (
                await tx.proposal.findUniqueOrThrow({
                  where: {
                    id: existingContract.proposalId,
                  },
                  select: {
                    opportunity: {
                      select: {
                        auditRequest: {
                          select: {
                            id: true,
                          },
                        },
                      },
                    },
                  },
                })
              ).opportunity.auditRequest.id,
            type: "PROPOSAL",
            createdByUserId: user.id,
            description:
              `Contract updated: ${contract.contractNumber}`,
            metadata: {
              contractId: contract.id,
              contractNumber:
                contract.contractNumber,
              proposalId: contract.proposalId,
              action: "CONTRACT_UPDATED",
              changedFields,
              previousStatus:
                existingContract.status,
              newStatus: contract.status,
              updatedByUserId: user.id,
              requestId,
            },
          },
        });

        return contract;
      });

    logger.info("Contract updated", {
      requestId,
      userId: user.id,
      contractId: updatedContract.id,
      contractNumber:
        updatedContract.contractNumber,
      previousStatus: existingContract.status,
      newStatus: updatedContract.status,
    });

    return NextResponse.json(
      {
        success: true,
        contract: updatedContract,
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to update contract", {
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
        message: "Unable to update contract.",
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
