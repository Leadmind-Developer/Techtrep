import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getRequestId } from "@/lib/api/request";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Contact ID is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON request body.",
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
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  const payload = body as Record<string, unknown>;

  const organizationId =
    typeof payload.organizationId === "string"
      ? payload.organizationId.trim()
      : "";

  const name =
    typeof payload.name === "string"
      ? payload.name.trim()
      : "";

  const email =
    typeof payload.email === "string"
      ? payload.email.trim().toLowerCase()
      : "";

  const phone =
    typeof payload.phone === "string"
      ? payload.phone.trim()
      : "";

  const role =
    typeof payload.role === "string"
      ? payload.role.trim()
      : "";

  if (!organizationId) {
    return NextResponse.json(
      {
        success: false,
        message: "Organization is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (!name) {
    return NextResponse.json(
      {
        success: false,
        message: "Contact name is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (name.length > 200) {
    return NextResponse.json(
      {
        success: false,
        message: "Contact name must not exceed 200 characters.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "Email address is required.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (email.length > 320 || !isValidEmail(email)) {
    return NextResponse.json(
      {
        success: false,
        message: "Please provide a valid email address.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (phone.length > 50) {
    return NextResponse.json(
      {
        success: false,
        message: "Phone number must not exceed 50 characters.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (role.length > 150) {
    return NextResponse.json(
      {
        success: false,
        message: "Role must not exceed 150 characters.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  const existingContact = await prisma.contact.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      organizationId: true,
    },
  });

  if (!existingContact) {
    return NextResponse.json(
      {
        success: false,
        message: "Contact not found.",
      },
      {
        status: 404,
        headers: {
          "x-request-id": requestId,
        },
      },
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
        success: false,
        message: "Organization not found.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  const duplicate = await prisma.contact.findFirst({
    where: {
      organizationId,
      email,
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
        message:
          "A contact with this email already exists in this organization.",
      },
      {
        status: 409,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  const contact = await prisma.contact.update({
    where: {
      id,
    },
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

  logger.info("Contact updated", {
    requestId,
    userId: user.id,
    contactId: contact.id,
    organizationId: contact.organizationId,
    organizationChanged:
      existingContact.organizationId !== contact.organizationId,
  });

  return NextResponse.json(
    {
      success: true,
      contact,
    },
    {
      status: 200,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}