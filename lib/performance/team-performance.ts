import {
  getStaffPerformance,
  type PerformancePeriod,
  type StaffPerformance,
} from "@/lib/performance/staff-performance";
import { prisma } from "@/lib/prisma";

export type TeamPerformance = {
  period: PerformancePeriod;

  team: {
    staffCount: number;

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

  staff: StaffPerformance[];
};

function emptyLeadSources(): Record<string, number> {
  return {};
}

function emptyActivityTypes(): Record<string, number> {
  return {};
}

export async function getTeamPerformance(
  period: PerformancePeriod,
): Promise<TeamPerformance> {
  const users = await prisma.user.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
    },
  });

  const staffPerformance = await Promise.all(
    users.map((user) =>
      getStaffPerformance(
        user.id,
        period,
      ),
    ),
  );

  const staff = staffPerformance.filter(
    (
      performance,
    ): performance is StaffPerformance =>
      performance !== null,
  );

  const team = {
    staffCount: staff.length,

    leads: {
      generated: 0,
      qualified: 0,
      won: 0,
      lost: 0,
    },

    opportunities: {
      created: 0,
      won: 0,
      lost: 0,
      open: 0,
      wonValue: 0,
      lostValue: 0,
      pipelineValue: 0,
    },

    activities: {
      total: 0,
      byType: emptyActivityTypes(),
    },

    leadSources: emptyLeadSources(),
  };

  for (const performance of staff) {
    team.leads.generated +=
      performance.leads.generated;

    team.leads.qualified +=
      performance.leads.qualified;

    team.leads.won +=
      performance.leads.won;

    team.leads.lost +=
      performance.leads.lost;

    team.opportunities.created +=
      performance.opportunities.created;

    team.opportunities.won +=
      performance.opportunities.won;

    team.opportunities.lost +=
      performance.opportunities.lost;

    team.opportunities.open +=
      performance.opportunities.open;

    team.opportunities.wonValue +=
      performance.opportunities.wonValue;

    team.opportunities.lostValue +=
      performance.opportunities.lostValue;

    team.opportunities.pipelineValue +=
      performance.opportunities.pipelineValue;

    team.activities.total +=
      performance.activities.total;

    for (const [type, count] of Object.entries(
      performance.activities.byType,
    )) {
      team.activities.byType[type] =
        (team.activities.byType[type] ?? 0) +
        count;
    }

    for (const [source, count] of Object.entries(
      performance.leadSources,
    )) {
      team.leadSources[source] =
        (team.leadSources[source] ?? 0) +
        count;
    }
  }

  return {
    period,
    team,
    staff,
  };
}