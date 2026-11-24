# Redesign iteration 2 — art direction plan (from `prompts/redesignv2.md`)

Diagnosis of v1: right alignment, wrong personality. One background tone, one section recipe (label + heading + grid), thin dividers, red-dot labels, cards, equal-size type. v2 changes the *composition and contrast*, not the spacing.

## Signature elements (what makes it recognisably RuleScale)
1. **The brand device**: the ring + bolt from the logo, drawn huge and cropped, used in the hero panel, the "why" section, the CTA and the footer.
2. **Full-bleed brand red used as a surface** (hero panel, "why us" split), not just as a dot. Ink on red / white on red only at large sizes (AA large-text).
3. **Alternating surfaces**: paper → ink band → white → ink wall → paper → red → paper → ink → paper → white → ink. Every neighbour differs.
4. **Imagery leads**: real portfolio mockups at different crops (full-bleed, overlapped, portrait) — never equal cards.
5. **Type scale with intent**: display only in 3 places (hero 60px, "why" statement, process numerals); everything else medium.

## Section sequence and composition
| # | Section | Surface | Composition |
|---|---|---|---|
| 1 | Hero | paper + red half-panel | Split: compact headline left; right half is a full-bleed red panel with two overlapping project images breaking out of it, oversized bolt cropped behind. No stats. |
| 2 | Clients | ink band | Slow marquee of real client names separated by bolt glyphs (static under reduced-motion). |
| 3 | Work | white | A: image bleeds off the left edge, ink caption block overlaps it. B: medium landscape + offset portrait crop. C: remaining projects as a big-type index with hover image preview. Minimal metadata. |
| 4 | Videos | ink | Edge-to-edge wall of staggered 9:16 tiles, no cards, red play mark, text only on hover (desktop). Shown when ≥1 video is published; `/work/videos` is the same wall full-page. |
| 5 | Services | paper | Sticky intro left; right = three big numbered groups as native `<details>` (exclusive, first open). Collapsed row = group name + service names inline; open = the descriptions. All text stays in the DOM. |
| 6 | Why us (Problem + Manifesto) | red | Split: three "I've been here" statements left, the manifesto line huge right, ring+bolt cropped behind. |
| 7 | Results | paper | One row of very large numerals, tiny labels, no boxes. |
| 8 | Process | ink | Zig-zag rows with giant outlined step numerals. |
| 9 | Testimonials | paper | One huge featured quote with an oversized red quote mark; the others small beside it. No rotation. |
| 10 | FAQ | white | Sticky heading left, accordion right. |
| 11 | Final CTA | ink | Huge headline left, contact methods as large links right, bolt device behind. |
| 12 | Footer | ink | Links + a giant dim wordmark across the bottom. |

## Removed patterns
Red-dot eyebrows (eyebrow is now plain small caps, used sparingly), thin divider lines as structure (surface changes do that job), identical 3-col grids, rounded cards.

## Constraints kept
No backend/schema/route/SEO changes; CMS still drives services, process, stats, FAQ, testimonials, problem, manifesto, final CTA; real assets only; Ink `#201e1d` / Paper `#f3f2f2` / Red `#ec3013` (+ white and the `#d1260b` tonal red for small text).

## Verify
tsc, eslint, build; Playwright 390/768/1440 screenshots reviewed critically against the quality-bar questions; video wall fixture test; SEO diff vs production.
