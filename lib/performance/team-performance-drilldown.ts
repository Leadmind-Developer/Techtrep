import {
  LeadStatus,
  OpportunityStatus,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import type { PerformancePeriod } from "./staff-performance";
import type {
  PerformanceDrilldownMetric,
  PerformanceDrilldownRecord,
  PerformanceDrilldownResult,
} from "./staff-performance-drilldown";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

type TeamDrilldownRecord =
  PerformanceDrilldownRecord & {
    staff: {
      id: string;
      name: string | null;
      email: string;
    };
  };

export type TeamPerformanceDrilldownResult =
  Omit<PerformanceDrilldownResult, "records"> & {
    records: TeamDrilldownRecord[];
  };

function normalizePagination(
  page: number,
  pageSize: number,
) {
  const normalizedPage =
    Number.isFinite(page) && page > 0
      ? Math.floor(page)
      : 1;

  const normalizedPageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.min(
          Math.floor(pageSize),
          MAX_PAGE_SIZE,
        )
      : DEFAULT_PAGE_SIZE;

  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
  };
}

function getDateRangeFilter(
  period: PerformancePeriod,
) {
  return {
    gte: period.from,
    lt: period.to,
  };
}

function toNumber(
  value:
    | {
        toNumber(): number;
      }
    | number
    | null,
): number | null {
  if (value === null) {
    return null;
  }

  return typeof value === "number"
    ? value
    : value.toNumber();
}

function assignmentCoversTimestamp(
  assignment: {
    assignedAt: Date;
    unassignedAt: Date | null;
  },
  timestamp: Date,
): boolean {
  return (
    assignment.assignedAt <= timestamp &&
    (assignment.unassignedAt === null ||
      assignment.unassignedAt > timestamp)
  );
}

async function getActiveStaff() {
  return prisma.user.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        email: "asc",
      },
    ],
  });
}

function getStaffMap(
  staff: Awaited<ReturnType<typeof getActiveStaff>>,
) {
  return new Map(
    staff.map((member) => [
      member.id,
      member,
    ]),
  );
}

export async function getTeamPerformanceDrilldown(
  metric: PerformanceDrilldownMetric,
  period: PerformancePeriod,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<TeamPerformanceDrilldownResult> {
  const pagination =
    normalizePagination(
      page,
      pageSize,
    );

  const staff = await getActiveStaff();

  const staffIds = staff.map(
    (member) => member.id,
  );

  if (staffIds.length === 0) {
    return {
      metric,
      records: [],
      total: 0,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: 0,
    };
  }

  const staffMap = getStaffMap(staff);

  /*
   * Leads generated and qualified leads are
   * attributed to the user who created the lead.
   *
   * Qualified lead status remains based on the
   * current Lead status because Lead status history
   * does not yet exist.
   */
  if (
    metric === "leads-generated" ||
    metric === "qualified-leads"
  ) {
    const where = {
      createdByUserId: {
        in: staffIds,
      },
      createdAt:
        getDateRangeFilter(period),
      ...(metric === "qualified-leads"
        ? {
            status: {
              in: [
                LeadStatus.QUALIFIED,
                LeadStatus.DISCOVERY,
                LeadStatus.PROPOSAL_SENT,
                LeadStatus.NEGOTIATION,
                LeadStatus.WON,
              ],
            },
          }
        : {}),
    };

    const [total, leads] =
      await Promise.all([
        prisma.lead.count({
          where,
        }),

        prisma.lead.findMany({
          where,
          select: {
            id: true,
            status: true,
            createdAt: true,
            createdByUserId: true,
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
          skip:
            (pagination.page - 1) *
            pagination.pageSize,
          take: pagination.pageSize,
        }),
      ]);

    const validLeads = leads.filter(
      (
        lead,
      ): lead is typeof lead & {
        createdByUserId: string;
      } =>
        lead.createdByUserId !== null,
    );

    return {
      metric,
      records: validLeads.map(
        (lead) => {
          const member =
            staffMap.get(
              lead.createdByUserId,
            );

          return {
            id: lead.id,
            type: "lead",
            title:
              lead.organization.name,
            subtitle:
              lead.contact?.name ?? null,
            status: lead.status,
            value: null,
            createdAt:
              lead.createdAt,
            closedAt: null,
            staff: {
              id: lead.createdByUserId,
              name:
                member?.name ?? null,
              email:
                member?.email ?? "Unknown",
            },
          };
        },
      ),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages:
        Math.ceil(
          total / pagination.pageSize,
        ),
    };
  }

  /*
   * Opportunities:
   *
   * Created:
   *   attributed to createdByUserId.
   *
   * Won/Lost:
   *   attributed to the staff member who owned
   *   the opportunity at closedAt.
   *
   * Open:
   *   attributed to the staff member who owned
   *   the opportunity at period.to.
   */
  if (
    metric === "opportunities-created" ||
    metric === "opportunities-won" ||
    metric === "opportunities-lost" ||
    metric === "open-opportunities"
  ) {
    if (
      metric === "opportunities-created"
    ) {
      const where = {
        createdByUserId: {
          in: staffIds,
        },
        createdAt:
          getDateRangeFilter(period),
      };

      const [total, opportunities] =
        await Promise.all([
          prisma.opportunity.count({
            where,
          }),

          prisma.opportunity.findMany({
            where,
            select: {
              id: true,
              name: true,
              status: true,
              estimatedValue: true,
              createdAt: true,
              closedAt: true,
              createdByUserId: true,
              auditRequest: {
                select: {
                  organization: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            skip:
              (pagination.page - 1) *
              pagination.pageSize,
            take: pagination.pageSize,
          }),
        ]);

      const validOpportunities =
        opportunities.filter(
          (
            opportunity,
          ): opportunity is typeof opportunity & {
            createdByUserId: string;
          } =>
            opportunity.createdByUserId !==
            null,
        );

      return {
        metric,
        records:
          validOpportunities.map(
            (opportunity) => {
              const member =
                staffMap.get(
                  opportunity.createdByUserId,
                );

              return {
                id: opportunity.id,
                type: "opportunity",
                title:
                  opportunity.name,
                subtitle:
                  opportunity.auditRequest
                    .organization.name,
                status:
                  opportunity.status,
                value: toNumber(
                  opportunity.estimatedValue,
                ),
                createdAt:
                  opportunity.createdAt,
                closedAt:
                  opportunity.closedAt,
                staff: {
                  id:
                    opportunity.createdByUserId,
                  name:
                    member?.name ?? null,
                  email:
                    member?.email ??
                    "Unknown",
                },
              };
            },
          ),
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages:
          Math.ceil(
            total / pagination.pageSize,
          ),
      };
    }

    if (
      metric === "opportunities-won" ||
      metric === "opportunities-lost"
    ) {
      const where = {
        closedAt:
          getDateRangeFilter(period),
        status:
          metric ===
          "opportunities-won"
            ? ("WON" as const)
            : ("LOST" as const),
      };

      const allMatching =
        await prisma.opportunity.findMany({
          where,
          select: {
            id: true,
            name: true,
            status: true,
            estimatedValue: true,
            createdAt: true,
            closedAt: true,
            assignments: {
              select: {
                assignedToUserId: true,
                assignedAt: true,
                unassignedAt: true,
              },
            },
            auditRequest: {
              select: {
                organization: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            closedAt: "desc",
          },
        });

      const matching =
        allMatching.filter(
          (opportunity) => {
            const closedAt =
              opportunity.closedAt;

            if (!closedAt) {
              return false;
            }

            return opportunity.assignments.some(
              (assignment) =>
                staffIds.includes(
                  assignment.assignedToUserId,
                ) &&
                assignmentCoversTimestamp(
                  assignment,
                  closedAt,
                ),
            );
          },
        );

      const total = matching.length;

      const paginated =
        matching.slice(
          (pagination.page - 1) *
            pagination.pageSize,
          pagination.page *
            pagination.pageSize,
        );

      return {
        metric,
        records: paginated.map(
          (opportunity) => {
            const closedAt =
              opportunity.closedAt;

            const assignment =
              opportunity.assignments.find(
                (item) =>
                  closedAt !== null &&
                  staffIds.includes(
                    item.assignedToUserId,
                  ) &&
                  assignmentCoversTimestamp(
                    item,
                    closedAt,
                  ),
              );

            const member =
              assignment
                ? staffMap.get(
                    assignment.assignedToUserId,
                  )
                : null;

            return {
              id: opportunity.id,
              type: "opportunity",
              title: opportunity.name,
              subtitle:
                opportunity.auditRequest
                  .organization.name,
              status: opportunity.status,
              value: toNumber(
                opportunity.estimatedValue,
              ),
              createdAt:
                opportunity.createdAt,
              closedAt,
              staff: {
                id:
                  assignment?.assignedToUserId ??
                  "",
                name:
                  member?.name ?? null,
                email:
                  member?.email ?? "Unknown",
              },
            };
          },
        ),
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages:
          Math.ceil(
            total / pagination.pageSize,
          ),
      };
    }

    const allMatching =
      await prisma.opportunity.findMany({
        where: {
          createdAt: {
            lt: period.to,
          },
          OR: [
            {
              closedAt: null,
            },
            {
              closedAt: {
                gte: period.to,
              },
            },
          ],
          status: {
            notIn: [
              OpportunityStatus.WON,
              OpportunityStatus.LOST,
            ],
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
          estimatedValue: true,
          createdAt: true,
          closedAt: true,
          assignments: {
            select: {
              assignedToUserId: true,
              assignedAt: true,
              unassignedAt: true,
            },
          },
          auditRequest: {
            select: {
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const matching =
      allMatching.filter(
        (opportunity) =>
          opportunity.assignments.some(
            (assignment) =>
              staffIds.includes(
                assignment.assignedToUserId,
              ) &&
              assignmentCoversTimestamp(
                assignment,
                period.to,
              ),
          ),
      );

    const total = matching.length;

    const paginated =
      matching.slice(
        (pagination.page - 1) *
          pagination.pageSize,
        pagination.page *
          pagination.pageSize,
      );

    return {
      metric: "open-opportunities",
      records: paginated.map(
        (opportunity) => {
          const assignment =
            opportunity.assignments.find(
              (item) =>
                staffIds.includes(
                  item.assignedToUserId,
                ) &&
                assignmentCoversTimestamp(
                  item,
                  period.to,
                ),
            );

          const member =
            assignment
              ? staffMap.get(
                  assignment.assignedToUserId,
                )
              : null;

          return {
            id: opportunity.id,
            type: "opportunity",
            title: opportunity.name,
            subtitle:
              opportunity.auditRequest
                .organization.name,
            status: opportunity.status,
            value: toNumber(
              opportunity.estimatedValue,
            ),
            createdAt:
              opportunity.createdAt,
            closedAt:
              opportunity.closedAt,
            staff: {
              id:
                assignment?.assignedToUserId ??
                "",
              name:
                member?.name ?? null,
              email:
                member?.email ?? "Unknown",
            },
          };
        },
      ),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages:
        Math.ceil(
          total / pagination.pageSize,
        ),
    };
  }

  /*
   * Activities are attributed to the user who
   * created the activity.
   */
  const activityWhere = {
    createdByUserId: {
      in: staffIds,
    },
    createdAt:
      getDateRangeFilter(period),
  };

  const [total, activities] =
    await Promise.all([
      prisma.activity.count({
        where: activityWhere,
      }),

      prisma.activity.findMany({
        where: activityWhere,
        select: {
          id: true,
          type: true,
          createdAt: true,
          createdByUserId: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip:
          (pagination.page - 1) *
          pagination.pageSize,
        take: pagination.pageSize,
      }),
    ]);

  const validActivities =
    activities.filter(
      (
        activity,
      ): activity is typeof activity & {
        createdByUserId: string;
      } =>
        activity.createdByUserId !== null,
    );

  return {
    metric: "activities",
    records: validActivities.map(
      (activity) => {
        const member =
          staffMap.get(
            activity.createdByUserId,
          );

        return {
          id: activity.id,
          type: "activity",
          title: activity.type,
          subtitle:
            activity.organization.name,
          status: null,
          value: null,
          createdAt:
            activity.createdAt,
          closedAt: null,
          staff: {
            id:
              activity.createdByUserId,
            name:
              member?.name ?? null,
            email:
              member?.email ?? "Unknown",
          },
        };
      },
    ),
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages:
      Math.ceil(
        total / pagination.pageSize,
      ),
  };
}