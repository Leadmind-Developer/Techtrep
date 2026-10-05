import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { requireApiUser } from "@/lib/auth/api";
import { getCommercialReportingData } from "@/lib/dashboard";
import { CommercialReportPdf } from "@/lib/commercial-report-pdf";
import { logger } from "@/lib/logger";

export async function GET() {
  const { response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const report = await getCommercialReportingData();

    const reportDate = new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Lagos",
      },
    ).format(new Date());

    const pdfBuffer = await renderToBuffer(
      CommercialReportPdf({
        report,
        reportDate,
      }),
    );

    const date = new Date()
      .toISOString()
      .slice(0, 10);

    return new NextResponse(
        new Uint8Array(pdfBuffer),
      {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="techtrep-commercial-report-${date}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error(
      "Commercial PDF report generation failed",
      {
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
          "Unable to generate commercial PDF report.",
      },
      {
        status: 500,
      },
    );
  }
}