import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const auth = await requireApiRole("ADMIN");

  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    const body = await request.json();

    const assignedToUserId =
      typeof body.assignedToUserId === "string"
        ? body.assignedToUserId.trim()
        : "";

    if (!assignedToUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid staff member is required.",
        },
        { status: 400 },
      );
    }

    const [opportunity, assignee] =
      await Promise.all([
        prisma.opportunity.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            assignedToUserId: true,
            auditRequestId: true,
            auditRequest: {
              select: {
                organizationId: true,
              },
            },
          },
        }),

        prisma.user.findFirst({
          where: {
            id: assignedToUserId,
            active: true,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        }),
      ]);

    if (!opportunity) {
      return NextResponse.json(
        {
          success: false,
          message: "Opportunity not found.",
        },
        { status: 404 },
      );
    }

    if (!assignee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected staff member is not active or does not exist.",
        },
        { status: 400 },
      );
    }

    if (
      opportunity.assignedToUserId ===
      assignee.id
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Opportunity assignment is already up to date.",
      });
    }

    const previousAssigneeId =
      opportunity.assignedToUserId;

    const previousAssignee =
      previousAssigneeId
        ? await prisma.user.findUnique({
            where: {
              id: previousAssigneeId,
            },
            select: {
              id: true,
              name: true,
              email: true,
            },
          })
        : null;

    const updatedOpportunity =
      await prisma.$transaction(
        async (tx) => {
          const updated =
            await tx.opportunity.update({
              where: {
                id,
              },
              data: {
                assignedToUserId:
                  assignee.id,
              },
              select: {
                id: true,
                assignedToUserId: true,
              },
            });

            const now = new Date();

            await tx.opportunityAssignment.updateMany({
              where: {
                opportunityId: opportunity.id,
                unassignedAt: null,
              },
              data: {
                unassignedAt: now,
              },
            });

            await tx.opportunityAssignment.create({
              data: {
                opportunityId: opportunity.id,
                assignedToUserId: assignee.id,
                assignedByUserId: auth.user.id,
                assignedAt: now,
              },
            });

          await tx.activity.create({
            data: {
              organizationId:
                opportunity.auditRequest
                  .organizationId,
              auditRequestId:
                opportunity.auditRequestId,
              createdByUserId:
                auth.user.id,
              type: "STATUS_CHANGE",
              description:
                "Opportunity ownership reassigned.",
              metadata: {
                action:
                  "ASSIGNMENT_CHANGED",
                previousAssigneeId,
                previousAssigneeName:
                  previousAssignee?.name ??
                  null,
                previousAssigneeEmail:
                  previousAssignee?.email ??
                  null,
                newAssigneeId:
                  assignee.id,
                newAssigneeName:
                  assignee.name ??
                  null,
                newAssigneeEmail:
                  assignee.email,
              },
            },
          });

          return updated;
        },
      );

    return NextResponse.json({
      success: true,
      message:
        "Opportunity ownership updated.",
      data: updatedOpportunity,
    });
  } catch (error) {
    console.error(
      "Opportunity ownership reassignment failed",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update opportunity ownership.",
      },
      { status: 500 },
    );
  }
}