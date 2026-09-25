import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
const [
totalLeads,
newLeads,
activeOpportunities,
pendingAudits,
leadPipeline,
recentActivities,
recentLeads,
] = await Promise.all([
prisma.lead.count(),

prisma.lead.count({
  where: {
    status: "NEW",
  },
}),

prisma.opportunity.count({
  where: {
    status: {
      in: [
        "IDENTIFIED",
        "DISCUSSED",
        "PROPOSED",
        "APPROVED",
        "IN_PROGRESS",
      ],
    },
  },
}),

prisma.auditRequest.count({
  where: {
    status: {
      in: [
        "REQUESTED",
        "CONTACTED",
        "SCHEDULED",
      ],
    },
  },
}),

prisma.lead.groupBy({
  by: ["status"],
  _count: {
    _all: true,
  },
  orderBy: {
    status: "asc",
  },
}),

prisma.activity.findMany({
  take: 8,
  orderBy: {
    createdAt: "desc",
  },
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

prisma.lead.findMany({
  take: 8,
  orderBy: {
    createdAt: "desc",
  },
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
}),

]);

return {
totalLeads,
newLeads,
activeOpportunities,
pendingAudits,
leadPipeline,
recentActivities,
recentLeads,
};
}
