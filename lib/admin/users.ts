import { prisma } from "@/lib/prisma";

export const ADMIN_USER_PAGE_SIZE = 20;

export type AdminUserFilters = {
  search?: string;
  role?: "ADMIN" | "STAFF";
  active?: boolean;
  page?: number;
};

export async function getAdminUsers(
  filters: AdminUserFilters = {},
) {
  const search = filters.search?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) &&
    (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where = {
    ...(filters.role
      ? {
          role: filters.role,
        }
      : {}),
    ...(typeof filters.active === "boolean"
      ? {
          active: filters.active,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * ADMIN_USER_PAGE_SIZE,
      take: ADMIN_USER_PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ADMIN_USER_PAGE_SIZE),
  );

  return {
    users,
    total,
    page,
    totalPages,
    pageSize: ADMIN_USER_PAGE_SIZE,
  };
}

export async function getAdminUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}