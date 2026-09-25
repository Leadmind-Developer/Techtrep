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

    const [lead, assignee] = await Promise.all([
      prisma.lead.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          assignedToUserId: true,
          organizationId: true,
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

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found.",
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
      lead.assignedToUserId ===
      assignee.id
    ) {
      return NextResponse.json({
        success: true,
        message: "Lead assignment is already up to date.",
      });
    }

    const previousAssigneeId =
      lead.assignedToUserId;

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

    const updatedLead =
      await prisma.$transaction(
        async (tx) => {
          const updated =
            await tx.lead.update({
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

            await tx.leadAssignment.updateMany({
              where: {
                leadId: lead.id,
                unassignedAt: null,
              },
              data: {
                unassignedAt: now,
              },
            });

            await tx.leadAssignment.create({
              data: {
                leadId: lead.id,
                assignedToUserId: assignee.id,
                assignedByUserId: auth.user.id,
                assignedAt: now,
              },
            });

          await tx.activity.create({
            data: {
              organizationId:
                lead.organizationId,
              leadId: lead.id,
              createdByUserId:
                auth.user.id,
              type: "STATUS_CHANGE",
              description:
                "Lead ownership reassigned.",
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
      message: "Lead ownership updated.",
      data: updatedLead,
    });
  } catch (error) {
    console.error(
      "Lead ownership reassignment failed",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update lead ownership.",
      },
      { status: 500 },
    );
  }
}