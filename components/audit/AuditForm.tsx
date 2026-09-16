import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      businessName,
      email,
      phone,
      website,
      industry,
      companySize,
      improvements,
      manualWork,
      existingSystems,
      additionalInformation,
      consent,
    } = body;

    if (
      !fullName ||
      !businessName ||
      !email ||
      !phone ||
      !industry ||
      !companySize ||
      !manualWork
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          success: false,
          message: "Please confirm that we may contact you about the audit.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await prisma.$transaction(async (tx) => {
      let organization = await tx.organization.findFirst({
        where: {
          name: {
            equals: businessName.trim(),
            mode: "insensitive",
          },
        },
      });

      if (!organization) {
        organization = await tx.organization.create({
          data: {
            name: businessName.trim(),
            website: website?.trim() || null,
            industry,
            companySize,
          },
        });
      } else {
        organization = await tx.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            website: website?.trim() || organization.website,
            industry: industry || organization.industry,
            companySize: companySize || organization.companySize,
          },
        });
      }

      let contact = await tx.contact.findFirst({
        where: {
          organizationId: organization.id,
          email: normalizedEmail,
        },
      });

      if (!contact) {
        contact = await tx.contact.create({
          data: {
            organizationId: organization.id,
            name: fullName.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
          },
        });
      } else {
        contact = await tx.contact.update({
          where: {
            id: contact.id,
          },
          data: {
            name: fullName.trim(),
            phone: phone.trim(),
          },
        });
      }

      const lead = await tx.lead.create({
        data: {
          organizationId: organization.id,
          contactId: contact.id,
          status: "NEW",
          source: "AUDIT",
        },
      });

      const auditRequest = await tx.auditRequest.create({
        data: {
          organizationId: organization.id,
          contactId: contact.id,
          leadId: lead.id,

          improvements: Array.isArray(improvements)
            ? improvements
            : [],

          manualWork: manualWork.trim(),

          existingSystems:
            existingSystems?.trim() || null,

          additionalInformation:
            additionalInformation?.trim() || null,

          status: "REQUESTED",
          source: "AUDIT",
        },
      });

      await tx.activity.create({
        data: {
          organizationId: organization.id,
          leadId: lead.id,
          auditRequestId: auditRequest.id,
          type: "AUDIT",
          description: "Free Technology Audit requested through website.",
          metadata: {
            website: website?.trim() || null,
            industry,
            companySize,
          },
        },
      });

      return {
        organization,
        contact,
        lead,
        auditRequest,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your Technology Audit request has been received.",
        auditRequestId: result.auditRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Audit request error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while submitting your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
