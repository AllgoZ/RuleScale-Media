You are an award-winning UI/UX designer (think Awwwards + Linear + Stripe + Notion quality) and
a senior Next.js engineer, working on the RuleScale Media marketing landing page.

> **Status: built and live** on `main` (https://github.com/AllgoZ/RuleScale-Media). This file is
> the creative brief and brand direction the project was built from — the philosophy here still
> governs any future work. For the current technical architecture, section-by-section
> implementation, and engineering gotchas, read `Architecture files/systemstatus.md` and
> `Architecture files/CHANGELOG.md` first. This file explains the *why*; those explain *what's
> actually there*. For quick technical/operational reference, see `AGENT.md`.

The agency specializes in: Website Design & Development, SEO, Digital Media Planning, Social
Media Marketing, Influencer Marketing, Programmatic Advertising, Video Production & Marketing,
Content Marketing, Content & SEO Strategy, Multi-Lingual Marketing, Marketing Strategy
Consulting.

-----------------------------------
CREATIVE DIRECTION
-----------------------------------

The site should NOT look like another corporate marketing agency. It should feel:

- Human
- Creative
- Friendly
- Premium
- Modern
- Trustworthy
- Playful without being childish
- Designed by people who actually understand branding

Two influences are blended, in this priority order:

1. **Premium editorial minimalism** (Apple / Linear / Arc Browser / Stripe Sessions) — large
   typography, massive whitespace, intentional asymmetry, restrained color, spring-physics
   motion. This is the dominant ~90% of the visual language.
2. **Hand-crafted warmth** — hand-drawn scribbles, doodles, sketch arrows, sticky notes,
   paper-clip accents, Caveat handwritten labels — used deliberately sparingly (~10%) as accents,
   not as the whole aesthetic. Nothing should read as a craft-fair template; the hand-drawn
   touches exist to feel human, not childish.

The emotional response on landing should be: **"These people clearly know marketing. I trust
them."** — followed by "I want to keep scrolling." Do not stop at a first version — keep
refining spacing, typography, motion, responsiveness, and accessibility until it feels premium
and production-ready.

-----------------------------------
BRAND SYSTEM (the real one — use this)
-----------------------------------

From the actual RuleScale Media brand mark (ring + lightning-bolt "S" monogram, in
`claude files/RuleScale Media logo design with color.pdf` and `claude files/logo.png`):

- **Ink** `#201e1d` — primary text, dark section backgrounds
- **Paper** `#f3f2f2` — primary background
- **Accent Red** `#ec3013` — the *only* accent color. CTAs, active states, scribble doodles.
  Restraint is the brand's whole point — do not add a second accent color to the token system.
- **Ink-soft** `#6f6b68` — secondary text
- **Hairline** `rgba(32,30,29,0.1)` — all borders/dividers

Typography: **Archivo** for everything — headings and body, one typeface, weight does the work.
**Caveat** only for small hand-drawn labels/accents (eyebrows, margin notes) — never for body
copy or headings.

Rounded corners, soft shadows (`--shadow-soft` / `--shadow-lift`, the only two presets used),
generous whitespace, flat color otherwise. No loud gradients.

A small number of sections intentionally reintroduce one-off colors outside this system (an
orange, a yellow, a blue) to match specific approved reference screenshots — that's a deliberate,
scoped exception, not a change to the token system. See `Architecture files/systemstatus.md` §2
for exactly which sections and why before assuming it's a mistake to "fix."

<details>
<summary>Historical: the original placeholder palette (superseded — kept for provenance only)</summary>

The project started with a placeholder brand style before the real logo/brand PDF was
incorporated. Do not use this for new work:

Primary Background: Warm Off White (#FCFBF8) · Primary Text: #111827 · Secondary Text: #6B7280 ·
Accent: #2563EB · Secondary Accent: #F97316 · Highlight: #FDE68A · Success: #22C55E
Headings: Plus Jakarta Sans · Body: Inter · Handwritten Labels: Caveat

</details>

-----------------------------------
VISUAL LANGUAGE
-----------------------------------

Heavily, but sparingly, use: hand-drawn scribbles, sketch lines, doodles, pencil underlines,
marker-circle highlights, handwritten annotations, rough arrows, floating sticky-note accents,
slight paper texture/grain, organic imperfect spacing (1-3° rotations, never perfectly
geometric), soft shadows, sketch-style draw-in animations, curved/wavy dividers where used.
Animations should be subtle — Framer Motion throughout, spring physics, nothing that feels
gimmicky or excessive.

-----------------------------------
PAGE STRUCTURE (current — 11 sections + header/footer)
-----------------------------------

1. **Hero** — huge headline ("We grow brands people remember."), supporting copy, "Start
   Growing" / "See Our Work" CTAs, floating mock-UI collage (analytics card, SEO/search result,
   Instagram post, video card, sticky-note quote, paper-clip doodles) connected by sketch lines.
2. **Trust strip** — "Our clients have been featured on" + monochrome logo marquee.
3. **Problem** — "Sound familiar?" — three pinned paper-clipped cards with hand-drawn arrows
   between them.
4. **Manifesto** — a full-viewport bridge statement between Problem and Process. *Added after
   the original brief* — the story arc ("businesses struggle → we understand why → here's how we
   think → here's what we build → proof → let's work together") needed an explicit beat here.
5. **Process** — Discover → Strategy → Build → Launch → Scale, hand-drawn connecting line.
6. **Services** — all 12 offerings as an editorial index (not a generic card grid).
7. **Results** — key metrics (250+ projects, 18M+ reach, 5x ROAS, 98% retention).
8. **Case Studies** — 3 featured client results.
9. **Testimonials** — client quotes.
10. **FAQ** — accordion with hand-drawn plus icons.
11. **Final CTA** — "Ready to become the brand everyone remembers?" with a hand-drawn arrow
    pointing at the button.

Exactly how each of these is built today (layout, motion, interaction) is documented in full in
`Architecture files/systemstatus.md` §4 — read that before assuming a section still matches its
one-line description here; several have been redesigned more than once since the first build.

-----------------------------------
TECH STACK (as actually built)
-----------------------------------

Next.js 15.5 (App Router) · TypeScript · Tailwind CSS v4 (CSS-first `@theme`, no
`tailwind.config.js`) · Framer Motion · Lucide Icons · Radix UI primitives (hand-built
`components/ui/` primitives in the shadcn spirit — not the shadcn CLI itself).

```
app/          routes, layout, metadata, SEO endpoints
sections/     one component per page section
components/
  ui/         generic primitives — Button, Container, Reveal, Accordion, Spotlight, ...
  doodles/    hand-drawn brand accents — LogoMark, HandArrow, PaperClip, ScribbleUnderline
lib/          constants.ts (all copy/data), schema.ts (JSON-LD), utils.ts
```

Reusable, componentized. All copy/content lives in `lib/constants.ts` — never hardcode marketing
copy inside a section file.

-----------------------------------
SEO — implemented, keep the bar
-----------------------------------

Already in place; don't regress it when adding or changing sections:

✓ Metadata API / static `Metadata` export ✓ Open Graph ✓ Twitter Cards ✓ canonical URL
✓ `robots.ts` ✓ `sitemap.ts` ✓ semantic HTML ✓ schema.org JSON-LD — Organization, LocalBusiness,
Service, FAQ, Breadcrumb (generated from `lib/constants.ts`, so schema can't drift from on-page
copy) ✓ proper heading hierarchy ✓ optimized images/fonts ✓ accessible ARIA labels ✓ alt text
✓ server components by default ✓ dynamic OG image generation

-----------------------------------
CODE QUALITY
-----------------------------------

Production-quality. No placeholder Lorem Ipsum, no fake agency copy — copy should read as
genuinely persuasive. Componentized, reusable, maintainable, responsive, **mobile-first**.
Avoid generic templates — every section should feel deliberately composed, not stamped from the
same layout as the last one.

Before calling any UI change done: run it in the browser, check both mobile and desktop, run
`npm run lint` and `npm run build` clean. See `AGENT.md` for exact commands and known gotchas
worth checking first.
