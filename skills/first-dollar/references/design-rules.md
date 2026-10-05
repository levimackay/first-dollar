# Design rules

Load at stage 4 with the extraction, and keep it open through stages 5 and 6.
The reference supplies the direction. These rules fill the gaps it leaves and
stop the gaps from filling with defaults. A lint rule id in brackets means the
rule is enforced; see slop-rules.md for the fix. Decide on purpose, before
markup, and write it in DESIGN.md.

## Before any markup

Write these into the Overview section of DESIGN.md:

- Design read, one line: page kind, buyer, and a feeling that has an opposite.
  "Pre-order page for site foremen. Feels like a well-made tool, not a
  dashboard." "Modern and clean" has no opposite, so it decides nothing.
- The one thing a visitor remembers. "A clean layout" is not one.
- What it is not: name the near miss. "Not a SaaS page with a gradient."
- Where boldness is spent: one place only.
- The default check: for each choice, ask "would this come out for any similar
  startup?". Change every yes and write what changed.
- Material: for each planned section, what it is made of and who supplies it:
  the founder's real assets, a labeled illustration or concept mock, or
  `[PLACEHOLDER: ...]` boxes (SKILL.md). Keep and fill every image region of
  the reference (below); cut a text section nothing fills. An empty page gets
  filled with big type, gradients, bordered cards and soft glows: the
  signature.

## Type

- Two families at most: one for display, one for text, both matched to the
  reference by features (design-extraction.md section 6). No default or
  popular faces [`banned-font-family`, `font-popularity`].
- Monospace only for code and for data in tables, and only if the reference
  itself uses mono. Never for fine print, captions, terms lines or labels
  [`mono-prose`].
- Where the reference leaves the pairing open, pair for contrast: serif with
  grotesque, or condensed display with a humanist text face. Two similar sans
  faces are not a pair. One variable
  family pushed across its full weight range also works, but it draws a
  `single-sans-family` warning: answer it in DESIGN.md.
- Use extremes: weight 300 against 800, not 400 against 600. Display at least
  2.5 times the body size, 3 or more is better [`flat-type-scale`].
- Build a scale from a ratio: 1.2 (dense, editorial), 1.25, 1.333, or 1.5
  (poster). Example, 18px body at 1.333: 18, 24, 32, 43, 57, 76px. Do not
  hand-pick sizes.
- Display gets negative tracking: about -0.02em at 48px, -0.03em to -0.04em
  above 72px, never tighter than -0.04em. Body stays at 0.
- Line height falls as size rises: body 1.5 to 1.65, headings 1.05 to 1.2.
- Body measure 60 to 75 characters: `max-width: 65ch` [`long-measure`].
- No gradient on words [`gradient-text`]. No accent color on one word of the
  headline. No italic display headline by reflex.
- `font-variant-numeric: tabular-nums` on prices, dates and counts.
- Sentence case on headings and buttons. `text-wrap: balance` on headings,
  `text-wrap: pretty` on paragraphs.

## Color

- Sample, never describe: the ground, ink and accent come from `--palette` on
  the reference screenshot (design-extraction.md section 2), or on the
  founder's photos when the page is built around them.
- One anchor. Neutrals the reference does not show are derived from it in
  OKLCH, tinted toward its hue (chroma about 0.005 to 0.02), recorded as hex.
  Pure `#000`, `#fff` and `#808080` read as untouched.
- One accent, used mainly by the commitment button. A second color only for
  error states.
- No accent hue in the reference (ink on paper): the accent is the
  reference's strongest ink or its button color. Never invent a hue.
- Commit to a dominant: one color owns most of the surface. Five colors at 20%
  each reads undecided.
- Match the reference's energy, not only its hex values: its saturation and
  how much of the screen its accent owns. A loud reference makes a loud page.
- Light or dark comes from the reference: a dark reference makes a dark page
  (`reference-drift`). Never from the category ("dev tools are dark"), and
  never an off-white ground out of habit.
- Banned: the indigo, violet, purple and fuchsia family, and cyan to purple
  gradients [`ai-palette`, `tailwind-defaults`]. Cream paper with a serif and a
  terracotta accent is the newer default; use it only when the reference has it.
- Gradients: two linear at most, no radial, no blurred glow layers
  [`gradient-budget`]. No colored glow shadows [`glow-shadow`].
- Contrast: 4.5:1 for body text, 3:1 for text 24px and up. The check script
  measures it. Grey on grey at 3:1 for body reads cheap.
- Theme the browser surfaces from tokens: `::selection`, `caret-color`, a
  `:focus-visible` ring at 3:1, `accent-color`, `scrollbar-color`,
  `text-underline-offset` [`browser-surfaces`].

## Space

- One base unit (4px or 8px). Every margin, padding and gap is a multiple.
- Vary section padding on purpose: a tight cluster, then a large breath
  [`uniform-section-padding`]. Write the order of the swings in DESIGN.md Layout.
- Swing density hard: a full-width band carrying one line, then a dense table
  of terms.
- Let at least one element escape the container [`no-full-bleed`]. Not every
  block at the same width [`same-max-width`].
- Break the grid once, at the moment that matters most. On these pages that is
  usually the commitment block or the proof.
- Take the hero's shape from the reference. The centered stack fails
  [`centred-hero`]; headline left with a card right on every page is the newer
  stack (tells.md).
- More space above a heading than below it.
- Radius: one or two values from the reference, each with a reason. A pill
  button only when the reference has one. Never the same radius on
  everything [`uniform-radius`]. No
  cards inside cards [`nested-cards`]. No colored stripe down one side of a
  box [`side-stripe`].
- No dot or line grid backgrounds [`grid-background`].

## Motion

- One signature motion that animates the product's mechanism inside the
  labeled illustration, plus up to two supporting moves matched to the
  reference's energy (motion.md). Nothing else moves.
- Content is visible without the animation. The check script fails text still
  hidden after scrolling (`hidden-after-reveal`).
- Animate `transform` and `opacity` only. Never `transition: all`
  [`transition-all`].
- 120 to 200ms for hover and press, 250 to 400ms for entrances.
- Ease out for anything entering, for example `cubic-bezier(0.2, 0.8, 0.2, 1)`.
  No overshoot or bounce [`bounce-easing`].
- No zoom on image hover [`hover-zoom`], no pulsing dots [`pulse-dot`], no
  animated arrows.
- `prefers-reduced-motion: reduce`: keep the opacity fades, drop the movement.
- Never fade or slide away the headline or the commitment button while it is
  on screen.

## Macrostructures

Take the shape from the reference before styling anything. Any shape works if
the first screen holds the offer, the price and the button, the objection
answers sit near the button, and a real person stands behind it.

| Shape | What it is | Suits |
|---|---|---|
| Letter | One column at reading width in the founder's voice; price inline and again in a terms box | Services and pilots sold on trust |
| Specimen | The product very large in the first screen; the offer small and exact under it | Physical goods with a founder-supplied photo, or a render captioned as a render |
| Spec sheet | A dense table of what you get, when, and for how much | Technical buyers who compare |
| Split | A sticky pane with price, terms and button beside a scrolling pane of mechanism and proof | Keeping the commitment in view on long pages |
| Stat-led | One real number dominating the first screen: the price, the ship date, the cap | Offers where one fact decides |
| Manifesto | A strong statement, then what you will and will not build | Opinionated tools |
| Before and after | Today's workaround beside the new way | Replacing a known chore |
| Walkthrough | 3 to 5 steps of the real flow with real screenshots | A prototype that already works |
| Order form | The page is the form: options, quantity, price, button | Pre-orders with variants |

Never the only structure: hero, three cards, testimonials, CTA
[`three-card-row`, `stat-row`, `logo-row`]. No bento grid by reflex.

## Filling image regions

SKILL.md stage 4 sets the order: the founder's asset, then a drawn
illustration or a concept mock, then a hatched placeholder. Never a void.

Measure first. On the reference's `1440.png` and `390.png`, note each image
region's box: its share of the width, its height against the first screen,
whether it bleeds off an edge, and where text sits on or beside it. The fill
takes the same box. A full-bleed photo hero stays full bleed. At 390, keep it
where the reference's phone layout keeps it, with a real height.

**A drawn illustration (inline SVG).** For a physical product, or any object
the buyer will hold.

- Draw the product, not a mood: its silhouette in profile or three-quarter
  view, from a few rects, ellipses and paths. Under about 40 shapes; detail
  that does not read at 390 is noise.
- Draw it big. The object fills 60 to 80% of the region. A small drawing
  centered in a large empty box is still a void.
- Color only from DESIGN.md tokens, set by class in the stylesheet
  (`.illo .body { fill: var(--primary); }`), never hex in attributes. Three
  tones give depth without gradients: a fill, a darker side, a line.
- Match the reference's energy. A photo hero that floods the screen with color
  gets a drawing on a flood of the anchor or accent, not a thin outline on
  paper.
- One stroke width, flat fills, no gradients, shadows or glows. Never a 24x24
  viewBox with round caps and a 2px stroke [`icon-libraries`].
- Label it: a visible "Illustration" caption in the text face at a size
  people read, plus `role="img"` and an `aria-label` that names what it shows.

**An HTML and CSS mock.** For software, or any product whose output is a
screen or a document.

- Build the one screen that shows the outcome (the signed change order, the
  report) at real proportions, in the page's fonts and tokens.
- Sample values are generic and plausible, never a real person or company.
  Caption it: "Concept. Numbers are examples."
- Crop and place it the way the reference treats its photo. If the photo
  bleeds off the edge, the mock bleeds too. At display scale, one detail set
  large (a single row of the report) can beat the whole screen set small.
- One surface with rows and rules inside. Cards inside a card fail
  [`nested-cards`].

**A hatched placeholder.** When neither fits, or the region needs a real photo
(the founder, a place, the product in use).

- Same box as the reference image, full bleed if it was.
- Hatch with an inline SVG pattern, not a CSS gradient. A
  `repeating-linear-gradient` hatch draws `grid-background` and
  `placeholder-styled` warnings and spends the gradient budget.
- The label names the photo that belongs there and its size, on a plain chip
  at 4.5:1. Text the reference sets on its photo sits on the hatch the same
  way. Define the pattern once per page and reuse its id.

```html
<figure class="ph">
  <svg class="ph-hatch" aria-hidden="true">
    <defs><pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#hatch)" />
  </svg>
  <figcaption>[PLACEHOLDER: the product in use, 1440x900, full bleed]</figcaption>
</figure>
```

```css
.ph { position: relative; margin: 0; min-height: 900px; background: var(--surface); }
.ph-hatch { position: absolute; inset: 0; width: 100%; height: 100%; }
.ph-hatch line { stroke: var(--line); stroke-width: 1; }
.ph figcaption { position: relative; display: inline-block; background: var(--neutral); color: var(--ink); }
```

## Counter-moves

What distinctive pages do where generated ones reach for the default:

- Set a section name at display size and let the edge of the page crop it.
- Pin one orientation device (a sticky price bar, a progress rail) instead of a
  floating pill navbar.
- Typeset the price and terms like a document (a receipt, a terms list)
  instead of a pricing card. Never a hairline spec table as the hero's second
  half (tells.md).
- Put text straight on a photo that was framed to leave room for it, with no
  dark scrim.
- Draw your own marks. No icon sets, no emoji, no sparkles [`icon-libraries`].
- Show real artifacts as evidence: the prototype, the founder's notebook, the
  workbench, or a labeled illustration or concept mock. Otherwise a plain or
  hatched `[PLACEHOLDER: ...]` box [`placeholder-styled`].

## Mobile, designed at 390

Write the 390 plan in DESIGN.md Layout: what stays dominant, what disappears,
what reorders, what grows. Stacking the desktop is not a plan.

- Headline, price and button inside the first 844px
  (check: `commitment-above-fold`).
- Tap targets at least 44px. Inputs at 16px or larger, so phones do not zoom.
  Never lock zoom [`user-scalable`].
- No sideways scroll from 320px up (check: `overflow`). Image columns use
  `minmax(0, 1fr)`; wide moments get `overflow-x: clip`.
- Buttons and nav links never wrap to two lines (check: `two-line-button`).

## Subtraction pass

Before leaving stage 6, remove every section that does not move the visitor
toward the commitment, every decoration and animation that carries no meaning,
every color beyond the anchor, the accent and the neutrals, and every font
weight without a distinct job. Generated work adds. Designed work removes.
