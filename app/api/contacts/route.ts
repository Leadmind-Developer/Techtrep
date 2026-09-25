import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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

    const organizationId = getStringValue(
      body.organizationId,
    );

    const name = getStringValue(body.name);
    const email = getStringValue(body.email).toLowerCase();
    const phone = getStringValue(body.phone);
    const role = getStringValue(body.role);

    if (!organizationId) {
      return NextResponse.json(
        {
          error: "Organization is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          error: "Contact name is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (name.length > 200) {
      return NextResponse.json(
        {
          error: "Contact name cannot exceed 200 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error: "Email address is required.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (email.length > 320) {
      return NextResponse.json(
        {
          error: "Email address is too long.",
          requestId,
        },
        { status: 400 },
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (phone.length > 50) {
      return NextResponse.json(
        {
          error: "Phone number cannot exceed 50 characters.",
          requestId,
        },
        { status: 400 },
      );
    }

    if (role.length > 150) {
      return NextResponse.json(
        {
          error: "Role cannot exceed 150 characters.",
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

    const existingContact = await prisma.contact.findFirst({
      where: {
        organizationId,
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingContact) {
      return NextResponse.json(
        {
          error:
            "A contact with this email already exists in this organization.",
          requestId,
        },
        { status: 409 },
      );
    }

    const contact = await prisma.contact.create({
      data: {
        organizationId,
        name,
        email,
        phone: phone || null,
        role: role || null,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info("Contact created", {
      requestId,
      userId: user.id,
      contactId: contact.id,
      organizationId,
    });

    return NextResponse.json(
      {
        contact,
        requestId,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create contact", {
      requestId,
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        error: "Unable to create contact.",
        requestId,
      },
      { status: 500 },
    );
  }
}