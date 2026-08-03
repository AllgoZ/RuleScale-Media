const warned = new Set<string>();

function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[env] ${message}`);
}

/**
 * Optional integration keys degrade gracefully when unset (matches this codebase's existing
 * fallback conventions — e.g. lib/cms falling back to constants.ts, Payload logging emails to
 * the console when no adapter is configured) rather than throwing at startup.
 */
export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    warnOnce("RESEND_API_KEY is not set — lead emails will be logged to the console instead of sent.");
    return null;
  }
  return key;
}

export function getTurnstileSecretKey(): string | null {
  const key = process.env.TURNSTILE_SECRET_KEY;
  if (!key) {
    warnOnce("TURNSTILE_SECRET_KEY is not set — Turnstile verification is skipped.");
    return null;
  }
  return key;
}

export function getTurnstileSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;
}

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    warnOnce(
      "CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET are not fully set — portfolio thumbnail/video upload is disabled until all three are configured."
    );
    return null;
  }
  return { cloudName, apiKey, apiSecret };
}
