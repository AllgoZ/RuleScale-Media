import { getTurnstileSecretKey } from "@/lib/env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Returns true (pass) when Turnstile isn't configured — honeypot + rate limiting still apply. */
export async function verifyTurnstile(token: string, ipAddress: string): Promise<boolean> {
  const secret = getTurnstileSecretKey();
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ipAddress ? { remoteip: ipAddress } : {}),
      }),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("[turnstile] Verification request failed", error);
    return false;
  }
}
