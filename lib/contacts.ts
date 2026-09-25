import { prisma } from "@/lib/prisma";
import type { Prisma } from "../generated/prisma/client";

export const CONTACT_PAGE_SIZE = 10;

export type ContactListFilters = {
  search?: string;
  organizationId?: string;
  page?: number;
};

export async function getContacts(
  filters: ContactListFilters = {},
) {
  const search = filters.search?.trim() ?? "";
  const organizationId =
    filters.organizationId?.trim() ?? "";

  const page =
    Number.isInteger(filters.page) && (filters.page ?? 1) > 0
      ? filters.page ?? 1
      : 1;

  const where: Prisma.ContactWhereInput = {};

  if (organizationId) {
    where.organizationId = organizationId;
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        role: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        organization: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [total, contacts] = await Promise.all([
    prisma.contact.count({ where }),

    prisma.contact.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * CONTACT_PAGE_SIZE,
      take: CONTACT_PAGE_SIZE,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / CONTACT_PAGE_SIZE),
  );

  return {
    contacts,
    total,
    page,
    totalPages,
    pageSize: CONTACT_PAGE_SIZE,
  };
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({
    where: { id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          website: true,
          industry: true,
          companySize: true,
        },
      },

      leads: {
        orderBy: { createdAt: "desc" },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      audits: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          source: true,
          scheduledAt: true,
          completedAt: true,
          reportSentAt: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getContactFormOptions() {
  return prisma.organization.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}