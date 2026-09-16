import { NextResponse } from "next/server";

type AuditPayload = {
  fullName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  improvements?: string[];
  manualWork?: string;
  existingSystems?: string;
  additionalInformation?: string;
};

function clean(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuditPayload;

    const fullName = clean(body.fullName);
    const businessName = clean(body.businessName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const industry = clean(body.industry);
    const companySize = clean(body.companySize);
    const manualWork = clean(body.manualWork);

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
          message: "Please complete all required fields.",
        },
        { status: 400 },
      );
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        {
          message: "Please provide a valid email address.",
        },
        { status: 400 },
      );
    }

    /*
     * V1:
     * Persistence and notification adapters will be added here.
     *
     * Recommended flow:
     *
     * 1. Save lead
     * 2. Send internal notification
     * 3. Send customer confirmation
     * 4. Create CRM record
     */

    console.log("Technology Audit Request", {
      fullName,
      businessName,
      email,
      phone,
      website: clean(body.website),
      industry,
      companySize,
      improvements: body.improvements ?? [],
      manualWork,
      existingSystems: clean(body.existingSystems),
      additionalInformation: clean(body.additionalInformation),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your Technology Audit request has been received.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Unable to process your request right now.",
      },
      { status: 500 },
    );
  }
}
