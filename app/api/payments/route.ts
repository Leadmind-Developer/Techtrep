import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth/api";
import { logger } from "@/lib/logger";
import { Prisma } from "@/generated/prisma/client";

const paymentMethods = [
  "BANK_TRANSFER",
  "CASH",
  "CARD",
  "POS",
  "USSD",
  "MOBILE_MONEY",
  "CHEQUE",
  "OTHER",
] as const;

type PaymentMethod = (typeof paymentMethods)[number];

function isValidPaymentMethod(
  value: unknown,
): value is PaymentMethod {
  return (
    typeof value === "string" &&
    paymentMethods.includes(value as PaymentMethod)
  );
}

function isValidAmount(value: unknown): value is string | number {
  if (typeof value !== "string" && typeof value !== "number") {
    return false;
  }

  const amount = String(value).trim();

  return /^\d+(\.\d{1,2})?$/.test(amount);
}

function parseDate(
  value: unknown,
): Date | null | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getRemainingBalance(
  invoiceAmount: Prisma.Decimal,
  totalPaid: Prisma.Decimal,
): Prisma.Decimal {
  return invoiceAmount.minus(totalPaid);
}

export async function GET(request: Request) {
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim() || "";
  const invoiceId =
    searchParams.get("invoiceId")?.trim() || "";
  const status =
    searchParams.get("status")?.trim().toUpperCase() || "";

  const validStatuses = [
    "COMPLETED",
    "VOID",
    "REFUNDED",
  ] as const;

  if (
    status &&
    !validStatuses.includes(
      status as (typeof validStatuses)[number],
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid payment status.",
      },
      { status: 400 },
    );
  }

  try {
    const payments = await prisma.payment.findMany({
      where: {
        ...(invoiceId
          ? {
              invoiceId,
            }
          : {}),
        ...(status
          ? {
              status:
                status as (typeof validStatuses)[number],
            }
          : {}),
        ...(search
          ? {
              OR: [
                {
                  paymentNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  reference: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  invoice: {
                    invoiceNumber: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        paidAt: "desc",
      },
      include: {
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
                id: true,
                contractNumber: true,
                title: true,
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
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
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

    logger.info("Payments retrieved", {
      userId: user.id,
      count: payments.length,
    });

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error) {
    logger.error("Failed to retrieve payments", {
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve payments.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();

  if (response) {
    return response;
  }

  try {
    const body = await request.json();

    const invoiceId =
      typeof body.invoiceId === "string"
        ? body.invoiceId.trim()
        : "";

    const paymentMethod =
      typeof body.method === "string"
        ? body.method.trim().toUpperCase()
        : "";

    const reference =
      typeof body.reference === "string"
        ? body.reference.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : "";

    if (!invoiceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidAmount(body.amount)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount must be a positive amount with up to two decimal places.",
        },
        { status: 400 },
      );
    }

    if (!isValidPaymentMethod(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 },
      );
    }

    const amountString = String(body.amount).trim();
    const paymentAmount = new Prisma.Decimal(
      amountString,
    );

    if (paymentAmount.lte(0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment amount must be greater than zero.",
        },
        { status: 400 },
      );
    }

    const paidAt = parseDate(body.paidAt);

    if (paidAt === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment date.",
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const invoice = await tx.invoice.findUnique({
          where: {
            id: invoiceId,
          },
          select: {
            id: true,
            invoiceNumber: true,
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
                            organizationId: true,
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

        if (!invoice) {
          throw new Error("INVOICE_NOT_FOUND");
        }

        if (
          invoice.status === "DRAFT" ||
          invoice.status === "VOID"
        ) {
          throw new Error("INVOICE_NOT_PAYABLE");
        }

        if (invoice.status === "PAID") {
          throw new Error("INVOICE_ALREADY_PAID");
        }

        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtext(${`techtrep:payment-number:${new Date().getFullYear()}`})
          )
        `;

        const paymentNumberRows = await tx.$queryRaw<
          Array<{ paymentNumber: string | null }>
        >`
          SELECT "paymentNumber"
          FROM "payments"
          WHERE "paymentNumber" LIKE ${`PAY-${new Date().getFullYear()}-%`}
          ORDER BY CAST(
            SUBSTRING(
              "paymentNumber"
              FROM '[0-9]+$'
            ) AS INTEGER
          ) DESC
          LIMIT 1
        `;

        const latestPaymentNumber =
          paymentNumberRows[0]?.paymentNumber;

        const latestNumber = latestPaymentNumber
          ? Number(
              latestPaymentNumber.match(/\d+$/)?.[0] ?? 0,
            )
          : 0;

        const paymentNumber = `PAY-${new Date().getFullYear()}-${String(
          latestNumber + 1,
        ).padStart(4, "0")}`;

        const existingPayments =
          await tx.payment.aggregate({
            where: {
              invoiceId: invoice.id,
              status: "COMPLETED",
            },
            _sum: {
              amount: true,
            },
          });

        const currentTotalPaid =
          existingPayments._sum.amount ??
          new Prisma.Decimal(0);

        const currentBalance = getRemainingBalance(
          invoice.amount,
          currentTotalPaid,
        );

        if (paymentAmount.gt(currentBalance)) {
          throw new Error("PAYMENT_EXCEEDS_BALANCE");
        }

        const newTotalPaid =
          currentTotalPaid.plus(paymentAmount);

        const newBalance = getRemainingBalance(
          invoice.amount,
          newTotalPaid,
        );

        const newInvoiceStatus =
          newBalance.eq(0)
            ? "PAID"
            : "PARTIALLY_PAID";

        const payment = await tx.payment.create({
          data: {
            invoiceId: invoice.id,
            paymentNumber,
            amount: paymentAmount,
            currency: invoice.currency,
            method: paymentMethod,
            status: "COMPLETED",
            paidAt: paidAt ?? new Date(),
            reference: reference || null,
            notes: notes || null,
            createdByUserId: user.id,
          },
        });

        const updatedInvoice =
          await tx.invoice.update({
            where: {
              id: invoice.id,
            },
            data: {
              status: newInvoiceStatus,
            },
            select: {
              id: true,
              invoiceNumber: true,
              amount: true,
              currency: true,
              status: true,
            },
          });

        await tx.activity.create({
          data: {
            organizationId:
              invoice.contract.proposal.opportunity
                .auditRequest.organizationId,
            type: "STATUS_CHANGE",
            description: `Payment ${payment.paymentNumber} recorded for invoice ${invoice.invoiceNumber}.`,
            metadata: {
              action: "PAYMENT_CREATED",
              paymentId: payment.id,
              paymentNumber: payment.paymentNumber,
              invoiceId: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              amount: payment.amount.toString(),
              currency: payment.currency,
              method: payment.method,
              previousInvoiceStatus: invoice.status,
              newInvoiceStatus: newInvoiceStatus,
              totalPaid: newTotalPaid.toString(),
              balanceDue: newBalance.toString(),
            },
            createdByUserId: user.id,
          },
        });

        return {
          payment,
          invoice: updatedInvoice,
          totalPaid: newTotalPaid,
          balanceDue: newBalance,
        };
      },
    );

    logger.info("Payment recorded", {
      userId: user.id,
      paymentId: result.payment.id,
      paymentNumber: result.payment.paymentNumber,
      invoiceId: result.invoice.id,
      invoiceNumber: result.invoice.invoiceNumber,
      amount: result.payment.amount.toString(),
      newInvoiceStatus: result.invoice.status,
    });

    return NextResponse.json(
      {
        success: true,
        payment: result.payment,
        invoice: result.invoice,
        financialSummary: {
          invoiceAmount: result.invoice.amount.toString(),
          totalPaid: result.totalPaid.toString(),
          balanceDue: result.balanceDue.toString(),
          currency: result.invoice.currency,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVOICE_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            message: "Invoice not found.",
          },
          { status: 404 },
        );
      }

      if (error.message === "INVOICE_NOT_PAYABLE") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Payments cannot be recorded against a draft or void invoice.",
          },
          { status: 409 },
        );
      }

      if (error.message === "INVOICE_ALREADY_PAID") {
        return NextResponse.json(
          {
            success: false,
            message: "This invoice has already been fully paid.",
          },
          { status: 409 },
        );
      }

      if (error.message === "PAYMENT_EXCEEDS_BALANCE") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Payment amount cannot exceed the outstanding invoice balance.",
          },
          { status: 409 },
        );
      }
    }

    logger.error("Failed to record payment", {
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to record payment.",
      },
      { status: 500 },
    );
  }
}