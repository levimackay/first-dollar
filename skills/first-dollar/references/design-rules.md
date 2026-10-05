# Design rules

Load at stage 4 and keep it open through stage 6. The reference supplies the
direction; these rules fill the gaps it leaves so defaults cannot. A lint rule
id in brackets is enforced (slop-rules.md has the fix).

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
- Material: for each section of reference-structure.md, what fills it and
  who supplies it, by what the reference shows (SKILL.md stage 4). Fill
  every image region (below); cut a text section the founder has nothing
  for, never pad it with big type, cards, gradients or clip art.

## Type

- Two families at most: one for display, one for text, both matched to the
  reference by features (design-extraction.md section 6). No default or
  popular faces [`banned-font-family`, `font-popularity`].
- Mono for nav, labels, data and fine print only when the reference sets
  that very text in mono; put `data-mono` on fine print set so and log it in
  DESIGN.md Provenance. Running prose, sentences in paragraphs, is never mono
  [`mono-prose`].
- Where the reference leaves a value open, take the nearest thing it shows
  and say so in DESIGN.md. Its headline to body ratio picks the scale; build
  the steps from it. Display at least 2.5 times the body [`flat-type-scale`].
  One family across its weights draws `single-sans-family`: answer it in
  DESIGN.md.
- The display face goes where the reference uses it, at the weight it uses
  there. A heavy display on every heading reads generated when the reference
  sets its section heads lighter or in the text face.
- Display gets negative tracking: about -0.02em at 48px, -0.03em to -0.04em
  above 72px, never tighter than -0.04em. Body stays at 0.
- Line height falls as size rises: body 1.5 to 1.65, headings 1.05 to 1.2.
  Body measure `max-width: 65ch` [`long-measure`].
- No gradient on words [`gradient-text`]. No accent color on one word of the
  headline. No italic display headline by reflex.
- `font-variant-numeric: tabular-nums` on prices, dates and counts.
- Sentence case on headings and buttons. `text-wrap: balance` on headings,
  `text-wrap: pretty` on paragraphs.

## Color

- Sample, never describe: every color comes from `--palette` on the
  reference (or on the founder's photos when the page is built around them)
  and is used exactly as sampled, pure white or black included. Never tint a
  sampled ground. Derive only the neutrals the reference does not show (a
  border, a hover) from the anchor in OKLCH, as hex.
- One accent, used mainly by the commitment button; a second color only for
  error states. With no accent hue in the reference, the accent is its
  strongest ink or its button color. Never invent a hue.
- One color owns most of the surface. Match the reference's energy too: its
  saturation and how much of the screen its accent owns.
- Light or dark comes from the reference [`reference-drift`], never from the
  category ("dev tools are dark") or habit. A dark photo hero on a light site
  is fine; never repaint the page to match a photo.
- Banned: the indigo, violet, purple and fuchsia family, and cyan to purple
  gradients [`ai-palette`, `tailwind-defaults`]. Cream paper with a serif and
  a terracotta accent only when the reference has it. Two linear gradients at
  most, no radial, no glow layers or colored glow shadows
  [`gradient-budget`, `glow-shadow`].
- Contrast: 4.5:1 for body text, 3:1 at 24px and up (the check measures it).
- Theme the browser surfaces from tokens: `::selection`, `caret-color`, a
  `:focus-visible` ring at 3:1, `accent-color`, `scrollbar-color`,
  `text-underline-offset` [`browser-surfaces`].

## Space

- One base unit (4px or 8px). Every margin, padding and gap is a multiple.
- Spacing follows the reference's measured gap-to-content rhythm, from its
  full-page shot [`uniform-section-padding`]. No gap is taller than the
  content beside it unless the reference does that. Record the measured gaps
  in DESIGN.md Layout.
- Full bleed, varied measures and a grid break come from the reference:
  where it does them, or none [`no-full-bleed`, `same-max-width`; keep a
  warning with a Do's and Don'ts line when the reference has none].
- The hero copies the reference's hero layout (reference-structure.md): text
  over a full-bleed image, a centered statement, a split. Headline left with
  an object right only when the reference is split. A centered hero with one
  ask is fine; the two-button centered template fails [`centred-hero`].
- Section order, count and layout come from reference-structure.md, never a
  skeleton. No inverted closing band unless the reference has one.
- More space above a heading than below it.
- Radius: one or two values from the reference, each with a reason. A pill
  button only when the reference has one. Never the same radius on
  everything [`uniform-radius`]. No cards inside cards [`nested-cards`]. No
  colored stripe down one side of a box [`side-stripe`].
- No dot or line grid backgrounds [`grid-background`].

## Motion

motion.md holds the rules and recipes. In short: one signature motion (the
mechanism inside the software mock; for a physical product, a part the
reference animates, or none), plus the supporting moves its energy row
allows. Transform and opacity only [`transition-all`], no overshoot
[`bounce-easing`], no hover zoom or pulsing dots [`hover-zoom`, `pulse-dot`].
Content is visible without the animation and with reduced motion (checks:
`hidden-after-reveal`, `reduced-motion`). The headline and the commitment
button never fade or slide away.

## Macrostructures

reference-structure.md is the plan; these names only label the reference's
shape, never a template to fill. Any shape works if the first screen holds the
offer, the price and the button, the money terms sit where the reference puts
its small print, and a real person stands behind it.

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

What the reference shows in each region decides the fill (SKILL.md stage 4,
Material), not the product type: people, places and scenes get photo slots
on software pages too, and a mock goes only where the reference shows its own
product. Never a void, and never flat vector clip art where a photo belongs.

Measure first. On the reference's `1440.png`, `full-1440.png` and `390.png`,
note each image region's share of the width, its height, whether it bleeds
off an edge, and where text sits on or beside it. The fill takes the same
box: a full-bleed photo hero stays full bleed, with the headline over it
where the reference sets it. At 390, keep it where the reference's phone
layout keeps it, with a real height.

**An HTML and CSS mock.** Where the reference shows its own product, on a
software page. The signature motion plays here (motion.md).

- The product's real interface, or the one screen that shows the outcome
  (the signed change order, the report), at real proportions, in the page's
  fonts and tokens. Sample values are generic, never a real person or
  company. Caption it: "Concept. Numbers are examples."
- Crop and place it the way the reference treats its photo: if the photo
  bleeds off the edge, the mock does too. One detail set large (a single row
  of the report) can beat the whole screen set small.
- One surface with rows and rules inside. Cards inside a card fail
  [`nested-cards`]. No fake window chrome or generic phone bezel unless the
  reference shows one.

**A labeled photo slot.** Where the reference shows people, a place, a scene
or a portrait, and for a physical product's own product shot.

- The reference image's exact aspect, size and position, full bleed if it
  was. Text the reference sets on its photo sits on the slot the same way.
- The label is a shot direction the founder can hand a photographer:
  subject, setting, light, aspect, written for this page. The kind, never to
  copy: a product (the unit in a hand, side light, 4:5), a person (the
  founder at work, eye level, 1:1), a place (the street front at dusk,
  16:9). On a plain chip at 4.5:1, in the text face.
- Hatch with one inline SVG pattern in the `line` token, defined first thing
  in `<body>` and reused; its spacing and stroke follow the reference's own
  rule weight. A CSS gradient hatch draws `grid-background` and
  `placeholder-styled`. `aspect-ratio` is the measured width over height.

```html
<svg class="ph-defs" width="0" height="0" aria-hidden="true"><defs><pattern id="hatch" width="<gap>" height="<gap>" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="<gap>" /></pattern></defs></svg>

<figure class="ph">
  <svg class="ph-hatch" aria-hidden="true"><rect width="100%" height="100%" fill="url(#hatch)" /></svg>
  <figcaption>[PLACEHOLDER: <subject>, <setting>, <light>, <aspect>]</figcaption>
</figure>
```

```css
.ph-defs { position: absolute; }
.ph-defs line { stroke: var(--line); stroke-width: <the reference's rule weight>; }
.ph { position: relative; margin: 0; aspect-ratio: <measured w> / <measured h>; background: var(--surface); }
.ph-hatch { position: absolute; inset: 0; width: 100%; height: 100%; }
.ph figcaption { position: relative; display: inline-block; background: var(--neutral); color: var(--ink); }
```

**A drawn illustration (inline SVG).** Only where the reference region is
itself a drawing: line drawings, technical drawings, hand-inked marks.

- Draw in the reference's manner (its line weight, its hand, its drafting
  rules), never flat geometric shapes. The product must read as itself at
  390: the stepped seats of a bleacher, not a box with braces. Under about 40
  shapes, filling 60 to 80% of the region.
- Color only from tokens, set by class in the stylesheet, never hex in
  attributes. No gradients, shadows or glows, and never a 24x24 viewBox with
  round caps and a 2px stroke [`icon-libraries`].
- A visible "Illustration" caption in the text face, `role="img"` and an
  `aria-label`. Labels on the drawing connect to their part with a leader.

## Gap markers

Every visible `[NEED: ...]` sits in `<span class="need">`, styled so it reads
as a gap someone will fill, not as a broken render:

- The surrounding text's own font, size and weight (`font: inherit`), never
  a grey sans inside a mono or serif page.
- A background in the `highlight` token: the reference's own highlight color
  if it has one (a marker yellow, a selection tint), otherwise the accent at
  about 12% over the ground, as hex. Ink stays 4.5:1 on it.
- Padding about 0.1em 0.35em and `box-decoration-break: clone`, so a marker
  that wraps keeps its padding on both lines.
- A normal space each side, never butted against a word:
  `Ships by <span class="need">[NEED: ship date]</span>.`
- Never a dashed or dotted outline, a grey box or a second font. In the logo
  slot it sits where the reference's wordmark sits, at its size.

```css
.need { font: inherit; color: var(--ink); background: var(--highlight); padding: 0.1em 0.35em;
  -webkit-box-decoration-break: clone; box-decoration-break: clone; }
```

## Counter-moves

At most one, and only where the reference shows it: a section name at display
size cropped by the page edge, one pinned orientation device (a sticky price
bar, a progress rail), or text straight on a photo framed to leave room for
it. Never a hairline spec table as the hero's second half (tells.md). Draw
your own marks: no icon sets, emoji or sparkles [`icon-libraries`].

## Mobile, designed at 390

Write the 390 plan in DESIGN.md Layout: what stays dominant, what disappears,
what reorders, what grows. Stacking the desktop is not a plan.

- Headline, price and button inside the first 844px (`commitment-above-fold`).
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
