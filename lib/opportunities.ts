import { prisma } from "@/lib/prisma";
import type {
  OpportunityPriority,
  OpportunityStatus,
  Prisma,
} from "../generated/prisma/client";

export const OPPORTUNITY_PAGE_SIZE = 10;

export type OpportunityListFilters = {
  search?: string;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  organizationId?: string;
  page?: number;
};

export async function getOpportunities(
  filters: OpportunityListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const organizationId =
    filters.organizationId?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.OpportunityWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (organizationId) {
    where.auditRequest = {
      organizationId,
    };
  }

  if (search) {
    where.OR = [
      {
        name: {
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
        auditRequest: {
          organization: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        auditRequest: {
          contact: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        auditRequest: {
          contact: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  const [total, opportunities] = await Promise.all([
    prisma.opportunity.count({
      where,
    }),

    prisma.opportunity.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * OPPORTUNITY_PAGE_SIZE,
      take: OPPORTUNITY_PAGE_SIZE,
      include: {
        auditRequest: {
          select: {
            id: true,
            status: true,
            createdAt: true,
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
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / OPPORTUNITY_PAGE_SIZE),
  );

  return {
    opportunities,
    total,
    page,
    totalPages,
    pageSize: OPPORTUNITY_PAGE_SIZE,
  };
}

export async function getOpportunityById(id: string) {
  return prisma.opportunity.findUnique({
    where: {
      id,
    },
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
  });
}

export async function getOpportunityFormOptions() {
  return prisma.auditRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
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
  });
}

export async function getOpportunityOrganizations() {
  return prisma.organization.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}