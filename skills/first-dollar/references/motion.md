# Motion

Read this before adding any movement to the page. The recipes it names live in
`${CLAUDE_SKILL_DIR}/assets/motion/`, one self-contained HTML file each.

## How a page earns motion

Motion on a landing page has one job: show the product working. So the page
gets one **signature motion**, and it animates the product's mechanism inside
the page's labeled illustration (the HTML mock of the product's key output that
SKILL.md already asks for). It plays input, then process, then output.

- A voice memo that becomes a change order: the waveform plays, the change
  order fills in line by line as the playhead crosses each stretch, the client's
  signature draws.
- A compost bin: scraps go in, the days count up, soil comes out of the drawer.

If you cannot say the three beats of the mechanism in one sentence, the page
is not ready for motion. Build it still.

Then, at most **two supporting moves**, chosen to match the energy of the
founder's reference. Everything else on the page is still. Fade-up on every
section is not motion design; it is the most common sign a page was generated,
and a reader who has seen it once reads every later reveal as decoration.

| Reference energy | What it looks like | Motion budget |
|---|---|---|
| Quiet | Small type, wide margins, no movement on the reference | The signature, played once and short. Or nothing: a still illustration is a valid answer. At most `count-to-price` beside it. |
| Moderate | Confident type, one strong image or band, little movement | The signature plus one supporting move. |
| Loud | Display type at full width, full-bleed bands, movement on the reference | The signature plus two supporting moves. One pinned moment is allowed. |

Read the energy from the reference shots and DESIGN.md, not from taste. If
DESIGN.md says the reference has no motion, the budget is the quiet row.

## Rules

1. **Animate transform and opacity.** They run on the compositor and never move
   the layout. The one exception is `stroke-dashoffset` on a small number of SVG
   paths (a drawing, a signature): it paints, so keep it to a few dozen paths.
   Never animate `width`, `height`, `top`, `left`, `margin` or `filter`.
2. **One orchestrated load beats scattered micro-interactions.** The first
   screen gets one timeline with a staggered order and nothing else moves on
   load. No hover animation on every card, no animated arrows, no cursor
   followers, no parallax layers.
3. **Nothing animates away the ask or the price.** The `[data-commitment]`
   button never fades, slides, waits or moves. It is on screen from the first
   frame. A price on the page is correct at rest, before and after any motion.
4. **Content is visible by default.** Every recipe changes the page only from
   script (a `data-armed` attribute, or markup it builds), and only when motion
   is allowed. If the script fails, never runs, or the reader prefers reduced
   motion, the page shows its final state.
5. **Reduced motion shows the final state immediately, with all content
   visible.** No pin, no scrub, no loop, no hidden text, no waiting. Every recipe
   carries a `@media (prefers-reduced-motion: reduce)` block and a script guard.
6. **Words wait behind a mask, not behind opacity.** Hidden text rises out of a
   clipped box (a transform), so it is laid out and selectable from the first
   frame. The rendered check (`hidden-after-reveal`) reads text still under 0.1
   opacity about a second after load as missing, and it is right to.
7. **Banned, and the lint fails or warns on them:** bounce, elastic or
   overshooting easing (`bounce-easing`), `transition: all`
   (`transition-all`), pulsing, pinging or blinking dots (`pulse-dot`), and
   images that zoom on hover (`hover-zoom`). Also banned here: scroll hijacking,
   smooth-scroll libraries, looping motion on the illustration or near the ask,
   and any motion that delays reading.
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
handler fallback the recipes carry. None of the eight recipes loads a library.

GSAP is allowed when a sequence truly needs it (a long scrubbed timeline with
many labels). Load it from a pinned URL, never `latest`:
`https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js` and, for scroll,
`https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js`. Its
standard license allows it in any website's code, however that code was written;
what it prohibits is using it inside a no-code visual animation builder that
competes with Webflow. A landing page is not that. Prefer native tools when
they do the job: no download, no license question.

## Using a recipe

1. Pick from the budget above and the "never combine" lines below.
2. Copy the markup between `<!-- snippet: name -->` and `<!-- end snippet -->`
   and the CSS and script between the matching `/* ---- snippet ---- */`
   markers. The rest of the file is a demo page.
3. Map `--fd-ground`, `--fd-ink`, `--fd-accent`, `--fd-font-display` and
   `--fd-font-text` to DESIGN.md tokens. Derived tones are `color-mix()` of
   those three, so they follow the mapping.
4. Replace the demo copy with COPY.md. Sample values in an illustration stay
   generic and keep the visible caption ("Illustration. Numbers are
   examples."). A real fact the founder has not given stays `[NEED: ...]`.
5. Run the lint and the check. Then load the page with reduced motion
   emulated (devtools Rendering panel, or Playwright
   `page.emulateMedia({ reducedMotion: 'reduce' })`): every word visible.

Costs below are each snippet's script, gzipped, measured; none adds a request.

## The recipes

### mechanism-sequence (the signature template)
- **What:** one timeline in three beats inside the labeled illustration. Input
  plays, each part of it becomes a row of output as it finishes, the output
  lands (total, signature). Autoplays once when 35% of the figure is in view.
- **Fits:** every page that has a mock of the product's output. Build this
  first; every other move defers to it.
- **Never combine with:** a second autoplaying sequence; `pinned-steps` telling
  the same mechanism; a headline reveal playing in the same screen at the same
  moment (let the headline finish, then the figure).
- **At 390:** input stacks above output and the same timeline runs. Keep the
  figure within one screen so the whole mechanism plays in view.
- **Reduced motion:** the final state on first paint: input played, every row,
  the total and the signature visible.
- **Cost:** 1.4 KB. Transform, opacity and one short stroke draw; runs once.

### split-line-reveal
- **What:** the headline is split into its rendered lines and each rises out of
  its own mask in reading order; one rule draws under it. Re-splits on font load
  and width change. The lede and the ask never move.
- **Fits:** one headline worth slowing down for, four to seven lines at 1440.
  Moderate and loud references. This is the page's one orchestrated load.
- **Never combine with:** letter or word splits anywhere; a fade on the
  headline's container; `pinned-mask-reveal` in the first screen (two mask
  tricks); any motion on the ask.
- **At 390:** the measure cap drops and lines re-split at width. Over six lines
  at 390, cut the sentence, not the reveal.
- **Reduced motion:** no split at all. Plain text, rule drawn.
- **Cost:** 1.2 KB. One layout read per word on each split. If the headline is
  the largest element, its paint waits for the lines to clear their masks; the
  script caps the font wait at 600ms and the first line has no delay.

### stroke-draw
- **What:** the product drawn in SVG traces itself in, scrubbed to scroll, in
  drafting order: outline, parts, dimensions, callout leaders. Each numbered
  note beside the drawing settles as its leader arrives.
- **Fits:** physical products, plans, anything with real dimensions. Quiet and
  moderate references. For hardware it can be the signature itself.
- **Never combine with:** a second stroke-drawn device; grid or graph paper
  backgrounds (`grid-background`); animated dimension numbers.
- **At 390:** the notes move under the drawing and the drawing's labels step up
  in size. Leave about a third of a screen of page below it so it can finish.
- **Reduced motion:** fully drawn, every note visible, on first paint.
- **Cost:** 0.8 KB, mostly the fallback for browsers without scroll-driven
  animations. Stroke drawing paints, so keep the path count low.

### pinned-steps
- **What:** the section holds (CSS sticky) for about two screens while three
  steps take turns. The active step comes up to full ink and the illustration
  moves to that state. All three steps stay readable.
- **Fits:** a mechanism with three distinct states a still image cannot show.
  Moderate and loud references.
- **Never combine with:** `sticky-stack` or `pinned-mask-reveal` next to it;
  `mechanism-sequence` on the same mechanism; scroll snapping.
- **At 390:** the illustration sits above the list, the runway drops to 240svh
  and the steps tighten.
- **Reduced motion:** no pin; ordinary height; every step at full ink; the
  illustration in its final state.
- **Cost:** 0.8 KB. One position read per scroll frame; transform and opacity.

### count-to-price
- **What:** each digit of the price turns one full lap on its own wheel and
  settles, left to right, beside the ask. The wheels rest on the real price
  before and after; the button never moves.
- **Fits:** the offer block, with a real price. Any energy; the quietest
  supporting move there is.
- **Never combine with:** rolling any other number (an animated stat counter is
  the `stat-row` tell); a price that is still `[NEED: price]` (the script leaves
  it still); a second rolling price.
- **At 390:** unchanged. The button stays on one line.
- **Reduced motion:** the price is plain text.
- **Cost:** 0.9 KB. Twenty cells per digit, transform only, once.

### ticker-proof
- **What:** one slow row (40px a second) of the founder's real facts or the
  buyer's own words, looping without a seam. Pauses on hover, on focus, off
  screen, and from its Pause button.
- **Fits:** five to nine short items that are all real: a fact with its source,
  or words from a discovery call used with permission. Moderate and loud
  references.
- **Never combine with:** logos (`logo-row`); invented quotes or figures; a
  second marquee; a spot right beside the ask, where it pulls the eye away.
- **At 390:** the same row; items never wrap while moving.
- **Reduced motion:** no copies, no movement: a plain list, Pause button hidden.
- **Cost:** 0.8 KB. One compositor animation, paused off screen.

### sticky-stack
- **What:** three to five panels sticky at one rail, each a few pixels lower,
  so each lands on the last like a stack. The covered panel eases back (scale
  and a shade).
- **Fits:** an ordered set that each fills a panel: what happens after the buyer
  pays, the stages of a service. Loud references.
- **Never combine with:** `pinned-steps` or `pinned-mask-reveal` next to it;
  entrance animations inside the panels; a sticky header that does not clear
  the rail.
- **At 390:** one column, plate above text, a tighter rail and step, panel
  height set by content.
- **Reduced motion:** plain blocks in order.
- **Cost:** 0.7 KB. Sticky needs no script; one position read per panel.

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
