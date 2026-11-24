# Iteration 3 — layout system fix (from `prompts/redesignv3.md`)

Scope: layout, alignment, spacing, overflow. **No change** to visual design, copy, colours, type, data or SEO.

## Root causes found (audit of v2)
| Cause | Where |
|---|---|
| Magic-number gutters (`calc((100vw-1280px)/2+3rem)`) to fake container alignment | hero, work lead |
| Negative margins / `%` widths / absolute positioning to place images | hero (`-ml-10`, `right-[-4%]`, `-bottom-24`, `w-[86%]`), work lead (`-ml-12`) |
| Hard-coded offsets compensating for misalignment | `mt-32`, `pt-16`, `pt-24`, `pl-[5.75rem]`, `right-[22%]` |
| Narrow widths applied to `Container` itself (re-centres, so the left edge moves page to page) | blog post, work, influencer, 404, video detail |
| 5 different section paddings; heading clamp copy-pasted 6× | all sections |
| Absolute quote mark; header nav not truly centred | testimonials, header |

## The system (one shared set of rules)
1. **Container** = `max-w 1280px`, `px 20 / 32 / 48` (unchanged) — the only horizontal boundary. Narrow reading columns are an **inner** `max-w-*` that stays left-aligned to the same edge.
2. **Section rhythm** = one class `.section` (80px → 112px) on every section; head→content gap = `mt-12 md:mt-16`.
3. **Heading scale** = `.text-section` (one definition), used everywhere instead of inline clamps.
4. **12-col grid** inside the container for every two-part layout; offsets come from grid placement (`items-end`, row/column lines), never margins.
5. **Hero** = full-width two-tone background (`paper | red` split at 50%, which is the container's centre line) + one container with `lg:grid-cols-2`; the visual is a normal grid in the right column, nothing overlaps unintentionally.
6. **Header** = `grid-cols-[1fr_auto_1fr]`, `items-center`, fixed height, same container.

## Per-area fixes
Hero (two-column grid, contained images) · Work (A/B/C re-laid on the 12-col grid, index becomes a 4-column row grid with thumbnails) · Services (shared padding token so intro and rows top-align; expanded content uses the summary's own column template) · Why (grid alignment instead of `pt-16`) · Testimonials (quote mark in flow; right column aligned by grid) · Video wall (inside the container) · Footer (wordmark inside container, sized to fit) · Blog/Work/Influencer/Video pages (left-aligned inner columns) · Process/Results/FAQ/CTA (shared rhythm + heading class).

## Verification
Automated: horizontal overflow at 375/390/768/1024/1280/1440/1920; left/right edge of every section's content vs. the header logo's edge (must match within 1px); header vertical centres; hero images contained in their column. Visual: section-by-section screenshots at 390 / 768 / 1440. Then tsc, eslint, build, SEO diff.
