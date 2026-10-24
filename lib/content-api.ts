import {
  convertLexicalToMarkdown,
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import type { Payload, PayloadRequest } from "payload";
import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/cms/payload-client";

// Shared plumbing for the agent-facing authoring endpoints under /api/content/*.
// These exist because Payload's raw REST API only accepts rich text as Lexical JSON, which is
// impractical to hand-write. The endpoints take Markdown instead, convert it server-side, and
// upsert by slug. Auth is Payload's own (session or `Authorization: users API-Key <key>`) —
// nothing here bypasses it, and there is deliberately no delete.

export type ContentBody = Record<string, unknown>;

export function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json({ error, ...(details ? { details } : {}) }, { status });
}

export async function authenticateStaff(
  request: Request
): Promise<{ payload: Payload } | { response: NextResponse }> {
  const payload = await getPayloadClient();
  try {
    const { user } = await payload.auth({
      req: request as unknown as PayloadRequest,
      headers: request.headers,
    });
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return { response: jsonError("Unauthorized", 401) };
    }
  } catch (error) {
    console.error("[content-api] Failed to verify credentials", error);
    return { response: jsonError("Unauthorized", 401) };
  }
  return { payload };
}

export async function readJsonBody(request: Request): Promise<ContentBody | NextResponse> {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError("Request body must be a JSON object.", 400);
    }
    return body as ContentBody;
  } catch {
    return jsonError("Request body is not valid JSON.", 400);
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Returns the trimmed string, or undefined when the key is absent. Throws on a wrong type. */
export function optionalString(body: ContentBody, key: string): string | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new FieldError(`"${key}" must be a string.`);
  return value.trim();
}

export function optionalBoolean(body: ContentBody, key: string): boolean | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") throw new FieldError(`"${key}" must be a boolean.`);
  return value;
}

export function optionalNumber(body: ContentBody, key: string): number | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new FieldError(`"${key}" must be a number.`);
  }
  return value;
}

export function optionalStringArray(body: ContentBody, key: string): string[] | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new FieldError(`"${key}" must be an array of strings.`);
  }
  return (value as string[]).map((item) => item.trim()).filter(Boolean);
}

export function optionalObject(body: ContentBody, key: string): ContentBody | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new FieldError(`"${key}" must be an object.`);
  }
  return value as ContentBody;
}

export function optionalHttpsUrl(body: ContentBody, key: string): string | undefined {
  const value = optionalString(body, key);
  if (value === undefined || value === "") return value;
  if (!/^https:\/\//i.test(value)) throw new FieldError(`"${key}" must be an https:// URL.`);
  return value;
}

export function optionalDate(body: ContentBody, key: string): string | undefined {
  const value = optionalString(body, key);
  if (value === undefined || value === "") return value;
  if (Number.isNaN(new Date(value).getTime())) {
    throw new FieldError(`"${key}" must be an ISO date, e.g. 2026-10-24.`);
  }
  return new Date(value).toISOString();
}

export function parseStatus(body: ContentBody): "published" | "draft" | undefined {
  const value = optionalString(body, "status");
  if (value === undefined) return undefined;
  if (value !== "published" && value !== "draft") {
    throw new FieldError('"status" must be "published" or "draft".');
  }
  return value;
}

export class FieldError extends Error {}

export async function markdownToLexical(payload: Payload, markdown: string) {
  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  return convertMarkdownToLexical({ editorConfig, markdown });
}

export async function lexicalToMarkdown(payload: Payload, data: unknown): Promise<string> {
  if (!data) return "";
  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  return convertLexicalToMarkdown({
    data: data as Parameters<typeof convertLexicalToMarkdown>[0]["data"],
    editorConfig,
  });
}

/** Drops keys whose value is undefined so a partial update never blanks untouched fields. */
export function compact<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}
