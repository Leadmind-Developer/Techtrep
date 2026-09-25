import { prisma } from "@/lib/prisma";
import type {
  ActivityType,
  Prisma,
} from "../generated/prisma/client";

export const ACTIVITY_PAGE_SIZE = 15;

export type ActivityListFilters = {
  search?: string;
  type?: ActivityType;
  organizationId?: string;
  leadId?: string;
  auditRequestId?: string;
  page?: number;
};

export async function getActivities(
  filters: ActivityListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const organizationId =
    filters.organizationId?.trim() ?? "";
  const leadId = filters.leadId?.trim() ?? "";
  const auditRequestId =
    filters.auditRequestId?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.ActivityWhereInput = {};

  if (filters.type) {
    where.type = filters.type;
  }

  if (organizationId) {
    where.organizationId = organizationId;
  }

  if (leadId) {
    where.leadId = leadId;
  }

  if (auditRequestId) {
    where.auditRequestId = auditRequestId;
  }

  if (search) {
    where.OR = [
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        organization: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        lead: {
          notes: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [total, activities] = await Promise.all([
    prisma.activity.count({
      where,
    }),

    prisma.activity.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * ACTIVITY_PAGE_SIZE,
      take: ACTIVITY_PAGE_SIZE,
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
            source: true,
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
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ACTIVITY_PAGE_SIZE),
  );

  return {
    activities,
    total,
    page,
    totalPages,
    pageSize: ACTIVITY_PAGE_SIZE,
  };
}

export async function getActivityById(id: string) {
  return prisma.activity.findUnique({
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

      lead: {
        select: {
          id: true,
          status: true,
          source: true,
          notes: true,
          estimatedValue: true,
          createdAt: true,
        },
      },

      auditRequest: {
        select: {
          id: true,
          status: true,
          source: true,
          createdAt: true,
          scheduledAt: true,
          completedAt: true,
        },
      },
    },
  });
}

export async function getActivityFormOptions() {
  const [organizations, leads, auditRequests] =
    await Promise.all([
      prisma.organization.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.lead.findMany({
        select: {
          id: true,
          organizationId: true,
          status: true,
          source: true,
          organization: {
            select: {
              name: true,
            },
          },
          contact: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.auditRequest.findMany({
        select: {
          id: true,
          organizationId: true,
          status: true,
          createdAt: true,
          organization: {
            select: {
              name: true,
            },
          },
          contact: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  return {
    organizations,
    leads,
    auditRequests,
  };
}