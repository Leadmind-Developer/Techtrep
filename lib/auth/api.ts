import { NextResponse } from "next/server";

import { getCurrentUser } from "./authorization";

export async function requireApiUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function requireApiRole(
  role: "ADMIN" | "STAFF",
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      ),
    };
  }

  if (user.role !== role) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "You do not have permission to perform this action.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    user,
    response: null,
  };
}