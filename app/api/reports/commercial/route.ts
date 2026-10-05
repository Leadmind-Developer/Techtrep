import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getCommercialReportingData } from "@/lib/dashboard";
import { logger } from "@/lib/logger";

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export async function GET() {
  const { response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const report = await getCommercialReportingData();

    const rows: Array<
      [string, string, string, string | number]
    > = [
      ["Sales", "Total Proposals", "", report.sales.totalProposals],
      [
        "Sales",
        "Accepted Proposals",
        "",
        report.sales.acceptedProposals,
      ],
      
      [
        "Sales",
        "Active Contracts",
        "",
        report.sales.activeContracts,
      ],      
      
      [
        "Projects",
        "Active Projects",
        "",
        report.projects.activeProjects,
      ],      
      [
        "Projects",
        "Completed Projects",
        "",
        report.projects.completedProjects,
      ],     
    ];

    for (const item of report.sales.acceptedValue) {
      rows.push([
        "Sales",
        "Accepted Value",
        item.currency,
        item.value,
      ]);
    }

    for (const item of report.sales.pipelineValue) {
      rows.push([
        "Sales",
        "Active Pipeline",
        item.currency,
        item.value,
      ]);
    }

    for (const item of report.billing.currencies) {
      rows.push([
        "Billing",
        "Total Invoiced",
        item.currency,
        item.totalInvoiced,
      ]);

      rows.push([
        "Billing",
        "Total Paid",
        item.currency,
        item.totalPaid,
      ]);

      rows.push([
        "Billing",
        "Outstanding",
        item.currency,
        item.outstanding,
      ]);

      rows.push([
        "Billing",
        "Overdue Invoices",
        item.currency,
        item.overdueInvoices,
      ]);

      rows.push([
        "Billing",
        "Collection Rate",
        item.currency,
        Number(item.collectionRate.toFixed(2)),
      ]);
    }

    for (const item of report.projects.currencies) {
      rows.push([
        "Projects",
        "Project Value",
        item.currency,
        item.value,
      ]);
    }

    const csvRows = [
      [
        "Section",
        "Metric",
        "Currency",
        "Value",
      ],
      ...rows,
    ];

    const csv = csvRows
      .map((row) =>
        row
          .map((value) => escapeCsvValue(value))
          .join(","),
      )
      .join("\r\n");

    const date = new Date()
      .toISOString()
      .slice(0, 10);

    return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
        "Content-Type":
          "text/csv; charset=utf-8",
        "Content-Disposition":
          `attachment; filename="techtrep-commercial-report-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error(
      "Commercial report generation failed",
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
          "Unable to generate commercial report.",
      },
      {
        status: 500,
      },
    );
  }
}