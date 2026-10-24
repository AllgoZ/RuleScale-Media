import type { RequiredDataFromCollectionSlug } from "payload";
import { NextResponse } from "next/server";
import {
  FieldError,
  authenticateStaff,
  compact,
  jsonError,
  lexicalToMarkdown,
  markdownToLexical,
  optionalBoolean,
  optionalDate,
  optionalHttpsUrl,
  optionalNumber,
  optionalObject,
  optionalString,
  optionalStringArray,
  parseStatus,
  readJsonBody,
  slugify,
} from "@/lib/content-api";
import { SITE_URL } from "@/lib/constants";

// Agent-facing authoring endpoint for portfolio items / case studies. See
// "Architecture files/content-api.md". POST upserts by slug (Markdown -> Lexical for the case
// study body), GET reads one back as Markdown. No DELETE on purpose (admin-only collection access).
// Thumbnails: upload the file to /api/portfolio/upload first (it accepts the same API key), then
// pass the returned secureUrl/publicId/width/height/format here.

export async function POST(request: Request) {
  const auth = await authenticateStaff(request);
  if ("response" in auth) return auth.response;
  const { payload } = auth;

  const body = await readJsonBody(request);
  if (body instanceof NextResponse) return body;

  try {
    const title = optionalString(body, "title");
    const slug = optionalString(body, "slug") || (title ? slugify(title) : undefined);
    if (!slug) return jsonError('Provide "slug" (or "title" to derive one).', 400);

    const existing = await payload.find({
      collection: "portfolio",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      draft: true,
    });
    const current = existing.docs[0];

    const client = optionalString(body, "client");
    if (!current) {
      const missing = (["title", "client"] as const).filter((key) => !optionalString(body, key));
      if (missing.length) {
        return jsonError(`Creating a portfolio item requires: ${missing.join(", ")}.`, 400);
      }
    }

    const mediaType = optionalString(body, "mediaType");
    if (mediaType !== undefined && mediaType !== "image" && mediaType !== "video") {
      return jsonError('"mediaType" must be "image" or "video".', 400);
    }

    const markdown = optionalString(body, "markdown");
    const services = optionalStringArray(body, "services");
    const seo = optionalObject(body, "seo");
    const status = parseStatus(body) ?? "published";

    const data = compact({
      title,
      client,
      slug,
      featured: optionalBoolean(body, "featured"),
      mediaType,
      category: optionalString(body, "category"),
      description: optionalString(body, "description"),
      resultHeadline: optionalString(body, "resultHeadline"),
      services: services?.map((service) => ({ service })),
      thumbnailUrl: optionalHttpsUrl(body, "thumbnailUrl"),
      thumbnailPublicId: optionalString(body, "thumbnailPublicId"),
      thumbnailWidth: optionalNumber(body, "thumbnailWidth"),
      thumbnailHeight: optionalNumber(body, "thumbnailHeight"),
      thumbnailFormat: optionalString(body, "thumbnailFormat"),
      videoUrl: optionalHttpsUrl(body, "videoUrl"),
      caseStudyContent: markdown ? await markdownToLexical(payload, markdown) : undefined,
      liveWebsite: optionalHttpsUrl(body, "liveWebsite"),
      sortOrder: optionalNumber(body, "sortOrder"),
      publishedAt:
        optionalDate(body, "publishedAt") ??
        (!current?.publishedAt && status === "published" ? new Date().toISOString() : undefined),
      seo: seo
        ? {
            ...current?.seo,
            ...compact({
              metaTitle: optionalString(seo, "metaTitle"),
              metaDescription: optionalString(seo, "metaDescription"),
              canonicalUrl: optionalString(seo, "canonicalUrl"),
              metaImage: optionalHttpsUrl(seo, "metaImage"),
            }),
          }
        : undefined,
      _status: status,
    });

    const doc = current
      ? await payload.update({
          collection: "portfolio",
          id: current.id,
          data: data as RequiredDataFromCollectionSlug<"portfolio">,
          depth: 0,
        })
      : await payload.create({
          collection: "portfolio",
          data: data as RequiredDataFromCollectionSlug<"portfolio">,
          depth: 0,
        });

    const path = doc.mediaType === "video" ? `/work/videos/${doc.slug}` : `/work/${doc.slug}`;
    return NextResponse.json(
      {
        ok: true,
        action: current ? "updated" : "created",
        id: doc.id,
        slug: doc.slug,
        status: doc._status,
        url: `${SITE_URL}${path}`,
      },
      { status: current ? 200 : 201 }
    );
  } catch (error) {
    if (error instanceof FieldError) return jsonError(error.message, 400);
    console.error("[content-api] portfolio upsert failed", error);
    return jsonError(error instanceof Error ? error.message : "Failed to save item.", 500);
  }
}

export async function GET(request: Request) {
  const auth = await authenticateStaff(request);
  if ("response" in auth) return auth.response;
  const { payload } = auth;

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    const list = await payload.find({
      collection: "portfolio",
      limit: 100,
      sort: "sortOrder",
      depth: 0,
      draft: true,
      select: { title: true, client: true, slug: true, featured: true, mediaType: true, _status: true },
    });
    return NextResponse.json({
      docs: list.docs.map((p) => ({
        title: p.title,
        client: p.client,
        slug: p.slug,
        featured: p.featured ?? false,
        mediaType: p.mediaType,
        status: p._status,
      })),
    });
  }

  const found = await payload.find({
    collection: "portfolio",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
  });
  const item = found.docs[0];
  if (!item) return jsonError(`No portfolio item with slug "${slug}".`, 404);

  return NextResponse.json({
    title: item.title,
    client: item.client,
    slug: item.slug,
    status: item._status,
    featured: item.featured ?? false,
    mediaType: item.mediaType,
    category: item.category ?? null,
    description: item.description ?? null,
    resultHeadline: item.resultHeadline ?? null,
    services: (item.services ?? []).map((s) => s.service),
    thumbnailUrl: item.thumbnailUrl ?? null,
    videoUrl: item.videoUrl ?? null,
    markdown: await lexicalToMarkdown(payload, item.caseStudyContent),
    liveWebsite: item.liveWebsite ?? null,
    sortOrder: item.sortOrder ?? 0,
    publishedAt: item.publishedAt ?? null,
    seo: item.seo ?? {},
  });
}
