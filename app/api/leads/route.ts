import { NextResponse } from "next/server";

import {
  Prisma,
  type LeadSource,
  type LeadStatus,
} from "@/./generated/prisma/client";

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

const LEAD_SOURCES: LeadSource[] = [
  "WEBSITE",
  "AUDIT",
  "REFERRAL",
  "WHATSAPP",
  "EMAIL",
  "PHONE",
  "LINKEDIN",
  "SOCIAL_MEDIA",
  "DIRECT",
  "OTHER",
];

function isLeadStatus(value: unknown): value is LeadStatus {
  return (
    typeof value === "string" &&
    LEAD_STATUSES.includes(value as LeadStatus)
  );
}

function isLeadSource(value: unknown): value is LeadSource {
  return (
    typeof value === "string" &&
    LEAD_SOURCES.includes(value as LeadSource)
  );
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseEstimatedValue(
  value: unknown,
): Prisma.Decimal | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const stringValue = getStringValue(value);

  if (!/^\d+(\.\d{1,2})?$/.test(stringValue)) {
    return null;
  }

  const numericValue = Number(stringValue);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return new Prisma.Decimal(stringValue);
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

    const organizationId = getStringValue(body.organizationId);
    const contactId = getStringValue(body.contactId);
    const notes = getStringValue(body.notes);

    const source = body.source;
    const status = body.status;

    if (!organizationId) {
      return NextResponse.json(
        {
          error: "Organization is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!isLeadSource(source)) {
      return NextResponse.json(
        {
          error: "A valid lead source is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!isLeadStatus(status)) {
      return NextResponse.json(
        {
          error: "A valid lead status is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (notes.length > 5000) {
      return NextResponse.json(
        {
          error: "Notes cannot exceed 5,000 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    const estimatedValue = parseEstimatedValue(
      body.estimatedValue,
    );

    if (
      body.estimatedValue !== null &&
      body.estimatedValue !== undefined &&
      body.estimatedValue !== "" &&
      estimatedValue === null
    ) {
      return NextResponse.json(
        {
          error:
            "Estimated value must be a valid non-negative amount.",
          requestId,
        },
        { status: 400 },
      );
    }

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        {
          error: "Selected organization was not found.",
          requestId,
        },
        { status: 404 },
      );
    }

    let contact: {
      id: string;
      name: string;
      organizationId: string;
    } | null = null;

    if (contactId) {
      contact = await prisma.contact.findUnique({
        where: {
          id: contactId,
        },
        select: {
          id: true,
          name: true,
          organizationId: true,
        },
      });

      if (!contact) {
        return NextResponse.json(
          {
            error: "Selected contact was not found.",
            requestId,
          },
          { status: 404 },
        );
      }

      if (contact.organizationId !== organizationId) {
        return NextResponse.json(
          {
            error:
              "The selected contact does not belong to the selected organization.",
            requestId,
          },
          { status: 400 },
        );
      }
    }

    const lead = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.lead.create({
        data: {
          organizationId,
          contactId: contact?.id ?? null,

          createdByUserId: user.id,
          assignedToUserId: user.id,

          source,
          status,
          estimatedValue,
          notes: notes || null,
        },
        include: {
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
            },
          },
        },
      });

      await tx.leadAssignment.create({
        data: {
          leadId: createdLead.id,
          assignedToUserId: user.id,
          assignedByUserId: user.id,
        },
      });

      await tx.activity.create({
        data: {
          organizationId,
          leadId: createdLead.id,
          createdByUserId: user.id,
          type: "STATUS_CHANGE",
          description: `Lead created with status ${status}.`,
          metadata: {
            source,
            status,
            createdByUserId: user.id,
            requestId,
          },
        },
      });

      return createdLead;
    });    

    logger.info("Lead created", {
      requestId,
      userId: user.id,
      leadId: lead.id,
      organizationId,
    });

    return NextResponse.json(
      {
        lead,
        requestId,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create lead", {
      requestId,
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        error: "Unable to create lead.",
        requestId,
      },
      { status: 500 },
    );
  }
}