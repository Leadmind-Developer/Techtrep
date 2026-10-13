import { createHash, randomBytes } from "node:crypto";

const SERVICE_REPORT_TOKEN_TTL_DAYS = 30;

export function createServiceReportToken() {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() +
      SERVICE_REPORT_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

export function hashServiceReportToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}
