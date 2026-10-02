import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getRequestId } from "@/lib/api/request";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const invoiceStatuses = [
"DRAFT",
"SENT",
"PARTIALLY_PAID",
"PAID",
"OVERDUE",
"VOID",
] as const;

export async function GET(request: Request) {
const requestId = getRequestId(request);

const auth = await requireApiUser();

if (auth.response) {
return auth.response;
}

try {
const { searchParams } = new URL(request.url);

const search =
  searchParams.get("search")?.trim() ?? "";

const status =
  searchParams.get("status")?.trim() ?? "";

const contractId =
  searchParams.get("contractId")?.trim() ?? "";

if (
  status &&
  !invoiceStatuses.includes(
    status as (typeof invoiceStatuses)[number],
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

const invoices = await prisma.invoice.findMany({
  where: {
    ...(status
      ? {
          status:
            status as (typeof invoiceStatuses)[number],
        }
      : {}),
    ...(contractId
      ? {
          contractId,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              invoiceNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  },
  orderBy: {
    createdAt: "desc",
  },
  select: {
    id: true,
    contractId: true,
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
                      },
                    },
                    contact: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
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

logger.info("Invoices retrieved", {
  requestId,
  userId: auth.user.id,
  count: invoices.length,
  search: search || undefined,
  status: status || undefined,
  contractId: contractId || undefined,
});

return NextResponse.json(
  {
    success: true,
    invoices,
  },
  {
    status: 200,
    headers: {
      "x-request-id": requestId,
    },
  },
);

} catch (error) {
logger.error("Failed to retrieve invoices", {
requestId,
userId: auth.user.id,
error:
error instanceof Error
? error.message
: "Unknown error",
});

return NextResponse.json(
  {
    success: false,
    message: "Unable to retrieve invoices.",
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

export async function POST(request: Request) {
const requestId = getRequestId(request);

const auth = await requireApiUser();

if (auth.response) {
return auth.response;
}

const user = auth.user;

try {
const body = await request.json();

const contractId =
  typeof body.contractId === "string"
    ? body.contractId.trim()
    : "";

const title =
  typeof body.title === "string"
    ? body.title.trim()
    : "";

const description =
  typeof body.description === "string"
    ? body.description.trim()
    : null;

const notes =
  typeof body.notes === "string"
    ? body.notes.trim()
    : null;

const dueDate =
  typeof body.dueDate === "string"
    ? body.dueDate.trim()
    : "";

const amountInput = body.amount;

if (!contractId) {
  return NextResponse.json(
    {
      success: false,
      message: "Contract is required.",
    },
    {
      status: 400,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

if (!title) {
  return NextResponse.json(
    {
      success: false,
      message: "Invoice title is required.",
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
  amountInput !== undefined &&
  amountInput !== null &&
  typeof amountInput !== "string" &&
  typeof amountInput !== "number"
) {
  return NextResponse.json(
    {
      success: false,
      message: "Invoice amount must be a number or numeric string.",
    },
    {
      status: 400,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

let parsedDueDate: Date | null = null;

if (dueDate) {
  parsedDueDate = new Date(dueDate);

  if (Number.isNaN(parsedDueDate.getTime())) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid due date.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }
}

const contract = await prisma.contract.findUnique({
  where: {
    id: contractId,
  },
  select: {
    id: true,
    contractNumber: true,
    title: true,
    description: true,
    status: true,
    amount: true,
    currency: true,
    proposal: {
      select: {
        id: true,
        proposalNumber: true,
        opportunityId: true,
        opportunity: {
          select: {
            id: true,
            auditRequest: {
              select: {
                id: true,
                organizationId: true,
              },
            },
          },
        },
      },
    },
  },
});

if (!contract) {
  return NextResponse.json(
    {
      success: false,
      message: "Contract not found.",
    },
    {
      status: 404,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

if (contract.status !== "ACTIVE") {
  return NextResponse.json(
    {
      success: false,
      message:
        "An invoice can only be created for an active contract.",
    },
    {
      status: 409,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

let amount: string | null =
    contract.amount !== null
        ? String(contract.amount)
        : null;

if (
  amountInput !== undefined &&
  amountInput !== null &&
  String(amountInput).trim() !== ""
) {
  const amountString = String(amountInput).trim();

  if (!/^\d+(\.\d{1,2})?$/.test(amountString)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invoice amount must be a positive amount with up to two decimal places.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  if (Number(amountString) <= 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Invoice amount must be greater than zero.",
      },
      {
        status: 400,
        headers: {
          "x-request-id": requestId,
        },
      },
    );
  }

  amount = amountString;
}

if (amount === null) {
  return NextResponse.json(
    {
      success: false,
      message:
        "The contract does not have an amount. An invoice amount is required.",
    },
    {
      status: 400,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

const year = new Date().getFullYear();

const invoice = await prisma.$transaction(async (tx) => {
  /*
   * Serialize invoice-number generation for the current
   * year so concurrent requests cannot receive the same
   * invoice number.
   */
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtext(${`techtrep:invoice-number:${year}`})
    )
  `;

  const result =
    await tx.$queryRaw<
      Array<{ max_number: number | null }>
    >`
      SELECT MAX(
        CAST(
          SUBSTRING(
            "invoiceNumber"
            FROM ${`^INV-${year}-([0-9]+)$`}
          ) AS INTEGER
        )
      ) AS max_number
      FROM "invoices"
      WHERE "invoiceNumber" ~ ${`^INV-${year}-[0-9]{4}$`}
    `;

  const nextNumber =
    Number(result[0]?.max_number ?? 0) + 1;

  const invoiceNumber =
    `INV-${year}-${String(nextNumber).padStart(4, "0")}`;

  const created = await tx.invoice.create({
    data: {
      contractId: contract.id,
      invoiceNumber,
      title,
      description,
      amount,
      currency: contract.currency,
      status: "DRAFT",
      issuedAt: new Date(),
      dueDate: parsedDueDate,
      notes,
    },
  });

  await tx.activity.create({
    data: {
      organizationId:
        contract.proposal.opportunity.auditRequest
          .organizationId,
      auditRequestId:
        contract.proposal.opportunity.auditRequest.id,
      type: "PROPOSAL",
      createdByUserId: user.id,
      description:
        `Invoice created: ${created.invoiceNumber}`,
      metadata: {
        invoiceId: created.id,
        invoiceNumber: created.invoiceNumber,
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        proposalId: contract.proposal.id,
        proposalNumber:
          contract.proposal.proposalNumber,
        opportunityId:
          contract.proposal.opportunityId,
        action: "INVOICE_CREATED",
        createdByUserId: user.id,
        requestId,
      },
    },
  });

  return created;
});

logger.info("Invoice created", {
  requestId,
  userId: user.id,
  invoiceId: invoice.id,
  invoiceNumber: invoice.invoiceNumber,
  contractId: contract.id,
  contractNumber: contract.contractNumber,
  proposalId: contract.proposal.id,
  proposalNumber: contract.proposal.proposalNumber,
  opportunityId: contract.proposal.opportunityId,
  organizationId:
    contract.proposal.opportunity.auditRequest
      .organizationId,
});

return NextResponse.json(
  {
    success: true,
    invoice,
  },
  {
    status: 201,
    headers: {
      "x-request-id": requestId,
    },
  },
);

} catch (error) {
logger.error("Failed to create invoice", {
requestId,
userId: user.id,
error:
error instanceof Error
? error.message
: "Unknown error",
});

return NextResponse.json(
  {
    success: false,
    message: "Unable to create invoice.",
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

