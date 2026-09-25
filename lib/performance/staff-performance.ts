import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type PerformancePeriod = {
  from: Date;
  to: Date;
};

export type StaffPerformance = {
  staff: {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "STAFF";
  };

  period: {
    from: Date;
    to: Date;
  };

  leads: {
    generated: number;
    qualified: number;
    won: number;
    lost: number;
  };

  opportunities: {
    created: number;
    won: number;
    lost: number;
    open: number;
    wonValue: number;
    lostValue: number;
    pipelineValue: number;
  };

  activities: {
    total: number;
    byType: Record<string, number>;
  };

  leadSources: Record<string, number>;
};

function toNumber(
  value: Prisma.Decimal | number | null,
): number {
  if (value === null) {
    return 0;
  }

  return typeof value === "number"
    ? value
    : value.toNumber();
}

function getDateRangeFilter(period: PerformancePeriod) {
  return {
    gte: period.from,
    lt: period.to,
  };
}

/**
 * Determines whether a historical assignment covered
 * a specific point in time.
 *
 * An assignment is active at the timestamp when:
 *
 * assignedAt <= timestamp
 * AND
 * unassignedAt IS NULL OR unassignedAt > timestamp
 */
function assignmentCoversTimestamp(
  assignment: {
    assignedAt: Date;
    unassignedAt: Date | null;
  },
  timestamp: Date,
): boolean {
  return (
    assignment.assignedAt <= timestamp &&
    (
      assignment.unassignedAt === null ||
      assignment.unassignedAt > timestamp
    )
  );
}

export async function getStaffPerformance(
  userId: string,
  period: PerformancePeriod,
): Promise<StaffPerformance | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  const dateRange = getDateRangeFilter(period);

  const [
    leads,
    opportunitiesCreated,
    opportunitiesClosed,
    opportunitiesAtPeriodEnd,
    activities,
  ] = await Promise.all([
    /*
     * Lead creation attribution belongs to the user
     * who created the lead, not whoever currently owns it.
     */
    prisma.lead.findMany({
      where: {
        createdByUserId: userId,
        createdAt: dateRange,
      },
      select: {
        status: true,
        source: true,
      },
    }),

    /*
     * Opportunity creation attribution belongs to the
     * user who created the opportunity.
     */
    prisma.opportunity.findMany({
      where: {
        createdByUserId: userId,
        createdAt: dateRange,
      },
      select: {
        status: true,
        estimatedValue: true,
      },
    }),

    /*
     * Closed opportunities are fetched by the business
     * event date first. Historical assignment determines
     * who owned the opportunity when it was closed.
     */
    prisma.opportunity.findMany({
      where: {
        closedAt: dateRange,
        status: {
          in: ["WON", "LOST"],
        },
      },
      select: {
        id: true,
        status: true,
        estimatedValue: true,
        closedAt: true,
        assignments: {
          select: {
            assignedToUserId: true,
            assignedAt: true,
            unassignedAt: true,
          },
          orderBy: {
            assignedAt: "asc",
          },
        },
      },
    }),

    /*
     * Open pipeline is a point-in-time measurement.
     *
     * First identify opportunities that were open at the
     * end of the period, then use assignment history to
     * determine who owned each opportunity at period.to.
     */
    prisma.opportunity.findMany({
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
      },
      select: {
        id: true,
        status: true,
        estimatedValue: true,
        assignments: {
          select: {
            assignedToUserId: true,
            assignedAt: true,
            unassignedAt: true,
          },
          orderBy: {
            assignedAt: "asc",
          },
        },
      },
    }),

    /*
     * Activities are attributed directly to their creator.
     */
    prisma.activity.findMany({
      where: {
        createdByUserId: userId,
        createdAt: dateRange,
      },
      select: {
        type: true,
      },
    }),
  ]);

  const generated = leads.length;

  /*
   * Qualification currently follows the existing
   * performance definition:
   *
   * created during the selected period and current
   * status is QUALIFIED or a later sales stage.
   *
   * We are not inventing a historical qualification
   * timestamp because the Lead model does not currently
   * contain lead-status history.
   */
  const qualified = leads.filter(
    (lead) =>
      lead.status === "QUALIFIED" ||
      lead.status === "DISCOVERY" ||
      lead.status === "PROPOSAL_SENT" ||
      lead.status === "NEGOTIATION" ||
      lead.status === "WON",
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "WON",
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "LOST",
  ).length;

  /*
   * Only count a closed opportunity for this staff member
   * when the assignment history shows that they owned it
   * at the exact close timestamp.
   */
  const closedOpportunitiesForUser =
    opportunitiesClosed.filter(
      (opportunity) => {
        const closedAt = opportunity.closedAt;

        if (!closedAt) {
          return false;
        }

        return opportunity.assignments.some(
          (assignment) =>
            assignment.assignedToUserId === userId &&
            assignmentCoversTimestamp(
              assignment,
              closedAt,
            ),
        );
      },
    );

  const wonOpportunities =
    closedOpportunitiesForUser.filter(
      (opportunity) =>
        opportunity.status === "WON",
    );

  const lostOpportunities =
    closedOpportunitiesForUser.filter(
      (opportunity) =>
        opportunity.status === "LOST",
    );

  const wonValue = wonOpportunities.reduce(
    (total, opportunity) =>
      total + toNumber(opportunity.estimatedValue),
    0,
  );

  const lostValue = lostOpportunities.reduce(
    (total, opportunity) =>
      total + toNumber(opportunity.estimatedValue),
    0,
  );

  /*
   * Determine which opportunities were owned by this
   * staff member at the end of the performance period.
   */
  const openOpportunities =
    opportunitiesAtPeriodEnd.filter(
      (opportunity) => {
        if (
          opportunity.status === "WON" ||
          opportunity.status === "LOST"
        ) {
          return false;
        }

        return opportunity.assignments.some(
          (assignment) =>
            assignment.assignedToUserId === userId &&
            assignmentCoversTimestamp(
              assignment,
              period.to,
            ),
        );
      },
    );

  const pipelineValue = openOpportunities.reduce(
    (total, opportunity) =>
      total + toNumber(opportunity.estimatedValue),
    0,
  );

  const activitiesByType: Record<string, number> = {};

  for (const activity of activities) {
    activitiesByType[activity.type] =
      (activitiesByType[activity.type] ?? 0) + 1;
  }

  const leadSources: Record<string, number> = {};

  for (const lead of leads) {
    leadSources[lead.source] =
      (leadSources[lead.source] ?? 0) + 1;
  }

  return {
    staff: user,

    period: {
      from: period.from,
      to: period.to,
    },

    leads: {
      generated,
      qualified,
      won: wonLeads,
      lost: lostLeads,
    },

    opportunities: {
      created: opportunitiesCreated.length,
      won: wonOpportunities.length,
      lost: lostOpportunities.length,
      open: openOpportunities.length,
      wonValue,
      lostValue,
      pipelineValue,
    },

    activities: {
      total: activities.length,
      byType: activitiesByType,
    },

    leadSources,
  };
}