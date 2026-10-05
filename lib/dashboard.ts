import { prisma } from "@/lib/prisma";

export async function getCommercialReportingData() {
  const [
    totalProposals,
    acceptedProposals,
    acceptedProposalValues,
    activePipelineValues,
    activeContracts,
    billingInvoices,
    activeProjects,
    completedProjects,
    projectValues,
  ] = await Promise.all([
    prisma.proposal.count(),

    prisma.proposal.count({
      where: {
        status: "ACCEPTED",
      },
    }),

    prisma.proposal.findMany({
      where: {
        status: "ACCEPTED",
      },
      select: {
        amount: true,
        currency: true,
      },
    }),

    prisma.proposal.findMany({
      where: {
        status: {
          in: ["DRAFT", "SENT"],
        },
      },
      select: {
        amount: true,
        currency: true,
      },
    }),

    prisma.contract.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.invoice.findMany({
      where: {
        status: {
          notIn: ["DRAFT", "VOID"],
        },
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        dueDate: true,
        payments: {
          where: {
            status: "COMPLETED",
          },
          select: {
            amount: true,
            currency: true,
          },
        },
      },
    }),

    prisma.project.count({
      where: {
        status: {
          in: ["PLANNING", "IN_PROGRESS", "ON_HOLD"],
        },
      },
    }),

    prisma.project.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.project.findMany({
      where: {
        status: {
          not: "CANCELLED",
        },
      },
      select: {
        contractValue: true,
        currency: true,
      },
    }),
  ]);

  // Sales: accepted proposal value by currency
  const acceptedValueByCurrency = new Map<string, number>();

  for (const proposal of acceptedProposalValues) {
    if (proposal.amount === null) {
      continue;
    }

    const currency = proposal.currency.toUpperCase();

    const existing =
      acceptedValueByCurrency.get(currency) ?? 0;

    acceptedValueByCurrency.set(
      currency,
      existing + Number(proposal.amount),
    );
  }

  const acceptedProposalCurrencies = Array.from(
    acceptedValueByCurrency.entries(),
  ).map(([currency, value]) => ({
    currency,
    value,
  }));

  // Sales: active pipeline value by currency
  const pipelineValueByCurrency = new Map<string, number>();

  for (const proposal of activePipelineValues) {
    if (proposal.amount === null) {
      continue;
    }

    const currency = proposal.currency.toUpperCase();

    const existing =
      pipelineValueByCurrency.get(currency) ?? 0;

    pipelineValueByCurrency.set(
      currency,
      existing + Number(proposal.amount),
    );
  }

  const pipelineCurrencies = Array.from(
    pipelineValueByCurrency.entries(),
  ).map(([currency, value]) => ({
    currency,
    value,
  }));

  // Billing: invoice and payment values by currency
  const billingByCurrency = new Map<
    string,
    {
      totalInvoiced: number;
      totalPaid: number;
      outstanding: number;
      overdueInvoices: number;
    }
  >();

  for (const invoice of billingInvoices) {
    const currency = invoice.currency.toUpperCase();

    const existing = billingByCurrency.get(currency) ?? {
      totalInvoiced: 0,
      totalPaid: 0,
      outstanding: 0,
      overdueInvoices: 0,
    };

    const invoiceAmount = Number(invoice.amount);

    const paidAmount = invoice.payments
      .filter(
        (payment) =>
          payment.currency.toUpperCase() === currency,
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount),
        0,
      );

    const invoiceOutstanding = Math.max(
      0,
      invoiceAmount - paidAmount,
    );

    existing.totalInvoiced += invoiceAmount;
    existing.totalPaid += paidAmount;
    existing.outstanding += invoiceOutstanding;

    if (
      invoice.status === "OVERDUE" &&
      invoiceOutstanding > 0
    ) {
      existing.overdueInvoices += 1;
    }

    billingByCurrency.set(currency, existing);
  }

  const billingCurrencies = Array.from(
    billingByCurrency.entries(),
  ).map(([currency, values]) => ({
    currency,
    totalInvoiced: values.totalInvoiced,
    totalPaid: values.totalPaid,
    outstanding: values.outstanding,
    overdueInvoices: values.overdueInvoices,
    collectionRate:
      values.totalInvoiced > 0
        ? (values.totalPaid / values.totalInvoiced) * 100
        : 0,
  }));

  // Projects: project value by currency
  const projectValuesByCurrency = new Map<string, number>();

  for (const project of projectValues) {
    if (project.contractValue === null) {
      continue;
    }

    const currency = project.currency.toUpperCase();

    const existing =
      projectValuesByCurrency.get(currency) ?? 0;

    projectValuesByCurrency.set(
      currency,
      existing + Number(project.contractValue),
    );
  }

  const projectCurrencies = Array.from(
    projectValuesByCurrency.entries(),
  ).map(([currency, value]) => ({
    currency,
    value,
  }));

  return {
    sales: {
      totalProposals,
      acceptedProposals,
      acceptedValue: acceptedProposalCurrencies,
      activeContracts,
      pipelineValue: pipelineCurrencies,
    },

    billing: {
      currencies: billingCurrencies,
    },

    projects: {
      activeProjects,
      completedProjects,
      currencies: projectCurrencies,
    },
  };
}

export async function getDashboardData() {
  const [
    totalLeads,
    newLeads,
    activeOpportunities,
    pendingAudits,
    leadPipeline,
    recentActivities,
    recentLeads,
    commercial,
  ] = await Promise.all([
    prisma.lead.count(),

    prisma.lead.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.opportunity.count({
      where: {
        status: {
          in: [
            "IDENTIFIED",
            "DISCUSSED",
            "PROPOSED",
            "APPROVED",
            "IN_PROGRESS",
          ],
        },
      },
    }),

    prisma.auditRequest.count({
      where: {
        status: {
          in: [
            "REQUESTED",
            "CONTACTED",
            "SCHEDULED",
          ],
        },
      },
    }),

    prisma.lead.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
      orderBy: {
        status: "asc",
      },
    }),

    prisma.activity.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        lead: {
          select: {
            id: true,
            status: true,
          },
        },
        auditRequest: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),

    prisma.lead.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      include: {
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
    }),

    getCommercialReportingData(),
  ]);

  return {
    totalLeads,
    newLeads,
    activeOpportunities,
    pendingAudits,
    leadPipeline,
    recentActivities,
    recentLeads,

    sales: commercial.sales,
    billing: commercial.billing,
    projects: commercial.projects,
  };
}
