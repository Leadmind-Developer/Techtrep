import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { sendProposalEmail } from "@/lib/email";

type ProposalSendRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatProposalDate(
  value: Date | null,
): string | null {
  if (!value) {
    return null;
  }

  return value.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAmount(
  amount: unknown,
): string | null {
  if (amount === null || amount === undefined) {
    return null;
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return null;
  }

  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export async function POST(
  request: Request,
  { params }: ProposalSendRouteProps,
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
    const proposal =
      await prisma.proposal.findUnique({
        where: {
          id,
        },
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
          publicToken: true,

          opportunity: {
            select: {
              auditRequest: {
                select: {
                  id: true,
                  organizationId: true,

                  organization: {
                    select: {
                      name: true,
                    },
                  },

                  contact: {
                    select: {
                      name: true,
                      email: true,
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

    if (proposal.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only draft proposals can be sent.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const contact =
      proposal.opportunity.auditRequest.contact;

    if (!contact.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The proposal contact does not have an email address.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.APP_URL;

    if (!appUrl) {
      logger.error(
        "Proposal send failed: application URL is not configured",
        {
          requestId,
          userId: user.id,
          proposalId: proposal.id,
        },
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Application URL is not configured.",
        },
        {
          status: 500,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const publicToken =
      proposal.publicToken ??
      randomBytes(32).toString("hex");

    const proposalUrl =
      `${appUrl.replace(/\/$/, "")}/proposal/${publicToken}`;

    await sendProposalEmail({
      proposalNumber:
        proposal.proposalNumber,
      title: proposal.title,
      description:
        proposal.description,
      amount:
        formatAmount(proposal.amount),
      currency:
        proposal.currency,
      validUntil:
        formatProposalDate(
          proposal.validUntil,
        ),
      recipientName:
        contact.name,
      recipientEmail:
        contact.email,
      organizationName:
        proposal.opportunity.auditRequest
          .organization.name,
      proposalUrl,
    });

    const sentAt = new Date();

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const updatedProposal =
            await tx.proposal.update({
              where: {
                id: proposal.id,
              },
              data: {
                status: "SENT",
                sentAt,
                publicToken,
                publicTokenCreatedAt:
                  proposal.publicToken
                    ? undefined
                    : sentAt,
              },
            });

          await tx.activity.create({
            data: {
              organizationId:
                proposal.opportunity
                  .auditRequest
                  .organizationId,
              auditRequestId:
                proposal.opportunity
                  .auditRequest.id,
              type: "PROPOSAL",
              createdByUserId: user.id,
              description:
                `Proposal sent: ${updatedProposal.title}`,
              metadata: {
                proposalId:
                  updatedProposal.id,
                proposalNumber:
                  updatedProposal.proposalNumber,
                action: "PROPOSAL_SENT",
                recipientEmail:
                  contact.email,
                sentAt:
                  sentAt.toISOString(),
                sentByUserId: user.id,
                requestId,
              },
            },
          });

          return updatedProposal;
        },
      );

    logger.info("Proposal sent", {
      requestId,
      userId: user.id,
      proposalId: updated.id,
      proposalNumber:
        updated.proposalNumber,
      recipientEmail: contact.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Proposal sent successfully.",
        proposal: {
          id: updated.id,
          proposalNumber:
            updated.proposalNumber,
          status: updated.status,
          sentAt: updated.sentAt,
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
    logger.error("Failed to send proposal", {
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
        message:
          "Unable to send proposal.",
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