export type AttributionInput = {
  referrer?: unknown;
  landingPage?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmTerm?: unknown;
  utmContent?: unknown;
};

export type AttributionData = {
  ipAddress: string;
  userAgent: string;
  referrer: string;
  landingPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  device: string;
  browser: string;
};

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function classifyDevice(userAgent: string): string {
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  if (/mobi/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

function classifyBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent)) return "Chrome";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return "Safari";
  return "Other";
}

/** Last-touch attribution: values captured at submit time, not a first-touch session cookie. */
export function buildAttribution(headers: Headers, input: AttributionInput): AttributionData {
  const userAgent = text(headers.get("user-agent"), 500);
  const ipAddress =
    text(headers.get("x-forwarded-for"), 200).split(",")[0]?.trim() || text(headers.get("x-real-ip"), 200);

  return {
    ipAddress,
    userAgent,
    referrer: text(input.referrer, 500),
    landingPage: text(input.landingPage, 500),
    utmSource: text(input.utmSource, 200),
    utmMedium: text(input.utmMedium, 200),
    utmCampaign: text(input.utmCampaign, 200),
    utmTerm: text(input.utmTerm, 200),
    utmContent: text(input.utmContent, 200),
    device: classifyDevice(userAgent),
    browser: classifyBrowser(userAgent),
  };
}
