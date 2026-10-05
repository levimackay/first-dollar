# Design rules

Load at stage 4 with the extraction, and keep it open through stages 5 and 6.
The reference supplies the direction. These rules fill the gaps it leaves and
stop the gaps from filling with defaults. A lint rule id in brackets means the
rule is enforced; see slop-rules.md for the fix.

Generic pages are not a talent problem. Every choice has a path of least
resistance (a default face, a stock purple, 8px corners, three cards, a centered
hero, the same padding everywhere). Each is defensible alone. Together they are
the look people now spot as generated. The fix is deciding on purpose, before
markup, and writing it down in DESIGN.md.

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
- Material: for each planned section, what it is made of (a real photo, the
  prototype, the founder's words, the terms table) and who supplies it. Cut
  sections nothing fills. An empty page gets filled with big type, gradients,
  bordered cards and soft glows, and those four together are the signature.

## Type

- Two families at most: one for display, one for text. A third (mono for
  prices and specs) needs a stated reason.
- No default faces [`banned-font-family`]. Swaps: design-extraction.md section 6.
- Pair for contrast: serif with grotesque, or condensed display with a
  humanist text face. Two similar sans faces are not a pair. One variable
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

- One anchor. Derive the neutrals from it, tinted toward its hue (OKLCH chroma
  about 0.005 to 0.02). Pure `#000`, `#fff` and `#808080` read as untouched.
- One accent, used mainly by the commitment button. A second color only for
  error states.
- Commit to a dominant: one color owns most of the surface. Five colors at 20%
  each reads undecided.
- Light or dark is a decision from the reference and the buyer, never from the
  category ("dev tools are dark").
- Banned: the indigo, violet, purple and fuchsia family, and cyan to purple
  gradients [`ai-palette`, `tailwind-defaults`]. Cream paper with a serif and a
  terracotta accent is the newer default; use it only when the reference has it.
- Gradients: two linear at most, no radial, no blurred glow layers
  [`gradient-budget`]. No colored glow shadows [`glow-shadow`].
- Contrast: 4.5:1 for body text, 3:1 for text 24px and up. The check script
  measures it. Grey on grey at 3:1 for body reads cheap.
- Use OKLCH to build ramps; record hex in DESIGN.md.
- Theme the browser surfaces from tokens: `::selection`, `caret-color`, a
  `:focus-visible` ring at 3:1, `accent-color`, `scrollbar-color`,
  `text-underline-offset` [`browser-surfaces`].
- With real photography, take the palette from the photos.

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
- Prefer asymmetry: a left-aligned hero with the commitment block in view beats
  the centered stack [`centred-hero`].
- More space above a heading than below it.
- Radius: one or two values with a reason ("sharp everywhere, pill on the
  button only"). Never the same radius on everything [`uniform-radius`]. No
  cards inside cards [`nested-cards`]. No colored stripe down one side of a
  box [`side-stripe`].
- No dot or line grid backgrounds [`grid-background`].

## Motion

- One orchestrated moment, usually the load: headline, then the commitment
  block, 60 to 100ms apart. Nothing else enters on scroll by default.
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

Choose the page's shape before styling it. A terracotta button on a centered
hero over three cards is still the generated page in a different shirt.

Any shape works if the first screen holds the offer, the price and the button,
the objection answers sit near the button, and a real person stands behind it.

| Shape | What it is | Suits |
|---|---|---|
| Letter | One column at reading width in the founder's voice; price inline and again in a terms box | Services and pilots sold on trust |
| Specimen | The product, or its photo, very large in the first screen; the offer small and exact under it | Physical goods with a real photo or render |
| Spec sheet | A dense table of what you get, when, and for how much | Technical buyers who compare |
| Split | A sticky pane with price, terms and button beside a scrolling pane of mechanism and proof | Keeping the commitment in view on long pages |
| Stat-led | One real number dominating the first screen: the price, the ship date, the cap | Offers where one fact decides |
| Manifesto | A strong statement, then what you will and will not build | Opinionated tools |
| Before and after | Today's workaround beside the new way | Replacing a known chore |
| Walkthrough | 3 to 5 steps of the real flow with real screenshots | A prototype that already works |
| Order form | The page is the form: options, quantity, price, button | Pre-orders with variants |

Never the only structure: hero, three cards, testimonials, CTA
[`three-card-row`, `stat-row`, `logo-row`]. No bento grid by reflex.

## Counter-moves

What distinctive pages do where generated ones reach for the default:

- Alternate density hard instead of keeping every section the same weight.
- Set a section name at display size and let the edge of the page crop it.
- Pin one orientation device (a sticky price bar, a progress rail) instead of a
  floating pill navbar.
- Typeset the price and terms like a document (a receipt, a spec table)
  instead of a pricing card.
- Put text straight on a photo that was framed to leave room for it, with no
  dark scrim.
- Draw your own marks. No icon sets, no emoji, no sparkles [`icon-libraries`].
- Show real artifacts as evidence: the prototype, the founder's notebook, the
  workbench. Or a labeled placeholder that looks like one
  [`placeholder-styled`].

## Mobile, designed at 390

Write the 390 plan in DESIGN.md Layout. Stacking the desktop is not a plan.

- What stays dominant: headline, price and button inside the first 844px
  (check: `commitment-above-fold`).
- What disappears, what reorders, what grows.
- Tap targets at least 44px. Inputs at 16px or larger, so phones do not zoom.
  Never lock zoom [`user-scalable`].
- No sideways scroll from 320px up (check: `overflow`). Image columns use
  `minmax(0, 1fr)`; wide moments get `overflow-x: clip`.
- Buttons and nav links never wrap to two lines (check: `two-line-button`).

## Subtraction pass

Before leaving stage 6, remove:

- Every section that does not move the visitor toward the commitment.
- Every decoration that carries no meaning.
- Every animation that does not clarify something.
- Every color beyond the anchor, the accent and the neutrals.
- Every font weight without a distinct job.

Generated work adds. Designed work removes.
