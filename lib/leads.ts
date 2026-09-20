import { prisma } from "@/lib/prisma";
import type { LeadSource, LeadStatus, Prisma } from "../generated/prisma/client";

export const LEAD_PAGE_SIZE = 10;

export type LeadListFilters = {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  page?: number;
};

export async function getLeads(filters: LeadListFilters = {}) {
  const search = filters.search?.trim() ?? "";
  const page =
    Number.isInteger(filters.page) && (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.LeadWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.source) {
    where.source = filters.source;
  }

  if (search) {
    where.OR = [
      {
        organization: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        contact: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        contact: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        notes: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [total, leads] = await Promise.all([
    prisma.lead.count({
      where,
    }),

    prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * LEAD_PAGE_SIZE,
      take: LEAD_PAGE_SIZE,
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
            phone: true,
            role: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / LEAD_PAGE_SIZE),
  );

  return {
    leads,
    total,
    page,
    totalPages,
    pageSize: LEAD_PAGE_SIZE,
  };
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: {
      id,
    },
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
      activities: {
        orderBy: {
          createdAt: "desc",
        },
      },
      auditRequests: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          scheduledAt: true,
          completedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getLeadFormOptions() {
  const [organizations, contacts] = await Promise.all([
    prisma.organization.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        organizationId: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    organizations,
    contacts,
  };
}