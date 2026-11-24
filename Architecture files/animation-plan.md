# Animation plan

Date: 2026-11-24. Goal: make the site feel alive and smooth without costing speed, accessibility or the
brand's restraint. Built on the rules in `CLAUDE.MD` (Motion + Performance sections) and
`ARCHITECTURE.md` section 9.

## 1. Principles (non-negotiable)

1. **Compositor-only.** Animate `transform` and `opacity` only (plus one `clip`-free scale on images). No
   layout properties, no scroll-jacking, no parallax, no scroll-linked JS.
2. **CSS first, zero new dependencies.** One tiny client component (an IntersectionObserver); Framer
   Motion stays confined to the influencer form.
3. **Never hide what the user needs first.** Everything is visible in the server HTML and with JS off.
   Hero text may fade; the hero **image and headline animate with transform only**, so LCP is not delayed.
   Below-the-fold blocks are hidden by JS only after hydration, and only if they start off-screen.
4. **One motion language.** One easing (`--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`), durations 0.25-0.9 s,
   stagger steps of 70 ms capped at 5 steps, each element animates once.
5. **`prefers-reduced-motion: reduce` = no motion**: nothing hidden, no transitions, no entrance, marquee stops.
6. **No regressions:** CLS stays 0, JS weight does not grow measurably, static pages stay static, no
   hydration warnings.

## 2. Catalogue

| # | Animation | Where | How |
|---|-----------|-------|-----|
| A | **Hero load-in** (staggered) | Hero: kicker, headline, lead, CTAs, two project tiles | CSS keyframes on first paint (`.hero-in` fade+rise; `.hero-slide` transform-only for headline/tiles) |
| B | **Scroll reveal system** `data-anim` | Work covers + captions + index rows, service rows, result stats, process rows (numeral slides in from its side), testimonial quotes, FAQ items, blog cards, video tiles | `data-anim="up\|fade\|scale\|left\|right"` + `data-anim-step="1-5"`; one `AnimationObserver` (IntersectionObserver) toggles `data-anim-state`; CSS does the rest |
| C | **Page transition** on client-side navigation | Every route change after the first load | `app/(frontend)/template.tsx` adds a 0.35 s fade + 8 px rise to the incoming page; skipped on first load so it can't affect LCP |
| D | **Button & link micro-interactions** | `Button` (all variants), header nav links | Press scale (0.97), 2 px lift + soft shadow on filled buttons, arrow nudge, nav underline that grows from the left |
| E | **Smooth open/close** | Services `<details>` groups | `::details-content` block-size transition (progressive enhancement; instant where unsupported) |
| F | Existing, kept | Client marquee, image hover zoom, FAQ accordion keyframes, `Reveal` on section headers, native `<dialog>` lightbox | unchanged |

Out of scope / deliberately not added: count-up numbers (retired in the brief), parallax, scroll-linked
progress bars, cursor effects, auto-rotating anything, animated gradients, looping decorative animation
(battery cost, brand restraint).

## 3. Implementation map

- `app/(frontend)/globals.css`: easing token, keyframes, `.hero-in`/`.hero-slide`, `[data-anim]` states,
  `.page-enter`, nav-link underline, `details` transition, one reduced-motion block that switches all of it off.
- `components/ui/animation-observer.tsx` (client, mounted once in `layout.tsx`): scans `[data-anim]`, leaves
  anything already in view alone, hides the rest, reveals on intersect, re-scans on route change.
- `app/(frontend)/template.tsx`: page transition (client navigations only).
- Attributes/classes added to: `sections/hero.tsx`, `featured-work.tsx`, `services.tsx`, `results.tsx`,
  `process.tsx`, `testimonials.tsx`, `faq.tsx`, `components/blog/post-grid.tsx` + `post-card.tsx`,
  `components/video/video-showcase.tsx`, `components/ui/button.tsx`, `sections/header.tsx`.
- No copy, data, route, CMS or SEO changes.

## 4. Acceptance checks

1. `tsc`, eslint, `npm run build` clean; build log free of DB errors; route table unchanged (`○`/`●`).
2. No hydration or console errors on any page; no horizontal overflow (3 engines x 5 viewports x 7 pages).
3. With JS disabled and with `prefers-reduced-motion: reduce`: all content visible, nothing animates.
4. After scrolling the full page, zero elements left in `data-anim-state="hidden"`.
5. CLS = 0; LCP and JS weight not worse than the 2026-11-24 baseline (`performance-audit.md`).
6. Visual check mid-animation and settled, at 390 and 1440 px.

## 5. Result (2026-11-24, production build, local)

Implemented as planned (A-E). Acceptance checks:

| Check | Result |
|-------|--------|
| tsc / eslint / build | clean; 0 DB errors; route table unchanged |
| Hydration / console errors | none (mobile and desktop home, blog after client navigation) |
| Overflow, broken images, h1 count | 3 engines x 5 viewports x 7 pages: none |
| Reduced motion / JS off | all content visible, no animation (`hero-in` animation = none; 0 SSR-hidden elements) |
| Everything reveals | home: 37 targets, all hidden at load (below the fold) -> all `done` after scrolling, in Chromium, Firefox, WebKit |
| Page transition | `.page-enter` absent on first load, present after client navigation; layout unchanged |
| CLS / LCP / JS | CLS 0; mobile LCP 244-252 ms (unchanged); JS +2 KB (622 -> 624 KB home) |
| Hero | mid-animation: headline/tiles sliding, lead/buttons fading; settled layout identical to before |
| Services `<details>` | height animates (147 -> 319 -> 372 -> 381 -> 382 px), exclusive group still closes |
| Button hover | `translate: 0 -2px` and transitions listed (`translate`, `scale`) after a fix |

Known limits / backlog: not tested on real devices; `<details>` animation is progressive enhancement (instant in
browsers without `::details-content`); Why/Final-CTA/footer keep only the section-header `Reveal` (deliberately,
to avoid double animation); a reading-progress bar for articles was considered and left out.
