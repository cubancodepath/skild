import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyGitHubSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const received = signatureHeader.slice("sha256=".length);
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
