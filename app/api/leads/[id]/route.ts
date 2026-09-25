import { NextResponse } from "next/server";

import type { LeadStatus } from "@/./generated/prisma/client";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DISCOVERY",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

function isLeadStatus(value: unknown): value is LeadStatus {
  return (
    typeof value === "string" &&
    LEAD_STATUSES.includes(value as LeadStatus)
  );
}

type LeadRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: LeadRouteProps,
) {
  const requestId = getRequestId(request);

  const auth = await requireApiUser();

  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;
  const { id: leadId } = await params;

  try {
    const body = await request.json();
    const status = body.status;

    if (!isLeadStatus(status)) {
      return NextResponse.json(
        {
          error: "A valid lead status is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
        organizationId: true,
        status: true,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          error: "Lead not found.",
          requestId,
        },
        { status: 404 },
      );
    }

    if (existingLead.status === status) {
      return NextResponse.json({
        lead: existingLead,
        changed: false,
        requestId,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({
        where: {
          id: leadId,
        },
        data: {
          status,
        },
        select: {
          id: true,
          organizationId: true,
          status: true,
          source: true,
          estimatedValue: true,
          notes: true,
          updatedAt: true,
        },
      });

      await tx.activity.create({
        data: {
          organizationId: existingLead.organizationId,
          leadId: existingLead.id,
          type: "STATUS_CHANGE",
          description: `Lead status changed from ${existingLead.status} to ${status}.`,
          metadata: {
            previousStatus: existingLead.status,
            newStatus: status,
            changedByUserId: user.id,
            requestId,
          },
        },
      });

      return lead;
    });

    logger.info("Lead status changed", {
      requestId,
      userId: user.id,
      leadId,
      previousStatus: existingLead.status,
      newStatus: status,
    });

    return NextResponse.json({
      lead: result,
      changed: true,
      requestId,
    });
  } catch (error) {
    logger.error("Failed to change lead status", {
      requestId,
      userId: user.id,
      leadId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        error: "Unable to change lead status.",
        requestId,
      },
      { status: 500 },
    );
  }
}
