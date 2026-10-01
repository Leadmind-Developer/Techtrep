import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() ?? "";

    const status =
      searchParams.get("status")?.trim() ?? "";

    const contracts = await prisma.contract.findMany({
      where: {
        ...(status
          ? {
              status: status as
                | "DRAFT"
                | "SENT"
                | "SIGNED"
                | "ACTIVE"
                | "EXPIRED"
                | "TERMINATED",
            }
          : {}),
        ...(search
          ? {
              OR: [
                {
                  contractNumber: {
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
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
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
            status: true,
            opportunity: {
              select: {
                id: true,
                name: true,
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
        },
      },
    });

    logger.info("Contracts retrieved", {
      requestId,
      userId: auth.user.id,
      count: contracts.length,
      search: search || undefined,
      status: status || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        contracts,
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to retrieve contracts", {
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
        message: "Unable to retrieve contracts.",
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

    const proposalId =
      typeof body.proposalId === "string"
        ? body.proposalId.trim()
        : "";

    if (!proposalId) {
      return NextResponse.json(
        {
          success: false,
          message: "Proposal is required.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const proposal =
      await prisma.proposal.findUnique({
        where: {
          id: proposalId,
        },
        select: {
          id: true,
          proposalNumber: true,
          title: true,
          description: true,
          amount: true,
          currency: true,
          status: true,
          opportunityId: true,
          project: {
            select: {
              id: true,
              projectNumber: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              auditRequestId: true,
              auditRequest: {
                select: {
                  id: true,
                  organizationId: true,
                },
              },
            },
          },
          contract: {
            select: {
              id: true,
              contractNumber: true,
              status: true,
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
            "A contract can only be created from an accepted proposal.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (proposal.contract) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A contract already exists for this proposal.",
          contract: proposal.contract,
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const year = new Date().getFullYear();

    const contract =
      await prisma.$transaction(async (tx) => {
        /*
         * Serialize contract-number generation for the
         * current year. This prevents concurrent requests
         * from receiving the same contract number.
         */
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtext(${`techtrep:contract-number:${year}`})
          )
        `;

        const result =
          await tx.$queryRaw<
            Array<{ max_number: number | null }>
          >`
            SELECT MAX(
              CAST(
                SUBSTRING(
                  "contractNumber"
                  FROM ${`^CON-${year}-([0-9]+)$`}
                ) AS INTEGER
              )
            ) AS max_number
            FROM "contracts"
            WHERE "contractNumber" ~ ${`^CON-${year}-[0-9]{4}$`}
          `;

        const nextNumber =
          Number(result[0]?.max_number ?? 0) + 1;

        const contractNumber =
          `CON-${year}-${String(nextNumber).padStart(4, "0")}`;

        const created = await tx.contract.create({
          data: {
            proposalId: proposal.id,
            contractNumber,
            title: proposal.title,
            description: proposal.description,
            status: "DRAFT",
            amount: proposal.amount,
            currency: proposal.currency,
          },
        });

        await tx.activity.create({
          data: {
            organizationId:
              proposal.opportunity.auditRequest.organizationId,
            auditRequestId:
              proposal.opportunity.auditRequest.id,
            type: "PROPOSAL",
            createdByUserId: user.id,
            description:
              `Contract created: ${created.contractNumber}`,
            metadata: {
              contractId: created.id,
              contractNumber: created.contractNumber,
              proposalId: proposal.id,
              proposalNumber: proposal.proposalNumber,
              opportunityId: proposal.opportunityId,
              action: "CONTRACT_CREATED",
              createdByUserId: user.id,
              requestId,
            },
          },
        });

        return created;
      });

    logger.info("Contract created", {
      requestId,
      userId: user.id,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      proposalId: proposal.id,
      proposalNumber: proposal.proposalNumber,
      opportunityId: proposal.opportunityId,
      organizationId:
        proposal.opportunity.auditRequest.organizationId,
    });

    return NextResponse.json(
      {
        success: true,
        contract,
      },
      {
        status: 201,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to create contract", {
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
        message: "Unable to create contract.",
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