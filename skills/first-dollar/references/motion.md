# Motion

Read this before adding any movement to the page. The recipes it names live in
`${CLAUDE_SKILL_DIR}/assets/motion/`, one self-contained HTML file each.

## How a page earns motion

Motion on a landing page has one job: show the product working. So every page
gets one **signature motion**, placed by its material (SKILL.md stage 4):

- Software: it plays the mechanism inside the mock of the product's interface
  or output: input, process, then output. Keep the output inside a cropped
  mock at every width, including 390.
- A physical product or page with no mock region: tell the mechanism through
  the reference's non-photo device (design-rules.md, Filling image regions).
  In `pinned-steps` and `sticky-stack` each panel is that device, never a
  slot; a slot there counts against the page's two. Never animate a drawing
  that stands in for a photo. On a quiet reference, use `split-line-reveal`
  on the headline once and slowly.

If you cannot say the three beats of the mechanism in one sentence, the page
is not ready for motion. Build it still.

Then, at most **two supporting moves**, matched to the reference's energy.
Everything else is still. Fade-up on every section is the most common sign a
page was generated; after one, every later reveal reads as decoration.

| Reference energy | What it looks like | Motion budget |
|---|---|---|
| Quiet | Small type, wide margins, no movement on the reference | The signature only, once, at the slow end of rule 8's three to five seconds, with no supporting moves. Quiet is not still. |
| Moderate | Confident type, one strong image or band, little movement | The signature plus one supporting move. |
| Loud | Display type at full width, full-bleed bands, movement on the reference | The signature plus two supporting moves. One pinned moment is allowed. |

Read the energy from the reference shots and DESIGN.md, not from taste; no
motion on the reference means the quiet row. The check waits for animations
to settle before it judges, so never shorten a sequence to pass it.

## Rules

1. **Animate transform and opacity.** They run on the compositor and never move
   the layout. The exceptions are `stroke-dashoffset` on a few dozen SVG paths
   at most and a `clip-path` wipe on short labels; both paint, so keep them
   small. Never animate `width`, `height`, `top`, `left`, `margin` or `filter`.
2. **One orchestrated load beats scattered micro-interactions.** The first
   screen gets one timeline with a staggered order and nothing else moves on
   load. No hover animation on every card, no animated arrows, no cursor
   followers; the only parallax is `parallax-frame`, an image drifting in a fixed frame.
3. **Nothing animates away the ask or the price.** The `[data-commitment]`
   button never fades, slides, waits or moves, and no recipe styles it: the
   page styles its own button from DESIGN.md. A price never rolls, counts or
   spins; it is plain text from the first frame.
4. **Content is visible by default.** Every recipe changes the page only from
   script (a `data-armed` attribute, or markup it builds), and only when motion
   is allowed. If the script never runs, fails partway, or the reader prefers
   reduced motion, the page shows its final state.
5. **Reduced motion shows the final state immediately, with all content
   visible.** No pin, no scrub, no loop, no hidden text, no waiting. Every recipe
   carries a `@media (prefers-reduced-motion: reduce)` block and a script guard.
6. **Words wait behind a mask, briefly.** Hidden text rises out of a clipped box
   or wipes in, so its line is already laid out and nothing below it shifts when
   it lands. No word stays hidden for more than one beat of its sequence, and a
   word never appears before the thing it labels.
7. **Banned, and the lint fails or warns on them:** bounce, elastic or
   overshooting easing (`bounce-easing`; the one overshoot allowed is the
   landing mark in `spring-settle`), `transition: all` (`transition-all`),
   pulsing, pinging or blinking dots (`pulse-dot`), and images that zoom on
   hover (`hover-zoom`). Also banned here: numbers that roll or count up
   (prices, stats, day counts; a playback clock with its own media is the one
   exception), scroll hijacking, smooth-scroll libraries, and any motion that delays reading.
8. **Easing and time.** Entrances ease out: `cubic-bezier(0.22, 1, 0.36, 1)`.
   Interface feedback is 150 to 250ms. A set piece beat is 600 to 1000ms.
   Stagger 60 to 120ms. The signature runs three to five seconds, once.
9. **Anything moving for over five seconds gets a pause control** (see `ticker-proof`).
10. **Never name a font family.** Recipes read `--fd-font-display` and
    `--fd-font-text`; wire them to the DESIGN.md faces.

## Tools, in order of preference

CSS transitions and keyframes, the Web Animations API (`element.animate`),
`IntersectionObserver` to start a sequence once, and CSS scroll-driven
animations (`animation-timeline`) for scrubbed moves, with the small scroll
handler fallback the recipes carry. The first seven recipes load no library.

GSAP is allowed when a sequence truly needs it (a long scrubbed timeline with
many labels). Load it from a pinned URL, never `latest`:
`https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js` and, for scroll,
`https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js`. Its
license allows it in any website's code; it bars only no-code animation
builders that compete with Webflow. Prefer native tools when they do the job.

`motion` (MIT) is the second allowed CDN, for the last five recipes only:
`import { animate, scroll, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.0.0/+esm"`,
pinned exactly, never `@latest`. Its 6 KB entry pulls four requests, about
52 KB gzipped, once per page. Motion+ effects are paid and never copied.

## Using a recipe

1. Pick from the budget above and the "never combine" lines below.
2. Copy the markup between `<!-- snippet: name -->` and `<!-- end snippet -->`
   and the CSS and script between the matching `/* ---- snippet ---- */`
   markers. Those three parts are all a recipe needs; the rest is a demo page.
   The last five each go in their own `<script type="module">`, not a shared or classic one.
3. Set `--fd-ground`, `--fd-ink`, `--fd-accent`, `--fd-font-display` and
   `--fd-font-text` on the page's `:root` from DESIGN.md. Each snippet reads
   them once on its own root, with a fallback, and derives its muted tone,
   hairline and easing from them unless the page sets `--fd-muted`,
   `--fd-rule` or `--fd-ease-out`.
4. Replace the demo copy with COPY.md. Sample values in a mock stay generic.
   No self-describing caption; one honesty line at most in the footer. A real
   fact the founder has not given stays `[NEED: ...]`.
5. Run the lint and the check. Then load the page with reduced motion
   emulated (devtools Rendering panel, or Playwright
   `page.emulateMedia({ reducedMotion: 'reduce' })`): every word visible.

Costs below are each snippet's script, gzipped, measured; the first seven add no request.

## The recipes

### mechanism-sequence (the signature template)
- **What:** one timeline in three beats inside the labeled mock. Input
  plays, each part of it becomes a row of output as it finishes, the output
  lands (total, signature). Autoplays once when the figure's top rises past the lower quarter of the screen.
  Only the rows are required; drop the timer, total or signature freely.
- **Fits:** any page with a mock of the product's output; on a quiet page it
  plays alone, slowly. Build this first; every other move defers to it.
- **Never combine with:** a second autoplaying sequence; `pinned-steps` telling
  the same mechanism; a headline reveal playing in the same screen at the same
  moment (let the headline finish, then the figure).
- **At 390:** input stacks above output and the same timeline runs. Keep the
  figure within one screen so the whole mechanism plays in view.
- **Reduced motion:** the final state on first paint: input played, every row,
  the total and the signature visible. The same if the script fails mid-run.
- **Cost:** 1.6 KB. Transform, opacity and one short stroke draw; runs once.

### split-line-reveal
- **What:** the headline is split into its rendered lines and each rises out of
  its own mask in reading order; one rule draws under it. Re-splits on font load
  and width change. The lede and the ask never move.
- **Fits:** one headline worth slowing down for, ideally one or two lines at
  1440. Preserve a longer reference headline's rhythm when needed.
- **Never combine with:** letter or word splits anywhere; a fade on the
  headline's container; `pinned-mask-reveal` in the first screen (two mask
  tricks); any motion on the ask.
- **At 390:** the measure cap drops and lines re-split at width. Over six lines
  at 390, cut the sentence, not the reveal.
- **Reduced motion:** no split at all. Plain text, rule drawn.
- **Cost:** 1.4 KB. One layout read per word on each split. If the headline is
  the largest element, its paint waits for the lines to clear their masks; the
  script caps the font wait at 600ms and the first line has no delay.

### stroke-draw
- **What:** the product drawn in SVG traces itself in, scrubbed to scroll, in
  drafting order: outline, parts, dimensions, callout leaders. Each dimension
  number wipes in as its line ends, each ring draws at the end of its leader,
  and the matching note rises out of its row on the same slice of scroll.
- **Fits:** physical products, plans, anything with real dimensions, only
  where the reference region is a drawing. Moderate references. There it can
  be the signature itself.
- **Never combine with:** a second stroke-drawn device; grid or graph paper
  backgrounds (`grid-background`); a label that shows before its line.
- **At 390:** the notes move under the drawing and the drawing's labels step up
  in size. Leave about a third of a screen of page below it so it can finish.
- **Reduced motion:** fully drawn, every number and note visible.
- **Cost:** 0.9 KB, mostly the fallback for browsers without scroll-driven
  animations. Stroke drawing paints, so keep the path count low.

### pinned-steps
- **What:** the section holds (CSS sticky) for about two screens while three
  plates take turns in one frame: each a color field with the step's own word
  at display scale and the product's artifact, or a real founder asset.
  Waiting steps drop to the muted tone (4.5:1 or better), never to low
  opacity. On load it jumps to the scroll's state without animating.
- **Fits:** a mechanism with three distinct states a still image cannot show;
  the physical-product signature on moderate and loud references.
- **Never combine with:** `sticky-stack` or `pinned-mask-reveal` next to it;
  `mechanism-sequence` on the same mechanism; scroll snapping; a counter.
- **At 390:** plates above the list, a 240svh runway, tighter steps.
- **Reduced motion:** no pin; ordinary height; every step at full ink, each
  beside its own plate in normal flow.
- **Cost:** 0.7 KB. One position read per scroll frame; transform and opacity.

### ticker-proof
- **What:** above 480px, one slow row (40px a second) of the founder's real
  facts or the buyer's own words, looping without a seam. Each item is capped
  at 80% of the screen and wraps there. Pauses on hover, focus, off screen and
  from its Pause button. Measured after fonts load and on every width change.
- **Fits:** five to nine short items (under about 80 characters) that are all
  real: a fact with its source, or words from a discovery call used with
  permission. Loud references; elsewhere ship the static list.
- **Never combine with:** logos (`logo-row`); invented quotes or figures; a
  second marquee; a spot right beside the ask, where it pulls the eye away.
- **At 390:** a static stacked list. Nothing moves at 480px and below.
- **Reduced motion:** no copies, no movement: a plain list, Pause button hidden.
- **Cost:** 1.1 KB. One compositor animation, paused off screen.

### sticky-stack
- **What:** three to five panels sticky at one rail, each a few pixels lower
  (an inline `--i` numbers them), so each lands on the last like a stack. The
  covered panel eases back (scale and a shade). Each panel is a color field
  holding the step's word at display scale or the product's artifact; at
  most one inline slot, counted against the page's two.
- **Fits:** an ordered set that each fills a panel: what happens after the buyer
  pays, the stages of a service, a product's mechanism through an artifact
  and text. Moderate and loud references.
- **Never combine with:** `pinned-steps` or `pinned-mask-reveal` next to it;
  entrance animations inside the panels; a sticky header that does not clear
  the rail.
- **At 390:** one column, artifact above text, a tighter rail and step,
  panel height set by content.
- **Reduced motion:** plain blocks in order.
- **Cost:** 0.9 KB. Sticky needs no script; rails are measured on resize and
  each frame reads every panel once, then writes.

### pinned-mask-reveal
- **What:** the frame holds while four page-colored shutters slide away from a
  narrow slot until the whole plate shows. The plate never moves.
- **Fits:** one picture worth arriving at: the founder's real photo, or the
  labeled mock of the output. A chapter break. Loud references.
- **Never combine with:** another mask device on the page, including
  `split-line-reveal` in the same screen; parallax or a fade on the plate; copy
  that must be read during the reveal.
- **At 390:** opens on the vertical axis only, frame at 74svh, runway 170svh.
- **Reduced motion:** no pin, no shutters; the plate fully open.
- **Cost:** 0.5 KB, nearly all of it the fallback for browsers without
  scroll-driven animations. Four transformed layers.

### spring-settle (serves the signature)
- **What:** a software mock's rows rise out of their masks on a spring, 120ms
  apart, then one row's mark springs in and its note rises. Once, about 3.5s.
- **Fits:** a list mock below the first screen (in the first screen it stays
  still: use `mechanism-sequence`). Its mark is the one overshoot allowed.
- **Never combine with:** `mechanism-sequence` also playing; springs elsewhere.
- **Reduced motion:** every row, the mark and its note on first paint.

### parallax-frame (supporting)
- **What:** a photo drifts 8% of a fixed frame's height, scrubbed. Until the
  photo exists the frame is one of the page's two slots, a third of a screen tall.
- **Fits:** photo-led references: editorial, food, places. One per page.
- **Never combine with:** text or the ask in the drift; layered parallax.
- **Reduced motion:** the photo sits centered; nothing is linked.

### center-stagger-grid (supporting)
- **What:** cells fade in and rise 8px in rings out from the center, 80ms apart.
- **Fits:** a real grid below the first screen: spec cells, swatches, variants.
- **Never combine with:** fade-up on any other section; a grid made to have one.
- **Reduced motion:** every cell visible on first paint.

### scroll-rule (supporting)
- **What:** a 2px rule beside one long text draws with scroll through it alone.
- **Fits:** long-form references: a letter of intent, terms, a founder's note.
- **Never combine with:** a page-wide reading bar; a second rule.
- **Reduced motion:** the rule fully drawn.

### ring-fill (needs the founder's real numbers)
- **What:** a ring draws once to a real fraction; its number is static text.
- **Fits:** beside the terms. No founder numbers: `[NEED: ...]`, never a ring.
- **Never combine with:** the ask or its button; a countdown.
- **Reduced motion:** the ring at its fraction on first paint.
