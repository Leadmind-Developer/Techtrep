import { prisma } from "@/lib/prisma";
import type { AuditAction } from "@/generated/prisma/client";

export const ADMIN_AUDIT_LOG_PAGE_SIZE = 25;

export type AdminAuditLogFilters = {
  search?: string;
  action?: AuditAction;
  page?: number;
};

export async function getAdminAuditLogs(
  filters: AdminAuditLogFilters = {},
) {
  const search = filters.search?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where = {
    ...(filters.action
      ? {
          action: filters.action,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              ipAddress: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              requestId: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              user: {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              user: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({
      where,
    }),

    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        requestId: true,
        ipAddress: true,
        userAgent: true,
        metadata: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * ADMIN_AUDIT_LOG_PAGE_SIZE,
      take: ADMIN_AUDIT_LOG_PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ADMIN_AUDIT_LOG_PAGE_SIZE),
  );

  return {
    logs,
    total,
    page,
    totalPages,
    pageSize: ADMIN_AUDIT_LOG_PAGE_SIZE,
  };
}