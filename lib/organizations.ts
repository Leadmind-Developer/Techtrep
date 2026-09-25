import { prisma } from "@/lib/prisma";
import type { Prisma } from "../generated/prisma/client";

export const ORGANIZATION_PAGE_SIZE = 10;

export type OrganizationListFilters = {
  search?: string;
  industry?: string;
  page?: number;
};

export async function getOrganizations(
  filters: OrganizationListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const industry = filters.industry?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) && (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.OrganizationWhereInput = {};

  if (industry) {
    where.industry = {
      equals: industry,
      mode: "insensitive",
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
        website: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        industry: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [total, organizations] = await Promise.all([
    prisma.organization.count({
      where,
    }),

    prisma.organization.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      skip: (page - 1) * ORGANIZATION_PAGE_SIZE,
      take: ORGANIZATION_PAGE_SIZE,
      include: {
        _count: {
          select: {
            contacts: true,
            leads: true,
            audits: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ORGANIZATION_PAGE_SIZE),
  );

  return {
    organizations,
    total,
    page,
    totalPages,
    pageSize: ORGANIZATION_PAGE_SIZE,
  };
}

export async function getOrganizationById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      contacts: {
        orderBy: { name: "asc" },
      },

      leads: {
        orderBy: { createdAt: "desc" },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      audits: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          source: true,
          scheduledAt: true,
          completedAt: true,
          reportSentAt: true,
          createdAt: true,
        },
      },

      activities: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function getOrganizationFormOptions() {
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return organizations;
}

export async function getOrganizationIndustries() {
  const organizations = await prisma.organization.findMany({
    where: {
      industry: {
        not: null,
      },
    },
    select: {
      industry: true,
    },
    distinct: ["industry"],
    orderBy: {
      industry: "asc",
    },
  });

  return organizations
    .map((organization) => organization.industry)
    .filter((industry): industry is string => Boolean(industry));
}