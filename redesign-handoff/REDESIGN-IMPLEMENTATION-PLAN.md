# Redesign implementation plan (executing `prompts/redesignui.md`)

Scope: **frontend only.** No change to Payload schema, collections, API routes, routing, sitemap, robots, metadata builders or JSON-LD builders. Existing URLs, slugs and CMS data shapes stay.

## Decisions (made from the brief + the audit in SITE-BRIEF.md)
| Topic | Decision |
|---|---|
| Direction | "Modern premium hybrid creative studio": flat paper (`#f3f2f2`) pages, ink (`#201e1d`) cinematic bands, red used sparingly. Archivo only (variable). One token set for every page. |
| Red | Brand `#ec3013` for display accents, rules, marks. Tonal shade `#d1260b` for button fills and small red text (AA: white on it 5.26:1). No purple/blue/gradients. |
| Removed | gradients, glass pill header, grain/vignette/atmosphere overlays, dot grid, floating hero cards, doodles/Caveat, magnetic buttons, cursor spotlight, rolling-number odometer, auto-rotating testimonials, sticky mobile CTA bar, hard-coded "Tools" tiles, text-only "featured on Google…" strip. |
| Motion | One small `Reveal` (fade + 12px, once, off under `prefers-reduced-motion`) on section headings/blocks only; CSS hover transitions; native `<dialog>` for video. |
| Type scale | display / h1 / section / h3 / lead / body / eyebrow / meta classes in `globals.css`. |
| Layout | Container 1280px, `px-5 sm:px-8 lg:px-12`; sections `py-20 md:py-28`. Radius 6px for media/panels, pill only for buttons/chips. |
| Copy | Layout-owned copy (hero, work/videos/clients headings) in `lib/home-copy.ts`; everything else (services, process, stats, FAQ, testimonials, manifesto, problem, final CTA) still comes from the CMS so admin edits keep working. |
| Trust strip | Replaces the Google/Meta/… pills with the **real** client names from published portfolio items. CMS `trustLogos` data is left untouched, just not rendered. |
| Video showcase | New `components/video/*`: 9:16 grid (2/3/4 cols), lazy posters, native `<dialog>` lightbox, Esc/backdrop/close, arrow-key prev/next, scroll lock, video loaded only on open. Data = existing portfolio `mediaType: video` (thumbnail → poster, `videoUrl` via `parseVideoUrl`). **No backend change.** Homepage section renders only when ≥1 video exists (none are published today); `/work/videos` always renders. |
| Blog | Same routes/data; restyled cards, branded typographic cover when a post has no image (no fake photos), cleaner article typography, the non-functional "newsletter coming soon" block replaced by a real contact CTA. |
| Footer/nav | Primary nav: Work · Services · Videos · Process · Blog + "Start a project". Full CMS link set stays in the footer. Footer social/legal links whose URL is the `/#top` placeholder are not rendered (dead links) — flagged for the owner. |
| a11y | skip link, mobile menu with Esc + focus handling, visible focus rings everywhere, reduced-motion, AA contrast pairs, 44px touch targets on primary controls. |

## Execution order
1. Tokens + `globals.css` + `layout.tsx` (fonts, skip link, drop overlays/MobileCTA) + primitives (Button, Container, Reveal, Accordion).
2. Header + Footer + WhatsApp button.
3. Homepage: Hero → Clients → Work → Videos → Services → Results → Problem → Manifesto → Process → Testimonials → FAQ → Final CTA.
4. Video showcase + `/work/videos` (+ detail page restyle).
5. Work detail, Contact, Influencer pages; branded not-found / error.
6. Blog index/archives/article/components.
7. Dead-code removal (only files proven unreferenced).
8. Verify: `eslint`, `tsc --noEmit`, `next build`; Playwright at 390 / 768 / 1440 (overflow, console errors, screenshots); SEO diff (metadata, JSON-LD, headings, sitemap, robots, links).
