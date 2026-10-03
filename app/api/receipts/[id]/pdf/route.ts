import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { Prisma } from "@/generated/prisma/client";

import ReceiptPdf from "@/lib/receipt-pdf";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Receipt ID is required.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const receipt = await prisma.receipt.findUnique({
      where: {
        id,
      },
      include: {
        payment: {
          include: {
            invoice: {
              include: {
                contract: {
                  include: {
                    proposal: {
                      include: {
                        opportunity: {
                          include: {
                            auditRequest: {
                              include: {
                                organization: true,
                                contact: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!receipt) {
      return NextResponse.json(
        {
          success: false,
          message: "Receipt not found.",
        },
        {
          status: 404,
        },
      );
    }

    const payment = receipt.payment;
    const invoice = payment.invoice;
    const auditRequest =
      invoice.contract.proposal.opportunity
        .auditRequest;

    const organization =
      auditRequest.organization;

    const contact = auditRequest.contact;

    const completedPayments =
      await prisma.payment.aggregate({
        where: {
          invoiceId: invoice.id,
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
      });

    const totalPaid =
      completedPayments._sum.amount ??
      new Prisma.Decimal(0);

    const balanceDue = new Prisma.Decimal(
      invoice.amount.toString(),
    ).minus(totalPaid);

    const pdf = await renderToBuffer(
  ReceiptPdf({
    receiptNumber: receipt.receiptNumber,
    issuedAt: receipt.issuedAt,
    paymentNumber: payment.paymentNumber,
    paymentDate: payment.paidAt,
    paymentMethod: payment.method,
    paymentReference: payment.reference,
    invoiceNumber: invoice.invoiceNumber,
    invoiceTitle: invoice.title,
    invoiceTotal: invoice.amount.toString(),
    paymentAmount: payment.amount.toString(),
    totalPaid: totalPaid.toString(),
    balanceDue: balanceDue.toString(),
    currency: invoice.currency,
    clientName: contact.name,
    clientEmail: contact.email,
    clientPhone: contact.phone,
    notes: receipt.notes,
  }),
);

    console.info("Receipt PDF generated", {
      receiptId: receipt.id,
      receiptNumber: receipt.receiptNumber,
      paymentId: payment.id,
      userId: user.id,
    });

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${receipt.receiptNumber}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate receipt PDF", {
      receiptId: id,
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate receipt PDF.",
      },
      {
        status: 500,
      },
    );
  }
}