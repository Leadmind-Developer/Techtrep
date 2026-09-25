import { prisma } from "@/lib/prisma";
import type {
  AuditStatus,
  LeadSource,
  Prisma,
} from "../generated/prisma/client";

export const AUDIT_REQUEST_PAGE_SIZE = 10;

export type AuditRequestListFilters = {
  search?: string;
  status?: AuditStatus;
  source?: LeadSource;
  organizationId?: string;
  page?: number;
};

export async function getAuditRequests(
  filters: AuditRequestListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const organizationId =
    filters.organizationId?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.AuditRequestWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.source) {
    where.source = filters.source;
  }

  if (organizationId) {
    where.organizationId = organizationId;
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
        manualWork: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        existingSystems: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        additionalInformation: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [total, auditRequests] = await Promise.all([
    prisma.auditRequest.count({
      where,
    }),

    prisma.auditRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * AUDIT_REQUEST_PAGE_SIZE,
      take: AUDIT_REQUEST_PAGE_SIZE,
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

        lead: {
          select: {
            id: true,
            status: true,
          },
        },

        opportunities: {
          select: {
            id: true,
            name: true,
            priority: true,
            status: true,
            estimatedValue: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / AUDIT_REQUEST_PAGE_SIZE),
  );

  return {
    auditRequests,
    total,
    page,
    totalPages,
    pageSize: AUDIT_REQUEST_PAGE_SIZE,
  };
}

export async function getAuditRequestById(id: string) {
  return prisma.auditRequest.findUnique({
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

      lead: {
        select: {
          id: true,
          status: true,
          source: true,
          estimatedValue: true,
          createdAt: true,
        },
      },

      opportunities: {
        orderBy: {
          createdAt: "desc",
        },
      },

      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
    },
  });
}

export async function getAuditRequestFormOptions() {
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
