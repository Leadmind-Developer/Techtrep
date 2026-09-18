import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "business_session";
const REQUEST_ID_HEADER = "x-request-id";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestId =
    request.headers.get(REQUEST_ID_HEADER) ?? randomUUID();

  if (!pathname.startsWith("/business")) {
    const response = NextResponse.next();

    response.headers.set(REQUEST_ID_HEADER, requestId);

    return response;
  }

  if (pathname === "/business/login") {
    const response = NextResponse.next();

    response.headers.set(REQUEST_ID_HEADER, requestId);

    return response;
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/business/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl);

    response.headers.set(REQUEST_ID_HEADER, requestId);

    return response;
  }

  const response = NextResponse.next();

  response.headers.set(REQUEST_ID_HEADER, requestId);

  return response;
}

export const config = {
  matcher: ["/business/:path*"],
};