import { redirect } from "next/navigation";

import { getCurrentSession } from "./session";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STAFF";
  active: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getCurrentSession();

  if (!session || !session.user.active) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    active: session.user.active,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/business/login");
  }

  return user;
}

export async function requireRole(
  role: "ADMIN" | "STAFF",
): Promise<CurrentUser> {
  const user = await requireUser();

  if (user.role !== role) {
    redirect("/business");
  }

  return user;
}