import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import ProposalPdf from "@/lib/proposal-pdf";
import { getRequestId } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { getProposalById } from "@/lib/proposals";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return null;
  }

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
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

    const result = await getProposalById(id);

    if (!result?.proposal) {
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

    const proposal = result.proposal;

    const auditRequest =
      proposal.opportunity.auditRequest;

    const buffer = await renderToBuffer(
      <ProposalPdf
        proposalNumber={proposal.proposalNumber}
        title={proposal.title}
        description={proposal.description}
        amount={
          proposal.amount !== null
            ? proposal.amount.toString()
            : null
        }
        currency={proposal.currency}
        status={proposal.status}
        validUntil={formatDate(
          proposal.validUntil,
        )}
        organizationName={
          auditRequest?.organization?.name ??
          "Client"
        }
        contactName={
          auditRequest?.contact?.name ??
          "Client Contact"
        }
        contactEmail={
          auditRequest?.contact?.email ?? null
        }
      />,
    );

    const pdfData = new Uint8Array(buffer);

    const filename =
      `${proposal.proposalNumber}.pdf`;

    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="${filename}"`,
        "Content-Length": String(pdfData.byteLength),
        "Cache-Control":
          "private, no-store, max-age=0",
        "x-request-id": requestId,
      },
    });
  } catch (error) {
    logger.error("Failed to generate proposal PDF", {
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
          "Unable to generate the proposal PDF.",
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