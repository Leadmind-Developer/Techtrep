import { prisma } from "@/lib/prisma";

import type {
  Prisma,
  ProposalStatus,
} from "../generated/prisma/client";

export const PROPOSAL_PAGE_SIZE = 10;

export type ProposalListFilters = {
  search?: string;
  status?: ProposalStatus;
  opportunityId?: string;
  page?: number;
};

export async function getProposals(
  filters: ProposalListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const opportunityId =
    filters.opportunityId?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.ProposalWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (opportunityId) {
    where.opportunityId = opportunityId;
  }

  if (search) {
    where.OR = [
      {
        proposalNumber: {
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
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        opportunity: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        opportunity: {
          auditRequest: {
            organization: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      },
      {
        opportunity: {
          auditRequest: {
            contact: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      },
      {
        opportunity: {
          auditRequest: {
            contact: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      },
    ];
  }

  const [total, proposals] = await Promise.all([
    prisma.proposal.count({
      where,
    }),

    prisma.proposal.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * PROPOSAL_PAGE_SIZE,
      take: PROPOSAL_PAGE_SIZE,
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
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
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / PROPOSAL_PAGE_SIZE),
  );

  return {
    proposals,
    total,
    page,
    totalPages,
    pageSize: PROPOSAL_PAGE_SIZE,
  };
}

export async function getProposalById(id: string) {
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      opportunity: {
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedToUser: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
          auditRequest: {
            include: {
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
              lead: {
                select: {
                  id: true,
                  status: true,
                  source: true,
                  estimatedValue: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!proposal) {
    return null;
  }

  const activities = await prisma.activity.findMany({
    where: {
      auditRequestId: proposal.opportunity.auditRequestId,
      type: "PROPOSAL",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    proposal,
    activities,
  };
}

export async function getProposalFormOptions() {
  return prisma.opportunity.findMany({
    where: {
      status: {
        notIn: ["DECLINED", "LOST"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      status: true,
      priority: true,
      estimatedValue: true,
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
            },
          },
        },
      },
    },
  });
}

export async function getProposalOpportunities() {
  return prisma.opportunity.findMany({
    where: {
      status: {
        notIn: ["DECLINED", "LOST"],
      },
    },
    select: {
      id: true,
      name: true,
      status: true,
      auditRequest: {
        select: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}