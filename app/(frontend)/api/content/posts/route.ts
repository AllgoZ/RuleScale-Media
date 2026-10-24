import type { Payload, RequiredDataFromCollectionSlug } from "payload";
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
  optionalObject,
  optionalString,
  optionalStringArray,
  parseStatus,
  readJsonBody,
  slugify,
} from "@/lib/content-api";
import { SITE_URL } from "@/lib/constants";

// Agent-facing authoring endpoint for blog posts. See "Architecture files/content-api.md".
// POST upserts by slug (Markdown body -> Lexical), GET reads one post back as Markdown.
// No DELETE on purpose: the collection's delete access is admin-only and an API key is an editor.

async function resolveTaxonomy(
  payload: Payload,
  collection: "categories" | "tags",
  label: string
): Promise<number> {
  const slug = slugify(label);
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) return existing.docs[0].id;
  const created = await payload.create({ collection, data: { title: label, slug } });
  return created.id;
}

async function resolveAuthor(payload: Payload, slug: string | undefined): Promise<number> {
  if (slug) {
    const found = await payload.find({
      collection: "authors",
      where: { slug: { equals: slugify(slug) } },
      limit: 1,
      depth: 0,
    });
    if (!found.docs[0]) {
      const all = await payload.find({ collection: "authors", limit: 50, depth: 0 });
      throw new FieldError(
        `Unknown author "${slug}". Available: ${all.docs.map((a) => a.slug).join(", ") || "none"}.`
      );
    }
    return found.docs[0].id;
  }
  const first = await payload.find({ collection: "authors", limit: 1, sort: "createdAt", depth: 0 });
  if (!first.docs[0]) {
    throw new FieldError("No authors exist yet — create one in /admin first, then pass its slug.");
  }
  return first.docs[0].id;
}

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
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      draft: true,
    });
    const current = existing.docs[0];

    const excerpt = optionalString(body, "excerpt");
    const markdown = optionalString(body, "markdown");
    if (!current) {
      const missing = (["title", "excerpt", "markdown"] as const).filter(
        (key) => !optionalString(body, key)
      );
      if (missing.length) {
        return jsonError(`Creating a post requires: ${missing.join(", ")}.`, 400);
      }
    }

    const status = parseStatus(body) ?? "published";
    const category = optionalString(body, "category");
    const tags = optionalStringArray(body, "tags");
    const seo = optionalObject(body, "seo");

    const data = compact({
      title,
      slug,
      excerpt,
      content: markdown ? await markdownToLexical(payload, markdown) : undefined,
      featuredImageUrl: optionalHttpsUrl(body, "featuredImageUrl"),
      featuredImageAlt: optionalString(body, "featuredImageAlt"),
      category: category ? await resolveTaxonomy(payload, "categories", category) : undefined,
      tags: tags ? await Promise.all(tags.map((t) => resolveTaxonomy(payload, "tags", t))) : undefined,
      author:
        optionalString(body, "author") !== undefined || !current
          ? await resolveAuthor(payload, optionalString(body, "author"))
          : undefined,
      publishedDate:
        optionalDate(body, "publishedDate") ??
        (!current?.publishedDate && status === "published" ? new Date().toISOString() : undefined),
      featured: optionalBoolean(body, "featured"),
      seo: seo
        ? {
            ...current?.seo,
            ...compact({
              metaTitle: optionalString(seo, "metaTitle"),
              metaDescription: optionalString(seo, "metaDescription"),
              canonicalUrl: optionalString(seo, "canonicalUrl"),
            }),
          }
        : undefined,
      _status: status,
    });

    const doc = current
      ? await payload.update({
          collection: "posts",
          id: current.id,
          data: data as RequiredDataFromCollectionSlug<"posts">,
          depth: 0,
        })
      : await payload.create({
          collection: "posts",
          data: data as RequiredDataFromCollectionSlug<"posts">,
          depth: 0,
        });

    return NextResponse.json(
      {
        ok: true,
        action: current ? "updated" : "created",
        id: doc.id,
        slug: doc.slug,
        status: doc._status,
        url: `${SITE_URL}/blog/${doc.slug}`,
      },
      { status: current ? 200 : 201 }
    );
  } catch (error) {
    if (error instanceof FieldError) return jsonError(error.message, 400);
    console.error("[content-api] posts upsert failed", error);
    return jsonError(error instanceof Error ? error.message : "Failed to save post.", 500);
  }
}

export async function GET(request: Request) {
  const auth = await authenticateStaff(request);
  if ("response" in auth) return auth.response;
  const { payload } = auth;

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    const list = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "-updatedAt",
      depth: 0,
      draft: true,
      select: { title: true, slug: true, _status: true, publishedDate: true },
    });
    return NextResponse.json({
      docs: list.docs.map((p) => ({
        title: p.title,
        slug: p.slug,
        status: p._status,
        publishedDate: p.publishedDate,
      })),
    });
  }

  const found = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
  });
  const post = found.docs[0];
  if (!post) return jsonError(`No post with slug "${slug}".`, 404);

  return NextResponse.json({
    title: post.title,
    slug: post.slug,
    status: post._status,
    excerpt: post.excerpt,
    markdown: await lexicalToMarkdown(payload, post.content),
    featuredImageUrl: post.featuredImageUrl ?? null,
    featuredImageAlt: post.featuredImageAlt ?? null,
    category: typeof post.category === "object" ? post.category?.title ?? null : null,
    tags: (post.tags ?? []).flatMap((t) => (typeof t === "object" ? [t.title] : [])),
    author: typeof post.author === "object" ? post.author?.slug ?? null : null,
    publishedDate: post.publishedDate ?? null,
    featured: post.featured ?? false,
    seo: post.seo ?? {},
  });
}
