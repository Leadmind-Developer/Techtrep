import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth/api";

const RECEIPT_NUMBER_PREFIX = "RCT";

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const body = await request.json();

    const paymentId =
      typeof body.paymentId === "string"
        ? body.paymentId.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : "";

    const issuedAt =
      body.issuedAt === undefined ||
      body.issuedAt === null ||
      body.issuedAt === ""
        ? null
        : isValidDate(body.issuedAt)
          ? new Date(body.issuedAt)
          : null;

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.issuedAt !== undefined &&
      body.issuedAt !== null &&
      body.issuedAt !== "" &&
      !issuedAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid receipt issue date.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: {
          id: paymentId,
        },
        select: {
          id: true,
          paymentNumber: true,
          amount: true,
          currency: true,
          method: true,
          status: true,
          paidAt: true,
          reference: true,
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              title: true,
              amount: true,
              currency: true,
              status: true,
              contract: {
                select: {
                  proposal: {
                    select: {
                      opportunity: {
                        select: {
                          auditRequest: {
                            select: {
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
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          receipt: {
            select: {
              id: true,
              receiptNumber: true,
              issuedAt: true,
            },
          },
        },
      });

      if (!payment) {
        return {
          error: "PAYMENT_NOT_FOUND" as const,
        };
      }

      if (payment.status !== "COMPLETED") {
        return {
          error: "PAYMENT_NOT_COMPLETED" as const,
        };
      }

      if (payment.receipt) {
        return {
          error: "RECEIPT_EXISTS" as const,
          receipt: payment.receipt,
        };
      }

      const year = new Date().getFullYear();

      /*
       * Serialize receipt-number generation for the current year.
       */
      await tx.$queryRaw`
        WITH receipt_lock AS (
          SELECT pg_advisory_xact_lock(
            hashtext(${`techtrep:receipt-number:${year}`})
          )
        )
        SELECT 1;
      `;

      const prefix = `${RECEIPT_NUMBER_PREFIX}-${year}-`;

      const lastReceipt = await tx.receipt.findFirst({
        where: {
          receiptNumber: {
            startsWith: prefix,
          },
        },
        orderBy: {
          receiptNumber: "desc",
        },
        select: {
          receiptNumber: true,
        },
      });

      const lastSequence = lastReceipt
        ? Number(
            lastReceipt.receiptNumber.slice(
              prefix.length,
            ),
          )
        : 0;

      const receiptNumber = `${prefix}${String(
        lastSequence + 1,
      ).padStart(4, "0")}`;

      const receipt = await tx.receipt.create({
        data: {
          paymentId: payment.id,
          receiptNumber,
          issuedAt: issuedAt ?? new Date(),
          notes: notes || null,
        },
        select: {
          id: true,
          receiptNumber: true,
          issuedAt: true,
          notes: true,
          paymentId: true,
        },
      });

      return {
        receipt,
        payment,
      };
    });

    if (result.error === "PAYMENT_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result.error === "PAYMENT_NOT_COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "A receipt can only be generated for a completed payment.",
        },
        {
          status: 409,
        },
      );
    }

    if (result.error === "RECEIPT_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          message: "A receipt already exists for this payment.",
          receipt: result.receipt,
        },
        {
          status: 409,
        },
      );
    }

    console.info("Receipt created", {
      requestUserId: user.id,
      receiptId: result.receipt.id,
      receiptNumber: result.receipt.receiptNumber,
      paymentId: result.payment.id,
      paymentNumber: result.payment.paymentNumber,
    });

    return NextResponse.json(
      {
        success: true,
        receipt: result.receipt,
        payment: {
          id: result.payment.id,
          paymentNumber: result.payment.paymentNumber,
          amount: result.payment.amount.toString(),
          currency: result.payment.currency,
          method: result.payment.method,
          paidAt: result.payment.paidAt,
          reference: result.payment.reference,
          invoice: {
            id: result.payment.invoice.id,
            invoiceNumber:
              result.payment.invoice.invoiceNumber,
            title: result.payment.invoice.title,
          },
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to create receipt", {
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create receipt.",
      },
      {
        status: 500,
      },
    );
  }
}