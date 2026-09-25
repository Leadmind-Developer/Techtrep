import "dotenv/config";
import { prisma } from "../lib/prisma";

type Failure = {
  check: string;
  details: string;
};

const failures: Failure[] = [];

function fail(check: string, details: string) {
  failures.push({ check, details });
}

async function main() {
  console.log("");
  console.log("=== 6L-09 Assignment History Integrity Verification ===");
  console.log("");

  /*
   * ------------------------------------------------------------
   * 1. Load Leads and their complete assignment history
   * ------------------------------------------------------------
   */
  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      assignedToUserId: true,
      assignments: {
        orderBy: {
          assignedAt: "asc",
        },
        select: {
          id: true,
          leadId: true,
          assignedToUserId: true,
          assignedByUserId: true,
          assignedAt: true,
          unassignedAt: true,
        },
      },
    },
  });

  console.log(`Leads checked: ${leads.length}`);

  /*
   * ------------------------------------------------------------
   * 2. Lead assignment invariants
   * ------------------------------------------------------------
   */
  for (const lead of leads) {
    const activeAssignments = lead.assignments.filter(
      (assignment) => assignment.unassignedAt === null,
    );

    /*
     * A Lead with a current owner must have exactly one
     * active assignment.
     */
    if (lead.assignedToUserId !== null) {
      if (activeAssignments.length !== 1) {
        fail(
          "Lead active assignment count",
          `Lead ${lead.id} has current owner ${lead.assignedToUserId} but ${activeAssignments.length} active assignments.`,
        );
      } else {
        const active = activeAssignments[0];

        if (
          active.assignedToUserId !==
          lead.assignedToUserId
        ) {
          fail(
            "Lead current owner mismatch",
            `Lead ${lead.id} current owner is ${lead.assignedToUserId}, but active assignment ${active.id} points to ${active.assignedToUserId}.`,
          );
        }
      }
    } else {
      /*
       * If the current owner is null, there should not be an
       * active assignment.
       */
      if (activeAssignments.length !== 0) {
        fail(
          "Unassigned Lead has active assignment",
          `Lead ${lead.id} has no current owner but has ${activeAssignments.length} active assignment(s).`,
        );
      }
    }

    /*
     * No Lead may have more than one active assignment.
     * This independently verifies the partial unique index
     * at the application/data level.
     */
    if (activeAssignments.length > 1) {
      fail(
        "Lead multiple active assignments",
        `Lead ${lead.id} has ${activeAssignments.length} active assignments.`,
      );
    }

    /*
     * Every assignment must reference its parent Lead correctly.
     */
    for (const assignment of lead.assignments) {
      if (assignment.leadId !== lead.id) {
        fail(
          "Lead assignment parent mismatch",
          `Assignment ${assignment.id} references lead ${assignment.leadId}, but was loaded under lead ${lead.id}.`,
        );
      }

      /*
       * assignedAt must never occur after unassignedAt.
       */
      if (
        assignment.unassignedAt !== null &&
        assignment.assignedAt >
          assignment.unassignedAt
      ) {
        fail(
          "Lead assignment timestamp ordering",
          `Assignment ${assignment.id} has assignedAt ${assignment.assignedAt.toISOString()} after unassignedAt ${assignment.unassignedAt.toISOString()}.`,
        );
      }

      /*
       * Active assignments must have no unassignedAt value.
       */
      if (
        assignment.unassignedAt === null &&
        activeAssignments.every(
          (active) => active.id !== assignment.id,
        )
      ) {
        fail(
          "Lead active assignment classification",
          `Assignment ${assignment.id} has unassignedAt NULL but was not classified as active.`,
        );
      }
    }
  }

  /*
   * ------------------------------------------------------------
   * 3. Load Opportunities and their complete assignment history
   * ------------------------------------------------------------
   */
  const opportunities =
    await prisma.opportunity.findMany({
      select: {
        id: true,
        assignedToUserId: true,
        assignments: {
          orderBy: {
            assignedAt: "asc",
          },
          select: {
            id: true,
            opportunityId: true,
            assignedToUserId: true,
            assignedByUserId: true,
            assignedAt: true,
            unassignedAt: true,
          },
        },
      },
    });

  console.log(
    `Opportunities checked: ${opportunities.length}`,
  );

  /*
   * ------------------------------------------------------------
   * 4. Opportunity assignment invariants
   * ------------------------------------------------------------
   */
  for (const opportunity of opportunities) {
    const activeAssignments =
      opportunity.assignments.filter(
        (assignment) =>
          assignment.unassignedAt === null,
      );

    /*
     * An Opportunity with a current owner must have exactly
     * one active assignment.
     */
    if (opportunity.assignedToUserId !== null) {
      if (activeAssignments.length !== 1) {
        fail(
          "Opportunity active assignment count",
          `Opportunity ${opportunity.id} has current owner ${opportunity.assignedToUserId} but ${activeAssignments.length} active assignments.`,
        );
      } else {
        const active = activeAssignments[0];

        if (
          active.assignedToUserId !==
          opportunity.assignedToUserId
        ) {
          fail(
            "Opportunity current owner mismatch",
            `Opportunity ${opportunity.id} current owner is ${opportunity.assignedToUserId}, but active assignment ${active.id} points to ${active.assignedToUserId}.`,
          );
        }
      }
    } else {
      /*
       * If current ownership is null, there should not be an
       * active assignment.
       */
      if (activeAssignments.length !== 0) {
        fail(
          "Unassigned Opportunity has active assignment",
          `Opportunity ${opportunity.id} has no current owner but has ${activeAssignments.length} active assignment(s).`,
        );
      }
    }

    /*
     * No Opportunity may have more than one active assignment.
     */
    if (activeAssignments.length > 1) {
      fail(
        "Opportunity multiple active assignments",
        `Opportunity ${opportunity.id} has ${activeAssignments.length} active assignments.`,
      );
    }

    /*
     * Validate every historical assignment.
     */
    for (const assignment of opportunity.assignments) {
      if (assignment.opportunityId !== opportunity.id) {
        fail(
          "Opportunity assignment parent mismatch",
          `Assignment ${assignment.id} references opportunity ${assignment.opportunityId}, but was loaded under opportunity ${opportunity.id}.`,
        );
      }

      if (
        assignment.unassignedAt !== null &&
        assignment.assignedAt >
          assignment.unassignedAt
      ) {
        fail(
          "Opportunity assignment timestamp ordering",
          `Assignment ${assignment.id} has assignedAt ${assignment.assignedAt.toISOString()} after unassignedAt ${assignment.unassignedAt.toISOString()}.`,
        );
      }

      if (
        assignment.unassignedAt === null &&
        activeAssignments.every(
          (active) => active.id !== assignment.id,
        )
      ) {
        fail(
          "Opportunity active assignment classification",
          `Assignment ${assignment.id} has unassignedAt NULL but was not classified as active.`,
        );
      }
    }
  }

  /*
   * ------------------------------------------------------------
   * 5. Assignment-history reference integrity
   *
   * Prisma/PostgreSQL foreign keys should already prevent
   * orphaned records. These checks explicitly verify the
   * references visible through Prisma.
   * ------------------------------------------------------------
   */
  const leadAssignments =
    await prisma.leadAssignment.findMany({
      select: {
        id: true,
        leadId: true,
        assignedToUserId: true,
        assignedByUserId: true,
        assignedAt: true,
        unassignedAt: true,
        lead: {
          select: {
            id: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
          },
        },
        assignedByUser: {
          select: {
            id: true,
          },
        },
      },
    });

  const opportunityAssignments =
    await prisma.opportunityAssignment.findMany({
      select: {
        id: true,
        opportunityId: true,
        assignedToUserId: true,
        assignedByUserId: true,
        assignedAt: true,
        unassignedAt: true,
        opportunity: {
          select: {
            id: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
          },
        },
        assignedByUser: {
          select: {
            id: true,
          },
        },
      },
    });

  console.log(
    `Lead assignments checked: ${leadAssignments.length}`,
  );

  console.log(
    `Opportunity assignments checked: ${opportunityAssignments.length}`,
  );

  for (const assignment of leadAssignments) {
    if (!assignment.lead) {
      fail(
        "Lead assignment parent reference",
        `Lead assignment ${assignment.id} has no Lead relation.`,
      );
    }

    if (!assignment.assignedToUser) {
      fail(
        "Lead assignment assignee reference",
        `Lead assignment ${assignment.id} has no assigned-to User relation.`,
      );
    }

    if (
      assignment.assignedByUserId !== null &&
      !assignment.assignedByUser
    ) {
      fail(
        "Lead assignment assigner reference",
        `Lead assignment ${assignment.id} has assignedByUserId ${assignment.assignedByUserId} but no matching User relation.`,
      );
    }

    if (
      assignment.unassignedAt !== null &&
      assignment.assignedAt >
        assignment.unassignedAt
    ) {
      fail(
        "Lead assignment global timestamp ordering",
        `Lead assignment ${assignment.id} has invalid timestamp ordering.`,
      );
    }
  }

  for (const assignment of opportunityAssignments) {
    if (!assignment.opportunity) {
      fail(
        "Opportunity assignment parent reference",
        `Opportunity assignment ${assignment.id} has no Opportunity relation.`,
      );
    }

    if (!assignment.assignedToUser) {
      fail(
        "Opportunity assignment assignee reference",
        `Opportunity assignment ${assignment.id} has no assigned-to User relation.`,
      );
    }

    if (
      assignment.assignedByUserId !== null &&
      !assignment.assignedByUser
    ) {
      fail(
        "Opportunity assignment assigner reference",
        `Opportunity assignment ${assignment.id} has assignedByUserId ${assignment.assignedByUserId} but no matching User relation.`,
      );
    }

    if (
      assignment.unassignedAt !== null &&
      assignment.assignedAt >
        assignment.unassignedAt
    ) {
      fail(
        "Opportunity assignment global timestamp ordering",
        `Opportunity assignment ${assignment.id} has invalid timestamp ordering.`,
      );
    }
  }

  /*
   * ------------------------------------------------------------
   * 6. Historical ordering
   *
   * For each record, an assignment that ended must end before
   * the next assignment begins.
   * ------------------------------------------------------------
   */
  for (const lead of leads) {
    const assignments = lead.assignments;

    for (let i = 0; i < assignments.length - 1; i++) {
      const current = assignments[i];
      const next = assignments[i + 1];

      if (
        current.unassignedAt !== null &&
        current.unassignedAt > next.assignedAt
      ) {
        fail(
          "Lead assignment history ordering",
          `Lead ${lead.id}: assignment ${current.id} ends at ${current.unassignedAt.toISOString()} after next assignment ${next.id} begins at ${next.assignedAt.toISOString()}.`,
        );
      }
    }
  }

  for (const opportunity of opportunities) {
    const assignments = opportunity.assignments;

    for (let i = 0; i < assignments.length - 1; i++) {
      const current = assignments[i];
      const next = assignments[i + 1];

      if (
        current.unassignedAt !== null &&
        current.unassignedAt > next.assignedAt
      ) {
        fail(
          "Opportunity assignment history ordering",
          `Opportunity ${opportunity.id}: assignment ${current.id} ends at ${current.unassignedAt.toISOString()} after next assignment ${next.id} begins at ${next.assignedAt.toISOString()}.`,
        );
      }
    }
  }

  /*
   * ------------------------------------------------------------
   * 7. Summary
   * ------------------------------------------------------------
   */
  console.log("");
  console.log("=== Integrity Test Results ===");
  console.log("");

  if (failures.length === 0) {
    console.log("PASS: Lead assignment integrity");
    console.log("PASS: Opportunity assignment integrity");
    console.log("PASS: Current-owner consistency");
    console.log("PASS: Single-active-assignment invariant");
    console.log("PASS: Assignment timestamp ordering");
    console.log("PASS: Assignment parent references");
    console.log("PASS: Assignment user references");
    console.log("PASS: Historical assignment ordering");
    console.log("");
    console.log(
      "RESULT: PASSED — assignment history integrity is clean.",
    );
  } else {
    console.log(
      `FAIL: ${failures.length} integrity issue(s) detected.`,
    );
    console.log("");

    failures.forEach((failure, index) => {
      console.log(
        `${index + 1}. ${failure.check}`,
      );
      console.log(`   ${failure.details}`);
      console.log("");
    });

    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("");
    console.error(
      "FATAL: Assignment history integrity verification failed to execute.",
    );
    console.error(
      error instanceof Error
        ? error.message
        : error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });