import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidWebsite(value: string): boolean {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`,
    );

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeWebsite(value: string): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;

  return normalized.replace(/\/+$/, "");
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

    const name = getStringValue(body.name);
    const website = getStringValue(body.website);
    const industry = getStringValue(body.industry);
    const companySize = getStringValue(body.companySize);

    if (!name) {
      return NextResponse.json(
        {
          error: "Organization name is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (name.length > 200) {
      return NextResponse.json(
        {
          error: "Organization name cannot exceed 200 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (website.length > 500) {
      return NextResponse.json(
        {
          error: "Website cannot exceed 500 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (industry.length > 100) {
      return NextResponse.json(
        {
          error: "Industry cannot exceed 100 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (companySize.length > 100) {
      return NextResponse.json(
        {
          error: "Company size cannot exceed 100 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!isValidWebsite(website)) {
      return NextResponse.json(
        {
          error: "Please enter a valid website address.",
          requestId,
        },
        { status: 400 },
      );
    }

    const normalizedWebsite = normalizeWebsite(website);

    const organization = await prisma.organization.create({
      data: {
        name,
        website: normalizedWebsite,
        industry: industry || null,
        companySize: companySize || null,
      },
      select: {
        id: true,
        name: true,
        website: true,
        industry: true,
        companySize: true,
        createdAt: true,
      },
    });

    logger.info("Organization created", {
      requestId,
      userId: user.id,
      organizationId: organization.id,
    });

    return NextResponse.json(
      {
        organization,
        requestId,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create organization", {
      requestId,
      userId: user.id,
      error:
        error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        error: "Unable to create organization.",
        requestId,
      },
      { status: 500 },
    );
  }
}