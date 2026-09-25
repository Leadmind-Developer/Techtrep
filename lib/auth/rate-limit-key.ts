import { createHmac } from "node:crypto";

function getRateLimitKeySecret(): string {
  const secret = process.env.AUTH_RATE_LIMIT_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_RATE_LIMIT_SECRET is required for authentication rate-limit key generation.",
    );
  }

  return secret;
}

function createIdentifierHash(identifier: string): string {
  return createHmac("sha256", getRateLimitKeySecret())
    .update(identifier)
    .digest("hex");
}

export function getLoginAccountRateLimitKey(
  email: string,
): string {
  return createIdentifierHash(email.trim().toLowerCase());
}