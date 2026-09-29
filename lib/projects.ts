import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  ProjectStatus,
  OpportunityPriority,
} from "../generated/prisma/client";

export const PROJECT_PAGE_SIZE = 10;

export type ProjectListFilters = {
  search?: string;
  status?: ProjectStatus;
  priority?: OpportunityPriority;
  projectManagerId?: string;
  page?: number;
};

export async function getProjects(
  filters: ProjectListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const projectManagerId =
    filters.projectManagerId?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.ProjectWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (projectManagerId) {
    where.projectManagerId = projectManagerId;
  }

  if (search) {
    where.OR = [
      {
        projectNumber: {
          contains: search,
          mode: "insensitive",
        },
      },
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
        proposal: {
          proposalNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        proposal: {
          opportunity: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        proposal: {
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
      },
      {
        proposal: {
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
      },
    ];
  }

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * PROJECT_PAGE_SIZE,
      take: PROJECT_PAGE_SIZE,
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        proposal: {
          include: {
            opportunity: {
              include: {
                auditRequest: {
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
    Math.ceil(total / PROJECT_PAGE_SIZE),
  );

  return {
    projects,
    total,
    page,
    totalPages,
    pageSize: PROJECT_PAGE_SIZE,
  };
}