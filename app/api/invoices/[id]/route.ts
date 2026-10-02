import { NextResponse } from "next/server";

import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth/api";

const invoiceStatuses = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "VOID",
] as const;

type InvoiceStatus = (typeof invoiceStatuses)[number];

const allowedTransitions: Record<
  InvoiceStatus,
  InvoiceStatus[]
> = {
  DRAFT: ["SENT", "VOID"],
  SENT: ["OVERDUE", "VOID"],
  PARTIALLY_PAID: [],
  PAID: [],
  OVERDUE: [],
  VOID: [],
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Props,
) {
  const requestId = getRequestId(request);

  try {
    const { user, response } = await requireApiUser();

    if (response) {
      return response;
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        invoiceNumber: true,
        title: true,
        description: true,
        amount: true,
        currency: true,
        status: true,
        issuedAt: true,
        dueDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        contract: {
          select: {
            id: true,
            contractNumber: true,
            title: true,
            status: true,
            proposal: {
              select: {
                id: true,
                proposalNumber: true,
                title: true,
                opportunity: {
                  select: {
                    id: true,
                    name: true,
                    auditRequest: {
                      select: {
                        id: true,
                        organization: {
                          select: {
                            id: true,
                            name: true,
                            website: true,
                            industry: true,
                            companySize: true,
                          },
                        },
                        contact: {
                          select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            role: true,
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

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    logger.info("Invoice retrieved", {
      requestId,
      userId: user.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
    });

    return NextResponse.json(
      {
        success: true,
        invoice,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to retrieve invoice", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve invoice.",
      },
      {
        status: 500,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: Props,
) {
  const requestId = getRequestId(request);

  try {
    const { user, response } = await requireApiUser();

    if (response) {
      return response;
    }

    const { id } = await params;

    const body = await request.json();

    const status =
      typeof body.status === "string"
        ? body.status.trim().toUpperCase()
        : "";

    if (
      !invoiceStatuses.includes(
        status as InvoiceStatus,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid invoice status.",
        },
        {
          status: 400,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const nextStatus = status as InvoiceStatus;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        dueDate: true,
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
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found.",
        },
        {
          status: 404,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    if (invoice.status === nextStatus) {
      return NextResponse.json(
        {
          success: true,
          invoice,
        },
        {
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const allowedNextStatuses =
      allowedTransitions[invoice.status as InvoiceStatus];

    if (!allowedNextStatuses.includes(nextStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invoice cannot move from ${invoice.status} to ${nextStatus}.`,
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    /*
     * Payment-derived statuses are controlled by the
     * payment workflow rather than manually from the
     * invoice screen.
     */
    if (
      nextStatus === "PARTIALLY_PAID" ||
      nextStatus === "PAID"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment-related invoice statuses are managed through the payment workflow.",
        },
        {
          status: 409,
          headers: {
            "x-request-id": requestId,
          },
        },
      );
    }

    const updatedInvoice = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.invoice.update({
          where: {
            id,
          },
          data: {
            status: nextStatus,
          },
          select: {
            id: true,
            invoiceNumber: true,
            title: true,
            amount: true,
            currency: true,
            status: true,
            issuedAt: true,
            dueDate: true,
            updatedAt: true,
          },
        });

        await tx.activity.create({
          data: {
            organizationId:
              invoice.contract.proposal.opportunity
                .auditRequest.organizationId,
            type: "PROPOSAL",
            description: `Invoice ${updated.invoiceNumber} status changed from ${invoice.status} to ${nextStatus}.`,
            metadata: {
              action: "INVOICE_STATUS_CHANGED",
              invoiceId: updated.id,
              invoiceNumber: updated.invoiceNumber,
              previousStatus: invoice.status,
              newStatus: nextStatus,
            },
            createdByUserId: user.id,
          },
        });

        return updated;
      },
    );

    /*
     * The Activity record above is the business audit trail
     * for this invoice status transition. We only use the
     * application's existing audit action vocabulary here.
     *
     * Do not add a new AuditAction enum value as part of this
     * milestone.
     */    

    logger.info("Invoice status updated", {
      requestId,
      userId: user.id,
      invoiceId: updatedInvoice.id,
      invoiceNumber: updatedInvoice.invoiceNumber,
      previousStatus: invoice.status,
      newStatus: nextStatus,
    });

    return NextResponse.json(
      {
        success: true,
        invoice: updatedInvoice,
      },
      {
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    logger.error("Failed to update invoice", {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update invoice.",
      },
      {
        status: 500,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }
}