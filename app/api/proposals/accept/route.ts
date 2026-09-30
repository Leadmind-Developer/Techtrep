import { NextResponse } from "next/server";

import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function POST(
request: Request,
) {
const requestId =
getRequestId(request);

try {
const body = await request.json();

const token =
  typeof body.token === "string"
    ? body.token.trim()
    : "";

if (!token) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Proposal token is required.",
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
      publicToken: token,
    },
    select: {
      id: true,
      proposalNumber: true,
      title: true,
      status: true,
      validUntil: true,
      acceptedAt: true,
      opportunity: {
        select: {
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
      message:
        "Proposal not found.",
    },
    {
      status: 404,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

/*
 * Idempotent acceptance:
 * if the proposal was already accepted,
 * treat the request as successful.
 */
if (proposal.status === "ACCEPTED") {
  return NextResponse.json(
    {
      success: true,
      message:
        "Proposal has already been accepted.",
      proposal: {
        id: proposal.id,
        proposalNumber:
          proposal.proposalNumber,
        status: "ACCEPTED",
        acceptedAt:
          proposal.acceptedAt,
      },
    },
    {
      status: 200,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

if (proposal.status !== "SENT") {
  return NextResponse.json(
    {
      success: false,
      message:
        "This proposal is not available for acceptance.",
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
  proposal.validUntil &&
  proposal.validUntil.getTime() < Date.now()
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "This proposal has expired and can no longer be accepted.",
    },
    {
      status: 400,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

const acceptedAt = new Date();

const result =
  await prisma.$transaction(
    async (tx) => {
      /*
       * Conditional update prevents two simultaneous
       * acceptance requests from both creating
       * acceptance activities.
       */
      const updated =
        await tx.proposal.updateMany({
          where: {
            id: proposal.id,
            status: "SENT",
          },
          data: {
            status: "ACCEPTED",
            acceptedAt,
          },
        });

      if (updated.count === 0) {
        const current =
          await tx.proposal.findUnique({
            where: {
              id: proposal.id,
            },
            select: {
              status: true,
              acceptedAt: true,
            },
          });

        return {
          accepted: false,
          alreadyAccepted:
            current?.status ===
            "ACCEPTED",
          acceptedAt:
            current?.acceptedAt ??
            null,
        };
      }

      await tx.activity.create({
        data: {
          organizationId:
            proposal.opportunity
              .auditRequest
              .organizationId,
          auditRequestId:
            proposal.opportunity
              .auditRequest
              .id,
          type: "PROPOSAL",
          description:
            `Proposal accepted by client: ${proposal.title}`,
          metadata: {
            proposalId:
              proposal.id,
            proposalNumber:
              proposal.proposalNumber,
            action:
              "PROPOSAL_ACCEPTED",
            acceptanceSource:
              "PUBLIC_PROPOSAL",
            acceptedAt:
              acceptedAt.toISOString(),
            requestId,
          },
        },
      });

      return {
        accepted: true,
        alreadyAccepted: false,
        acceptedAt,
      };
    },
  );

if (!result.accepted) {
  if (result.alreadyAccepted) {
    return NextResponse.json(
      {
        success: true,
        message:
          "Proposal has already been accepted.",
        proposal: {
          id: proposal.id,
          proposalNumber:
            proposal.proposalNumber,
          status: "ACCEPTED",
          acceptedAt:
            result.acceptedAt,
        },
      },
      {
        status: 200,
        headers: {
          "x-request-id":
            requestId,
        },
      },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message:
        "Unable to accept the proposal.",
    },
    {
      status: 409,
      headers: {
        "x-request-id":
          requestId,
      },
    },
  );
}

logger.info(
  "Proposal accepted",
  {
    requestId,
    proposalId:
      proposal.id,
    proposalNumber:
      proposal.proposalNumber,
    acceptanceSource:
      "PUBLIC_PROPOSAL",
  },
);

return NextResponse.json(
  {
    success: true,
    message:
      "Proposal accepted successfully.",
    proposal: {
      id: proposal.id,
      proposalNumber:
        proposal.proposalNumber,
      status: "ACCEPTED",
      acceptedAt,
    },
  },
  {
    status: 200,
    headers: {
      "x-request-id":
        requestId,
    },
  },
);

} catch (error) {
logger.error(
"Failed to accept proposal",
{
requestId,
error:
error instanceof Error
? error.message
: "Unknown error",
},
);

return NextResponse.json(
  {
    success: false,
    message:
      "Unable to process proposal acceptance.",
  },
  {
    status: 500,
    headers: {
      "x-request-id":
        requestId,
    },
  },
);

}
}
