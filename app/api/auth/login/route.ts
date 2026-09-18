import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit-log";
import { getRequestId } from "@/lib/api/request";
import { getLoginAccountRateLimitKey } from "@/lib/auth/rate-limit-key";
import {
loginAccountRateLimit,
loginIpRateLimit,
} from "@/lib/rate-limit";
import { authenticateUser } from "@/lib/auth/user";
import { logger } from "@/lib/logger";

function isValidEmail(email: string): boolean {
return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
}

function getClientIp(request: Request): string | null {
const forwardedFor = request.headers.get("x-forwarded-for");

if (forwardedFor) {
return forwardedFor.split(",")[0]?.trim() || null;
}

return request.headers.get("x-real-ip");
}

function getRetryAfterSeconds(reset: number): number {
return Math.max(
1,
Math.ceil((reset - Date.now()) / 1000),
);
}

function createRateLimitResponse(
requestId: string,
reset: number,
) {
const retryAfter = getRetryAfterSeconds(reset);

return NextResponse.json(
{
success: false,
message:
"Too many login attempts. Please try again later.",
},
{
status: 429,
headers: {
"x-request-id": requestId,
"Retry-After": String(retryAfter),
},
},
);
}

export async function POST(request: Request) {
const requestId = getRequestId(request);
const ipAddress = getClientIp(request);
const userAgent = request.headers.get("user-agent");

try {
const body = await request.json();

const email =
  typeof body.email === "string"
    ? body.email.trim().toLowerCase()
    : "";

const password =
  typeof body.password === "string"
    ? body.password
    : "";

if (
  !email ||
  !password ||
  !isValidEmail(email)
) {
  logger.warn("Login validation failed", {
    requestId,
    reason: "invalid_input",
  });

  await createAuditLog({
    action: "LOGIN_FAILED",
    requestId,
    ipAddress,
    userAgent,
    metadata: {
      reason: "invalid_input",
    },
  });

  return NextResponse.json(
    {
      success: false,
      message: "Invalid email or password.",
    },
    {
      status: 401,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

const accountRateLimitKey =
  getLoginAccountRateLimitKey(email);

let ipRateLimitResult:
  | Awaited<
      ReturnType<typeof loginIpRateLimit.limit>
    >
  | null = null;

let accountRateLimitResult:
  | Awaited<
      ReturnType<
        typeof loginAccountRateLimit.limit
      >
    >
  | null = null;

try {
  if (ipAddress) {
    ipRateLimitResult =
      await loginIpRateLimit.limit(ipAddress);

    await ipRateLimitResult.pending;
  }

  accountRateLimitResult =
    await loginAccountRateLimit.limit(
      accountRateLimitKey,
    );

  await accountRateLimitResult.pending;
} catch (error) {
  logger.error(
    "Login rate-limit check failed",
    {
      requestId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    },
  );

  /*
   * Fail open if the rate-limit service is
   * temporarily unavailable. Authentication
   * itself must remain available even if Redis
   * has an outage.
   */
}

const rateLimitExceeded =
  ipRateLimitResult !== null &&
  !ipRateLimitResult.success;

const accountRateLimitExceeded =
  accountRateLimitResult !== null &&
  !accountRateLimitResult.success;

if (
  rateLimitExceeded ||
  accountRateLimitExceeded
) {
  const resetCandidates = [
    ipRateLimitResult?.reset,
    accountRateLimitResult?.reset,
  ].filter(
    (value): value is number =>
      typeof value === "number",
  );

  const reset =
    resetCandidates.length > 0
      ? Math.max(...resetCandidates)
      : Date.now() + 10 * 60 * 1000;

  logger.warn(
    "Login rate limit exceeded",
    {
      requestId,
      reason: rateLimitExceeded
        ? "ip_rate_limited"
        : "account_rate_limited",
    },
  );

  await createAuditLog({
    action: "LOGIN_FAILED",
    requestId,
    ipAddress,
    userAgent,
    metadata: {
      reason: "rate_limited",
      limitType: rateLimitExceeded
        ? "ip"
        : "account",
    },
  });

  return createRateLimitResponse(
    requestId,
    reset,
  );
}

const user = await authenticateUser(
  email,
  password,
);

if (!user) {
  logger.warn("Login failed", {
    requestId,
    reason: "invalid_credentials",
  });

  await createAuditLog({
    action: "LOGIN_FAILED",
    requestId,
    ipAddress,
    userAgent,
    metadata: {
      reason: "invalid_credentials",
    },
  });

  return NextResponse.json(
    {
      success: false,
      message: "Invalid email or password.",
    },
    {
      status: 401,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

/*
 * A successful login should not leave the
 * account consuming its failed-login allowance.
 *
 * Reset only the account-specific limiter.
 * The IP limiter remains active.
 */
try {
  await loginAccountRateLimit.resetUsedTokens(
    accountRateLimitKey,
  );
} catch (error) {
  logger.error(
    "Failed to reset account login rate limit",
    {
      requestId,
      userId: user.id,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    },
  );
}

await createAuditLog({
  action: "LOGIN_SUCCESS",
  userId: user.id,
  requestId,
  ipAddress,
  userAgent,
});

logger.info("Login successful", {
  requestId,
  userId: user.id,
  role: user.role,
});

return NextResponse.json(
  {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  },
  {
    headers: {
      "x-request-id": requestId,
    },
  },
);

} catch (error) {
logger.error(
"Authentication request failed",
{
requestId,
error:
error instanceof Error
? error.message
: "Unknown error",
},
);


return NextResponse.json(
  {
    success: false,
    message:
      "Unable to process your login request.",
  },
  {
    status: 500,
    headers: {
      "x-request-id": requestId,
    },
  },
);

}
}
